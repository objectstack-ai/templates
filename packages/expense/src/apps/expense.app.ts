// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { App } from '@objectstack/spec/ui';

export const ExpenseApp = App.create({
  name: 'expense',
  label: 'Expense',
  description: 'Employee expense & reimbursement on ObjectStack.',
  icon: 'receipt',
  branding: { primaryColor: '#0EA5E9' },

  navigation: [
    {
      id: 'nav_dashboard',
      type: 'dashboard',
      dashboardName: 'expenses_overview_dashboard',
      label: 'Overview',
      icon: 'gauge',
    },
    { id: 'nav_report', type: 'object', objectName: 'expense_report', label: 'Reports', icon: 'receipt' },
    { id: 'nav_line', type: 'object', objectName: 'expense_line', label: 'Lines', icon: 'list' },
    { id: 'nav_category', type: 'object', objectName: 'expense_category', label: 'Categories', icon: 'tag' },
  ],
});
