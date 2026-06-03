// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const EmployeeViews = defineView({
  list: {
    type: 'grid',
    name: 'all_employees',
    label: 'All Employees',
    data: { provider: 'object', object: 'hr_employee' },
    columns: [
      { field: 'full_name', width: 220, link: true, pinned: 'left', sortable: true },
      { field: 'job_title', width: 200, sortable: true },
      { field: 'department', width: 180 },
      { field: 'manager', width: 180 },
      { field: 'status', width: 120, sortable: true },
      { field: 'employment_type', width: 130 },
      { field: 'hire_date', width: 120, sortable: true },
      { field: 'location', width: 140 },
      { field: 'work_email', width: 220 },
    ],
    sort: [{ field: 'full_name', order: 'asc' }],
    grouping: { fields: [{ field: 'department', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: { allowedVisualizations: ['grid'] },
    tabs: [
      { name: 'all', label: 'All', view: 'all_employees', isDefault: true, pinned: true },
      { name: 'active', label: 'Active', icon: 'user-check', view: 'active_employees' },
      { name: 'on_leave', label: 'On Leave', icon: 'calendar-off', view: 'employees_on_leave' },
      {
        name: 'new_hires',
        label: 'New Hires (30d)',
        icon: 'user-plus',
        view: 'new_hires_employees',
      },
      { name: 'terminated', label: 'Terminated', icon: 'user-x', view: 'terminated_employees' },
    ],
  },

  listViews: {
    active_employees: {
      name: 'active_employees',
      type: 'grid',
      label: 'Active Employees',
      data: { provider: 'object', object: 'hr_employee' },
      columns: ['full_name', 'job_title', 'department', 'manager', 'tenure_years', 'hire_date'],
      filter: [{ field: 'status', operator: 'equals', value: 'active' }],
      sort: [{ field: 'full_name', order: 'asc' }],
    },
    employees_on_leave: {
      name: 'employees_on_leave',
      type: 'grid',
      label: 'On Leave',
      data: { provider: 'object', object: 'hr_employee' },
      columns: ['full_name', 'job_title', 'department', 'manager'],
      filter: [{ field: 'status', operator: 'equals', value: 'on_leave' }],
      sort: [{ field: 'full_name', order: 'asc' }],
    },
    new_hires_employees: {
      name: 'new_hires_employees',
      type: 'grid',
      label: 'New Hires (last 30 days)',
      data: { provider: 'object', object: 'hr_employee' },
      columns: ['full_name', 'job_title', 'department', 'manager', 'hire_date', 'location'],
      filter: [
        { field: 'hire_date', operator: 'greater_or_equal', value: '{today-30}' },
        { field: 'status', operator: 'not_equals', value: 'terminated' },
      ],
      sort: [{ field: 'hire_date', order: 'desc' }],
    },
    terminated_employees: {
      name: 'terminated_employees',
      type: 'grid',
      label: 'Terminated',
      data: { provider: 'object', object: 'hr_employee' },
      columns: ['full_name', 'job_title', 'department', 'manager', 'end_date'],
      filter: [{ field: 'status', operator: 'equals', value: 'terminated' }],
      sort: [{ field: 'end_date', order: 'desc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'hr_employee' },
    sections: [
      {
        label: 'Identity',
        columns: 2,
        fields: ['full_name', 'preferred_name', 'work_email', 'phone', 'user'],
      },
      {
        label: 'Role',
        columns: 2,
        fields: ['job_title', 'department', 'manager', 'location'],
      },
      {
        label: 'Employment',
        columns: 2,
        fields: ['status', 'employment_type', 'hire_date', 'end_date', 'tenure_years'],
      },
      {
        label: 'Sensitive',
        columns: 2,
        fields: ['salary', 'contract_type', 'national_id_last4'],
      },
      {
        label: 'Notes',
        columns: 1,
        fields: ['notes'],
      },
    ],
  },
});
