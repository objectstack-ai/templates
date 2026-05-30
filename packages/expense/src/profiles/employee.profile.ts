// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Employee — submits and tracks their own expense reports. Can create and
 * edit reports and lines (their own), reads the category list. Cannot
 * approve, reimburse, or delete master data.
 */
export const EmployeeProfile = {
  name: 'expense_employee',
  label: 'Employee',
  isProfile: true,
  objects: {
    expense_report: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: false,
      modifyAllRecords: false,
    },
    expense_line: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: false,
      modifyAllRecords: false,
    },
    expense_category: {
      allowCreate: false,
      allowRead: true,
      allowEdit: false,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
  },
};
