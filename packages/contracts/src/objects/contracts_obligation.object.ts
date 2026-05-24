// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';

/**
 * Obligation — anything we (or the counterparty) committed to do on a given
 * date. Auto-seeded from `extracted_clauses` by the signed → obligations
 * flow; can also be added manually.
 *
 * Examples:
 *   - "Pay $12,000 annual renewal" (us, recurring)
 *   - "Deliver Q2 statement of work" (us, one-off)
 *   - "Provide SOC2 report annually" (counterparty)
 */
export const Obligation = ObjectSchema.create({
  name: 'contracts_obligation',
  label: 'Obligation',
  pluralLabel: 'Obligations',
  icon: 'check-circle',
  description: 'A dated commitment tied to a contract.',

  fieldGroups: [
    { key: 'core', label: 'Obligation', icon: 'check-circle' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    summary: Field.text({
      label: 'Summary',
      required: true,
      searchable: true,
      maxLength: 200,
      group: 'core',
    }),

    contract: Field.lookup('contracts_contract', {
      label: 'Contract',
      required: true,
      group: 'core',
    }),

    obligor: Field.select({
      label: 'Owed By',
      required: true,
      group: 'core',
      options: [
        { label: 'Us', value: 'us', color: '#3B82F6', default: true },
        { label: 'Counterparty', value: 'counterparty', color: '#F59E0B' },
      ],
    }),

    kind: Field.select({
      label: 'Kind',
      required: true,
      group: 'core',
      options: [
        { label: 'Payment', value: 'payment', color: '#10B981', default: true },
        { label: 'Deliverable', value: 'deliverable', color: '#3B82F6' },
        { label: 'Report / Disclosure', value: 'report', color: '#8B5CF6' },
        { label: 'Notice', value: 'notice', color: '#F59E0B' },
        { label: 'Other', value: 'other', color: '#6B7280' },
      ],
    }),

    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Open', value: 'open', color: '#94A3B8', default: true },
        { label: 'Done', value: 'done', color: '#10B981' },
        { label: 'Waived', value: 'waived', color: '#6B7280' },
      ],
    }),

    due_date: Field.date({ label: 'Due Date', required: true, group: 'core' }),

    amount: Field.currency({
      label: 'Amount',
      min: 0,
      group: 'core',
      description: 'Required for kind=payment. Currency: USD (override per-fork).',
    }),

    assignee: Field.lookup('user', {
      label: 'Assignee',
      group: 'core',
      description: 'Internal owner responsible for fulfilling or chasing this obligation.',
    }),

    completed_at: Field.datetime({
      label: 'Completed At',
      readonly: true,
      group: 'meta',
    }),

    is_overdue: Field.formula({
      label: 'Overdue?',
      group: 'meta',
      expression: F`record.due_date != null && record.status == "open" && record.due_date < today()`,
    }),

    notes: Field.markdown({ label: 'Notes', group: 'meta' }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    feeds: true,
    activities: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['contract'] },
    { fields: ['due_date'] },
    { fields: ['status'] },
    { fields: ['assignee'] },
  ],

  titleFormat: tmpl`{{record.summary}}`,
  compactLayout: ['summary', 'contract', 'kind', 'status', 'due_date', 'amount'],

  validations: [
    {
      name: 'payment_requires_amount',
      type: 'script',
      severity: 'error',
      message: 'Payment obligations must have an amount.',
      condition: P`record.kind == "payment" && (record.amount == null || record.amount == 0)`,
    },
  ],

  workflows: [
    {
      name: 'stamp_completed_at',
      objectName: 'contracts_obligation',
      triggerType: 'on_update',
      criteria: P`record.status == "done" && previous.status != "done"`,
      active: true,
      actions: [
        { name: 'set_completed_at', type: 'field_update', field: 'completed_at', value: 'now()' },
      ],
    },
  ],
});
