// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Framework — the catalog of standards you certify against. One per
 * SOC2 / ISO 27001 / HIPAA / GDPR / PCI / custom. Controls hang off it.
 */
export const Framework = ObjectSchema.create({
  name: 'compliance_framework',
  sharingModel: 'public_read',
  label: 'Framework',
  pluralLabel: 'Frameworks',
  icon: 'shield-check',
  description: 'A compliance standard you are certifying against (SOC 2, ISO 27001, HIPAA, etc.).',

  fields: {
    short_name: Field.text({
      label: 'Short Name',
      required: true,
      unique: true,
      maxLength: 40,
      description: 'e.g. SOC2, ISO27001, HIPAA',
    }),
    full_name: Field.text({
      label: 'Full Name',
      required: true,
      maxLength: 200,
      searchable: true,
    }),
    family: Field.select({
      label: 'Family',
      options: [
        { label: 'SOC 2', value: 'soc2', default: true },
        { label: 'ISO 27001 / 27002', value: 'iso27001' },
        { label: 'HIPAA', value: 'hipaa' },
        { label: 'GDPR', value: 'gdpr' },
        { label: 'PCI DSS', value: 'pci' },
        { label: 'NIST CSF', value: 'nist_csf' },
        { label: 'Custom', value: 'custom' },
      ],
    }),
    version: Field.text({
      label: 'Version',
      maxLength: 40,
      description: 'e.g. 2017 (TSC), 2022, v3.2.1',
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      options: [
        { label: 'Active', value: 'active', color: '#10B981', default: true },
        { label: 'Adopted', value: 'adopted', color: '#3B82F6' },
        { label: 'Retired', value: 'retired', color: '#94A3B8' },
      ],
    }),
    next_audit_date: Field.date({
      label: 'Next Audit Date',
      description: 'When the next external audit is scheduled.',
    }),
    auditor: Field.text({ label: 'External Auditor', maxLength: 200 }),
    description: Field.markdown({ label: 'Description' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['short_name'] }, { fields: ['family'] }, { fields: ['status'] }],

  nameField: 'short_name',
  highlightFields: ['short_name', 'family', 'version', 'status', 'next_audit_date'],
});
