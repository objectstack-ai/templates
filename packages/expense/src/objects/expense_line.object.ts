// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F } from '@objectstack/spec';

/**
 * Expense Line — one out-of-pocket item on a report (a meal, a flight, a
 * taxi). Lines belong to exactly one `expense_report`. Their `amount`
 * contributes to `expense_report.total_amount`, but that header total is a
 * STORED field maintained at the top level (client/seed) — NOT a rollup hook:
 * a nested `update` of the parent from a line hook re-enters the QuickJS
 * sandbox and crashes the runtime. See CHARTER.md ("Rollup vs. lifecycle
 * hooks").
 *
 * Policy in v0 is deliberately light: a fixed receipt-required threshold
 * (`needs_receipt` ≥ 75) plus the category's soft per-transaction limit.
 * Hard per-category enforcement is a fork point — see CHARTER.md.
 */
export const ExpenseLine = ObjectSchema.create({
  name: 'expense_line',
  label: 'Expense Line',
  // Owner-scoped, same as its parent report (lines are created by the submitter).
  sharingModel: 'private',
  pluralLabel: 'Expense Lines',
  icon: 'list',
  description: 'A single itemized expense on a report.',

  fieldGroups: [
    { key: 'detail', label: 'Detail', icon: 'list' },
    { key: 'receipt', label: 'Receipt', icon: 'paperclip' },
  ],

  fields: {
    expense_report: Field.lookup('expense_report', {
      label: 'Expense Report',
      required: true,
      group: 'detail',
    }),
    expense_date: Field.date({
      label: 'Date',
      required: true,
      group: 'detail',
    }),
    category: Field.lookup('expense_category', {
      label: 'Category',
      group: 'detail',
    }),
    description: Field.text({
      label: 'Description',
      required: true,
      searchable: true,
      maxLength: 200,
      group: 'detail',
      description: 'What it was. e.g. "Dinner with prospect — Acme".',
    }),
    merchant: Field.text({
      label: 'Merchant',
      maxLength: 120,
      group: 'detail',
    }),
    amount: Field.currency({
      label: 'Amount',
      required: true,
      min: 0,
      group: 'detail',
    }),
    payment_source: Field.select({
      label: 'Paid With',
      group: 'detail',
      options: [
        { label: 'Personal Card', value: 'personal_card', default: true },
        { label: 'Cash', value: 'cash' },
        { label: 'Personal — Other', value: 'personal_other' },
      ],
    }),
    reimbursable: Field.boolean({
      label: 'Reimbursable',
      defaultValue: true,
      group: 'detail',
      description:
        'Uncheck for personal / non-reimbursable items. The reimbursable header total should exclude these (maintained client-side; not a hook rollup).',
    }),
    needs_receipt: Field.formula({
      label: 'Receipt Required',
      group: 'receipt',
      expression: F`record.amount != null && record.amount >= 75`,
    }),
    receipt_attached: Field.boolean({
      label: 'Receipt Attached',
      defaultValue: false,
      group: 'receipt',
      description: 'Check once the receipt image/PDF is uploaded to Files.',
    }),
    notes: Field.markdown({ label: 'Notes', group: 'receipt' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
  },

  indexes: [{ fields: ['expense_report'] }, { fields: ['category'] }, { fields: ['expense_date'] }],

  nameField: 'description',
  highlightFields: [
    'description',
    'category',
    'amount',
    'reimbursable',
    'expense_date',
    'merchant',
  ],

  validations: [
    {
      name: 'receipt_required_over_threshold',
      type: 'script',
      severity: 'error',
      message: 'Expenses of 75 or more require an attached receipt.',
      condition: P`record.amount != null && record.amount >= 75 && record.receipt_attached != true`,
    },
  ],
});
