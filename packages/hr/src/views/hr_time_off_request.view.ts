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
      {
        name: 'pending',
        label: 'Pending',
        icon: 'clock',
        view: 'pending_time_off',
        isDefault: true,
        pinned: true,
      },
      { name: 'pipeline', label: 'Approval Pipeline', icon: 'columns', view: 'time_off_pipeline' },
      { name: 'approved', label: 'Approved', icon: 'check', view: 'approved_time_off' },
      { name: 'ooo_today', label: 'Out Today', icon: 'plane', view: 'out_of_office_today' },
      { name: 'all', label: 'All', view: 'all_time_off' },
    ],
  },

  listViews: {
    // Out of office today — surfaces the former `ooo_today` dashboard table as
    // an object-bound ListView (ADR-0017): approved leave spanning today.
    out_of_office_today: {
      name: 'out_of_office_today',
      type: 'grid',
      label: 'Out of Office Today',
      data: { provider: 'object', object: 'hr_time_off_request' },
      columns: ['employee', 'leave_type', 'start_date', 'end_date'],
      filter: [
        { field: 'status', operator: 'equals', value: 'approved' },
        { field: 'start_date', operator: 'lte', value: '{today}' },
        { field: 'end_date', operator: 'gte', value: '{today}' },
      ],
      sort: [{ field: 'end_date', order: 'asc' }],
    },

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
      columns: [
        'employee',
        'leave_type',
        'start_date',
        'end_date',
        'days',
        'approver',
        'decided_at',
      ],
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
