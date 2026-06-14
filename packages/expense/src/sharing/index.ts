// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Role hierarchy. Higher tiers inherit lower-tier grants.
 *
 *   expense_admin → expense_director → expense_manager → expense_employee
 *
 * `expense_manager` is the first-tier approver; `expense_director` is the
 * second-tier approver for large claims (≥ $1,000) — see
 * `expense_approval.flow.ts`.
 */
export const RoleHierarchy = {
  roles: [
    { name: 'expense_admin', label: 'Expense Admin', parentRole: null as string | null },
    {
      name: 'expense_director',
      label: 'Finance Director',
      parentRole: 'expense_admin' as string | null,
    },
    {
      name: 'expense_manager',
      label: 'Expense Manager',
      parentRole: 'expense_director' as string | null,
    },
    { name: 'expense_employee', label: 'Employee', parentRole: 'expense_manager' as string | null },
  ],
};
