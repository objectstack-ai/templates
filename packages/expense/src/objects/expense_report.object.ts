// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';
/**
 * Expense Report — the reimbursement claim an employee submits. It is a
 * header over one or more `expense_line` rows. `total_amount` is a STORED
 * header field maintained at the top level (client/seed), NOT a line-hook
 * rollup: a nested parent `update` from a line hook crashes the QuickJS
 * sandbox. See CHARTER.md ("Rollup vs. lifecycle hooks").
 *
 * Approval is threshold-driven: `approval_required` flips true when
 * `total_amount >= 1000`. Below that, a manager can still approve, but the
 * approval process only *requires* sign-off above the threshold. Tune in
 * your fork (e.g. route by cost center or amount tier).
 */
export const ExpenseReport = ObjectSchema.create({
  name: 'expense_report',
  label: 'Expense Report',
  pluralLabel: 'Expense Reports',
  icon: 'receipt',
  description:
    'An employee reimbursement claim. Groups expense lines, goes through approval, then is paid out.',

  fieldGroups: [
    { key: 'core', label: 'Report', icon: 'receipt' },
    { key: 'financial', label: 'Financial', icon: 'dollar-sign' },
    { key: 'reimbursement', label: 'Reimbursement', icon: 'banknote' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    title: Field.text({
      label: 'Title',
      required: true,
      searchable: true,
      maxLength: 200,
      group: 'core',
      description: 'One-line summary. e.g. "Sales offsite — Berlin, March".',
    }),
    report_number: Field.text({
      label: 'Report Number',
      unique: true,
      maxLength: 40,
      group: 'core',
    }),
    requester: Field.lookup('sys_user', {
      label: 'Employee',
      group: 'core',
      description: 'Person claiming reimbursement. Defaults to created_by.',
    }),
    purpose: Field.markdown({
      label: 'Business Purpose',
      group: 'core',
      description: 'Why these expenses were incurred. Visible to approvers.',
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Draft', value: 'draft', color: '#94A3B8', default: true },
        { label: 'Submitted', value: 'submitted', color: '#F59E0B' },
        { label: 'Approved', value: 'approved', color: '#10B981' },
        { label: 'Rejected', value: 'rejected', color: '#EF4444' },
        { label: 'Reimbursed', value: 'reimbursed', color: '#3B82F6' },
      ],
    }),
    period_start: Field.date({ label: 'Period Start', group: 'core' }),
    period_end: Field.date({ label: 'Period End', group: 'core' }),
    cost_center: Field.text({ label: 'Cost Center', maxLength: 60, group: 'core' }),

    currency: Field.select({
      label: 'Currency',
      group: 'financial',
      options: [
        { label: 'USD', value: 'usd', default: true },
        { label: 'EUR', value: 'eur' },
        { label: 'GBP', value: 'gbp' },
        { label: 'CNY', value: 'cny' },
      ],
      description: 'Single currency per report. Multi-currency FX is a fork point.',
    }),
    total_amount: Field.currency({
      label: 'Total Amount',
      group: 'financial',
      min: 0,
      defaultValue: 0,
      description:
        'Sum of line amounts. Stored header field maintained client-side/seed (not a line rollup hook — that crashes the sandbox; see object docstring).',
    }),
    approval_required: Field.formula({
      label: 'Approval Required',
      group: 'financial',
      expression: F`record.total_amount != null && record.total_amount >= 1000`,
    }),
    submitted_at: Field.datetime({
      label: 'Submitted At',
      group: 'financial',
      description: 'Stamped by the report hook on submit.',
    }),
    approved_at: Field.datetime({ label: 'Approved At', group: 'financial' }),

    // `date` (not `datetime`): the spend-by-month chart filters `reimbursed_at >=
    // {12_months_ago}`, which only matches an ISO-date-string column. See AGENTS.md.
    reimbursed_at: Field.date({ label: 'Reimbursed At', group: 'reimbursement' }),
    payment_method: Field.select({
      label: 'Payment Method',
      group: 'reimbursement',
      options: [
        { label: 'Bank Transfer', value: 'bank_transfer', default: true },
        { label: 'Payroll', value: 'payroll' },
        { label: 'Cash', value: 'cash' },
        { label: 'Check', value: 'check' },
      ],
    }),
    payment_reference: Field.text({
      label: 'Payment Reference',
      maxLength: 80,
      group: 'reimbursement',
      description: 'Bank/payroll transaction id once paid.',
    }),

    notes: Field.markdown({ label: 'Internal Notes', group: 'meta' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['status'] },
    { fields: ['requester'] },
    { fields: ['submitted_at'] },
    { fields: ['period_end'] },
  ],

  titleFormat: tmpl`{{record.title}}`,
  compactLayout: ['title', 'requester', 'total_amount', 'status', 'period_end'],

  validations: [
    {
      type: 'state_machine',
      name: 'expense_report_lifecycle',
      field: 'status',
      transitions: {
        draft: ['submitted'],
        submitted: ['approved', 'rejected', 'draft'],
        approved: ['reimbursed'],
        rejected: ['draft'],
        reimbursed: [],
      },
      message: 'Illegal status transition.',
    },
    {
      name: 'submitted_requires_amount',
      type: 'script',
      severity: 'error',
      message: 'Submitted reports must have at least one expense line (total > 0).',
      condition: P`record.status == "submitted" && (record.total_amount == null || record.total_amount <= 0)`,
    },
    {
      name: 'submitted_requires_purpose',
      type: 'script',
      severity: 'error',
      message: 'Submitted reports must include a business purpose.',
      condition: P`record.status == "submitted" && (record.purpose == null || record.purpose == "")`,
    },
    {
      name: 'reimbursed_requires_method',
      type: 'script',
      severity: 'error',
      message: 'Reimbursed reports must record a payment method.',
      condition: P`record.status == "reimbursed" && (record.payment_method == null || record.payment_method == "")`,
    },
  ],
});
