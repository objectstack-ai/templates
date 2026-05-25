// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const TimeOffRequestViews = defineView({
  list: {
    type: 'grid',
    name: 'all_time_off',
    label: 'All Time-Off Requests',
    data: { provider: 'object', object: 'hr_time_off_request' },
    columns: [
      { field: 'employee', width: 200, link: true, pinned: 'left' },
      { field: 'leave_type', width: 120, sortable: true },
      { field: 'start_date', width: 130, sortable: true },
      { field: 'end_date', width: 130, sortable: true },
      { field: 'days', width: 80, align: 'right' },
      { field: 'status', width: 130, sortable: true },
      { field: 'approver', width: 200 },
      { field: 'submitted_at', width: 160, sortable: true },
    ],
    sort: [{ field: 'start_date', order: 'desc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50 },
    exportOptions: ['csv', 'xlsx'],
    appearance: { allowedVisualizations: ['grid', 'kanban'] },
    tabs: [
      { name: 'all', label: 'All', view: 'all_time_off', isDefault: true, pinned: true },
      { name: 'pending', label: 'Pending', icon: 'clock', view: 'pending_time_off' },
      { name: 'approved', label: 'Approved', icon: 'check', view: 'approved_time_off' },
    ],
  },

  listViews: {
    time_off_pipeline: {
      name: 'time_off_pipeline',
      type: 'kanban',
      label: 'Approval Pipeline',
      data: { provider: 'object', object: 'hr_time_off_request' },
      columns: ['employee', 'leave_type', 'start_date', 'end_date', 'days'],
      kanban: {
        groupByField: 'status',
        columns: ['employee', 'leave_type', 'start_date', 'end_date', 'days'],
      },
    },
    pending_time_off: {
      name: 'pending_time_off',
      type: 'grid',
      label: 'Pending Approval',
      data: { provider: 'object', object: 'hr_time_off_request' },
      columns: ['employee', 'leave_type', 'start_date', 'end_date', 'days', 'submitted_at'],
      filter: [{ field: 'status', operator: 'equals', value: 'submitted' }],
      sort: [{ field: 'submitted_at', order: 'asc' }],
    },
    approved_time_off: {
      name: 'approved_time_off',
      type: 'grid',
      label: 'Approved',
      data: { provider: 'object', object: 'hr_time_off_request' },
      columns: ['employee', 'leave_type', 'start_date', 'end_date', 'days', 'approver', 'decided_at'],
      filter: [{ field: 'status', operator: 'equals', value: 'approved' }],
      sort: [{ field: 'start_date', order: 'asc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'hr_time_off_request' },
    sections: [
      {
        label: 'Request',
        columns: 2,
        fields: ['employee', 'leave_type', 'start_date', 'end_date', 'days', 'reason'],
      },
      {
        label: 'Decision',
        columns: 2,
        fields: ['status', 'approver', 'decided_at', 'decision_note'],
      },
    ],
  },
});
