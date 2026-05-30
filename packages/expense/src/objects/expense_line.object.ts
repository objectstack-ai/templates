// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';

/**
 * Expense Line — one out-of-pocket item on a report (a meal, a flight, a
 * taxi). Lines belong to exactly one `expense_report`; their `amount`
 * rolls up into `expense_report.total_amount` via the line hook.
 *
 * Policy in v0 is deliberately light: a fixed receipt-required threshold
 * (`needs_receipt` ≥ 75) plus the category's soft per-transaction limit.
 * Hard per-category enforcement is a fork point — see CHARTER.md.
 */
export const ExpenseLine = ObjectSchema.create({
  name: 'expense_line',
  label: 'Expense Line',
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
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    files: true,
    feeds: true,
    trash: true,
  },

  indexes: [
    { fields: ['expense_report'] },
    { fields: ['category'] },
    { fields: ['expense_date'] },
  ],

  titleFormat: tmpl`{{record.description}}`,
  displayNameField: 'description',
  compactLayout: ['description', 'category', 'amount', 'expense_date', 'merchant'],

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
