// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { F } from '@objectstack/spec';

/**
 * Employee Document — contract, ID copy, certification, etc. The
 * `expires_at` field drives the `hr_document_expiring_soon` flow, which
 * notifies HR 30 days before expiry.
 *
 * File binary data is stored via the platform's polymorphic `sys_attachment`
 * surface (sys_attachment). The fields here are metadata only.
 */
export const EmployeeDocument = ObjectSchema.create({
  name: 'hr_document',
  sharingModel: 'private',
  label: 'Employee Document',
  pluralLabel: 'Employee Documents',
  icon: 'file-text',
  description: 'A document attached to an employee record (contract, ID, certification).',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      searchable: true,
      maxLength: 160,
    }),
    employee: Field.lookup('hr_employee', {
      label: 'Employee',
      required: true,
    }),
    doc_type: Field.select({
      label: 'Type',
      required: true,
      options: [
        { label: 'Employment Contract', value: 'contract', default: true },
        { label: 'ID / Passport Scan', value: 'id' },
        { label: 'Certification', value: 'certification' },
        { label: 'Visa / Work Permit', value: 'visa' },
        { label: 'Other', value: 'other' },
      ],
    }),
    issued_on: Field.date({ label: 'Issued On' }),
    expires_at: Field.date({
      label: 'Expires At',
      description: 'Drives the expiry-reminder flow.',
    }),
    is_expiring_soon: Field.formula({
      label: 'Expiring Soon?',
      // `daysFromNow(30)`, not `today() + 30`: the CEL formula engine has no
      // `Timestamp + int` operator, so `today() + 30` evaluates to null and the
      // whole comparison silently fails. Day offsets go through the builtin.
      expression: F`record.expires_at != null && record.expires_at >= today() && record.expires_at <= daysFromNow(30)`,
    }),
    is_expired: Field.formula({
      label: 'Expired?',
      expression: F`record.expires_at != null && record.expires_at < today()`,
    }),
    expiry_status: Field.formula({
      label: 'Expiry Status',
      description: 'Single severity band for sorting/colour-coding the document list.',
      // `daysFromNow(N)`, not `today() + N`: CEL has no `Timestamp + int` operator
      // (see is_expiring_soon above), so the offset bands must use the builtin.
      expression: F`record.expires_at == null ? "none" : (record.expires_at < today() ? "expired" : (record.expires_at <= daysFromNow(30) ? "expiring_30d" : (record.expires_at <= daysFromNow(60) ? "expiring_60d" : "valid")))`,
    }),
    notes: Field.markdown({ label: 'Notes' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['employee'] }, { fields: ['doc_type'] }, { fields: ['expires_at'] }],

  nameField: 'name',
  highlightFields: ['name', 'employee', 'doc_type', 'expires_at', 'expiry_status'],
});
