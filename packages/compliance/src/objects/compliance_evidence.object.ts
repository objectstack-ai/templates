// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F } from '@objectstack/spec';
/**
 * Evidence — a piece of proof supporting one or more controls. Attach
 * PDFs / screenshots / logs via the platform's sys_attachment slot.
 * `expires_on` drives the renewal alert flow.
 */
export const Evidence = ObjectSchema.create({
  name: 'compliance_evidence',
  label: 'Evidence',
  pluralLabel: 'Evidence',
  icon: 'paperclip',
  description: 'Proof (screenshot, exported log, policy doc) that supports one or more controls.',

  fieldGroups: [
    { key: 'core', label: 'Evidence', icon: 'paperclip' },
    { key: 'lifecycle', label: 'Lifecycle', icon: 'calendar' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    title: Field.text({
      label: 'Title',
      required: true,
      maxLength: 200,
      searchable: true,
      group: 'core',
    }),
    control: Field.lookup('compliance_control', {
      label: 'Primary Control',
      required: true,
      group: 'core',
    }),
    evidence_type: Field.select({
      label: 'Type',
      required: true,
      group: 'core',
      options: [
        { label: 'Policy Document', value: 'policy', default: true },
        { label: 'Screenshot', value: 'screenshot' },
        { label: 'System Log Export', value: 'log' },
        { label: 'Configuration Export', value: 'config' },
        { label: 'Training Record', value: 'training' },
        { label: 'Penetration Test Report', value: 'pentest' },
        { label: 'External Audit Letter', value: 'audit_letter' },
        { label: 'Other', value: 'other' },
      ],
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Pending', value: 'pending', color: '#94A3B8', default: true },
        { label: 'Submitted', value: 'submitted', color: '#3B82F6' },
        { label: 'Approved', value: 'approved', color: '#10B981' },
        { label: 'Rejected', value: 'rejected', color: '#EF4444' },
        { label: 'Expired', value: 'expired', color: '#F59E0B' },
      ],
    }),
    description: Field.markdown({ label: 'Description', group: 'core' }),
    collected_on: Field.date({
      label: 'Collected On',
      required: true,
      group: 'lifecycle',
    }),
    expires_on: Field.date({
      label: 'Expires On',
      group: 'lifecycle',
      description: 'Evidence must be re-collected by this date.',
    }),
    is_expiring_soon: Field.formula({
      label: 'Expiring ≤ 30 days',
      group: 'lifecycle',
      expression: F`record.expires_on != null && record.expires_on >= today() && record.expires_on <= daysFromNow(30)`,
    }),
    is_expired: Field.formula({
      label: 'Expired',
      group: 'lifecycle',
      expression: F`record.expires_on != null && record.expires_on < today()`,
    }),
    collected_by: Field.lookup('sys_user', { label: 'Collected By', group: 'lifecycle' }),
    approved_by: Field.lookup('sys_user', { label: 'Approved By', group: 'lifecycle' }),
    source_url: Field.text({
      label: 'Source URL',
      group: 'meta',
      maxLength: 500,
      description: 'Optional link to upstream system (Jira ticket, Datadog query, etc.)',
    }),
    notes: Field.markdown({ label: 'Notes', group: 'meta' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['control'] },
    { fields: ['status'] },
    { fields: ['expires_on'] },
    { fields: ['evidence_type'] },
  ],

  nameField: 'title',
  compactLayout: ['title', 'control', 'evidence_type', 'status', 'expires_on'],

  validations: [
    {
      type: 'state_machine',
      name: 'evidence_lifecycle',
      field: 'status',
      transitions: {
        pending: ['submitted'],
        submitted: ['approved', 'rejected'],
        approved: ['expired'],
        rejected: ['pending'],
        expired: ['pending'],
      },
      message: 'Illegal status transition.',
    },
    {
      name: 'submitted_requires_collected_on',
      type: 'script',
      severity: 'error',
      message: 'Submitted evidence must have a collected_on date.',
      condition: P`record.status == "submitted" && record.collected_on == null`,
    },
    {
      name: 'expires_after_collected',
      type: 'script',
      severity: 'error',
      message: 'expires_on must be on or after collected_on.',
      condition: P`record.expires_on != null && record.collected_on != null && record.expires_on < record.collected_on`,
    },
  ],
});
