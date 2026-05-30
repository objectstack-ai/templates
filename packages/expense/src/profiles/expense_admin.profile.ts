// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Expense Admin — finance/manager role. Sees every report, approves and
 * reimburses, manages the category master, and can hard-delete (rarely).
 */
export const ExpenseAdminProfile = {
  name: 'expense_admin',
  label: 'Expense Admin',
  isProfile: true,
  objects: {
    expense_report: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    expense_line: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    expense_category: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
  },
};
