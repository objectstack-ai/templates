// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { definePosition } from '@objectstack/spec/identity';

/**
 * Positions — the expense approval chain.
 *
 * In @objectstack ≥12 positions are FLAT distribution groups (no parent
 * hierarchy — ADR-0090 D3), so the former
 * `expense_admin → expense_director → expense_manager → expense_employee`
 * inheritance is expressed through explicit sharing rules / profiles rather
 * than a role tree.
 *
 * `expense_manager` is the first-tier approver; `expense_director` is the
 * second-tier approver for large claims (≥ $1,000) — see
 * `expense_approval.flow.ts`.
 */
export const ExpenseAdminPosition = definePosition({
  name: 'expense_admin',
  label: 'Expense Admin',
  description: 'Finance administrator — full report visibility and final approval.',
});

export const ExpenseDirectorPosition = definePosition({
  name: 'expense_director',
  label: 'Finance Director',
  description: 'Second-tier approver for large claims (≥ $1,000).',
});

export const ExpenseManagerPosition = definePosition({
  name: 'expense_manager',
  label: 'Expense Manager',
  description: 'First-tier approver for submitted reports.',
});

export const ExpenseEmployeePosition = definePosition({
  name: 'expense_employee',
  label: 'Employee',
  description: 'Submits expense reports for reimbursement.',
});

/** All positions, in seniority order, for `defineStack({ positions })`. */
export const ExpensePositions = [
  ExpenseAdminPosition,
  ExpenseDirectorPosition,
  ExpenseManagerPosition,
  ExpenseEmployeePosition,
];
