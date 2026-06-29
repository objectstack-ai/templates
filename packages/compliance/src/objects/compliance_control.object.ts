// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F } from '@objectstack/spec';

/**
 * Control — an individual requirement from a framework. e.g. SOC2
 * CC6.1 ("Logical access controls"). Linked to many Evidence and
 * Assessment records over time.
 */
export const Control = ObjectSchema.create({
  name: 'compliance_control',
  label: 'Control',
  pluralLabel: 'Controls',
  icon: 'shield',
  description:
    'An individual control requirement (e.g. SOC 2 CC6.1) that needs evidence and periodic assessment.',

  fieldGroups: [
    { key: 'core', label: 'Control', icon: 'shield' },
    { key: 'ownership', label: 'Ownership', icon: 'user' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    code: Field.text({
      label: 'Control Code',
      required: true,
      maxLength: 80,
      searchable: true,
      group: 'core',
      description: 'e.g. CC6.1, A.5.1, §164.308(a)(1)',
    }),
    title: Field.text({
      label: 'Title',
      required: true,
      maxLength: 200,
      searchable: true,
      group: 'core',
    }),
    framework: Field.lookup('compliance_framework', {
      label: 'Framework',
      required: true,
      group: 'core',
    }),
    category: Field.select({
      label: 'Category',
      group: 'core',
      options: [
        { label: 'Access Control', value: 'access', default: true },
        { label: 'Change Management', value: 'change' },
        { label: 'Risk Management', value: 'risk' },
        { label: 'Vendor Management', value: 'vendor' },
        { label: 'Incident Response', value: 'incident' },
        { label: 'Data Protection', value: 'data' },
        { label: 'Physical Security', value: 'physical' },
        { label: 'Other', value: 'other' },
      ],
    }),
    criticality: Field.select({
      label: 'Criticality',
      required: true,
      group: 'core',
      options: [
        { label: 'High', value: 'high', color: '#EF4444' },
        { label: 'Medium', value: 'medium', color: '#F59E0B', default: true },
        { label: 'Low', value: 'low', color: '#10B981' },
      ],
    }),
    last_status: Field.select({
      label: 'Last Test Result',
      group: 'core',
      description: 'Rolled up from most recent assessment.',
      options: [
        { label: 'Not Tested', value: 'not_tested', color: '#94A3B8', default: true },
        { label: 'Passed', value: 'passed', color: '#10B981' },
        { label: 'Partial', value: 'partial', color: '#F59E0B' },
        { label: 'Failed', value: 'failed', color: '#EF4444' },
      ],
    }),
    description: Field.markdown({ label: 'Description', group: 'core' }),
    owner: Field.lookup('sys_user', { label: 'Control Owner', group: 'ownership' }),
    review_frequency_days: Field.number({
      label: 'Review Frequency (days)',
      group: 'ownership',
      min: 1,
      defaultValue: 90,
      description: 'How often this control should be re-assessed. Default 90 (quarterly).',
    }),
    last_assessed_at: Field.datetime({
      label: 'Last Assessed At',
      group: 'ownership',
      description: 'Set by hook when a related assessment moves to passed/failed/partial.',
    }),
    is_overdue_for_review: Field.formula({
      label: 'Overdue for Review',
      group: 'ownership',
      expression: F`record.last_assessed_at == null || record.review_frequency_days == null || daysFromNow(0) > record.last_assessed_at + record.review_frequency_days * 86400000`,
    }),
    notes: Field.markdown({ label: 'Notes', group: 'meta' }),

    // ADR-0079: real field holding the record title (was the render-only
    // `titleFormat` template `{{code}} · {{title}}`). A stored formula so the
    // server can return/query the display name.
    display_name: Field.formula({
      label: 'Display Name',
      group: 'meta',
      expression: F`coalesce(record.code, '') + ' · ' + coalesce(record.title, '')`,
    }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['framework'] },
    { fields: ['code'] },
    { fields: ['criticality'] },
    { fields: ['last_status'] },
  ],

  displayNameField: 'display_name',
  compactLayout: ['code', 'title', 'framework', 'criticality', 'last_status'],

  validations: [
    {
      name: 'review_frequency_positive',
      type: 'script',
      severity: 'error',
      message: 'review_frequency_days must be positive.',
      condition: P`record.review_frequency_days != null && record.review_frequency_days <= 0`,
    },
  ],
});
