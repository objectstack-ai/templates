// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Three-tier role hierarchy. Higher tiers inherit lower-tier grants.
 *
 *   expense_admin → expense_manager → expense_employee
 *
 * `expense_manager` is the approver pool referenced by the approval
 * process and the notification flows.
 */
export const RoleHierarchy = {
  roles: [
    { name: 'expense_admin', label: 'Expense Admin', parentRole: null as string | null },
    {
      name: 'expense_manager',
      label: 'Expense Manager',
      parentRole: 'expense_admin' as string | null,
    },
    { name: 'expense_employee', label: 'Employee', parentRole: 'expense_manager' as string | null },
  ],
};
