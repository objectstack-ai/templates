// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const ExpenseReportViews = defineView({
  list: {
    type: 'grid',
    name: 'all_reports',
    label: 'All Reports',
    data: { provider: 'object', object: 'expense_report' },
    columns: [
      { field: 'title', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'report_number', width: 150, sortable: true },
      { field: 'requester', width: 160 },
      { field: 'status', width: 130, sortable: true },
      { field: 'total_amount', width: 140, align: 'right', sortable: true },
      { field: 'period_end', width: 130, sortable: true },
      { field: 'cost_center', width: 140 },
      { field: 'approval_required', width: 130, align: 'center' },
    ],
    sort: [{ field: 'period_end', order: 'desc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: { allowedVisualizations: ['grid', 'kanban'] },
    tabs: [
      { name: 'all', label: 'All', view: 'all_reports', isDefault: true, pinned: true },
      { name: 'mine', label: 'My Reports', icon: 'user', view: 'my_reports' },
      { name: 'awaiting', label: 'Awaiting Approval', icon: 'check', view: 'awaiting_approval' },
      { name: 'to_pay', label: 'To Reimburse', icon: 'banknote', view: 'awaiting_reimbursement' },
    ],
  },

  listViews: {
    report_pipeline: {
      name: 'report_pipeline',
      type: 'kanban',
      label: 'Report Pipeline',
      data: { provider: 'object', object: 'expense_report' },
      columns: ['title', 'requester', 'total_amount', 'period_end'],
      kanban: {
        groupByField: 'status',
        columns: ['title', 'requester', 'total_amount', 'period_end'],
      },
    },

    my_reports: {
      name: 'my_reports',
      type: 'grid',
      label: 'My Reports',
      data: { provider: 'object', object: 'expense_report' },
      columns: ['title', 'status', 'total_amount', 'period_end', 'report_number'],
      filter: [{ field: 'requester', operator: 'equals', value: '{current_user_id}' }],
      sort: [{ field: 'period_end', order: 'desc' }],
    },

    awaiting_approval: {
      name: 'awaiting_approval',
      type: 'grid',
      label: 'Awaiting Approval',
      data: { provider: 'object', object: 'expense_report' },
      columns: ['title', 'requester', 'total_amount', 'cost_center', 'submitted_at'],
      filter: [{ field: 'status', operator: 'equals', value: 'submitted' }],
      sort: [{ field: 'submitted_at', order: 'asc' }],
    },

    awaiting_reimbursement: {
      name: 'awaiting_reimbursement',
      type: 'grid',
      label: 'To Reimburse',
      data: { provider: 'object', object: 'expense_report' },
      columns: ['title', 'requester', 'total_amount', 'approved_at', 'payment_method'],
      filter: [{ field: 'status', operator: 'equals', value: 'approved' }],
      sort: [{ field: 'approved_at', order: 'asc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'expense_report' },
    sections: [
      {
        label: 'Report',
        columns: 2,
        fields: [
          { field: 'title', required: true, colSpan: 2 },
          'report_number',
          'requester',
          'status',
          'cost_center',
          'period_start',
          'period_end',
          { field: 'purpose', colSpan: 2 },
        ],
      },
      {
        label: 'Financial',
        columns: 2,
        fields: ['currency', 'total_amount', 'approval_required', 'submitted_at', 'approved_at'],
      },
      {
        label: 'Reimbursement',
        columns: 2,
        fields: ['reimbursed_at', 'payment_method', 'payment_reference'],
      },
      {
        label: 'Notes',
        columns: 1,
        fields: ['notes'],
      },
    ],
  },
});
