// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const ControlViews = defineView({
  list: {
    type: 'grid',
    name: 'all_controls',
    label: 'All Controls',
    data: { provider: 'object', object: 'compliance_control' },
    columns: [
      { field: 'code', width: 120, pinned: 'left', sortable: true },
      { field: 'title', width: 320, link: true, sortable: true },
      { field: 'framework', width: 140 },
      { field: 'category', width: 140, sortable: true },
      { field: 'criticality', width: 110, sortable: true },
      { field: 'last_status', width: 130, sortable: true },
      { field: 'owner', width: 160 },
      { field: 'last_assessed_at', width: 160, sortable: true },
      { field: 'is_overdue_for_review', width: 130, align: 'center' },
    ],
    sort: [{ field: 'code', order: 'asc' }],
    grouping: { fields: [{ field: 'framework', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: { allowedVisualizations: ['grid', 'kanban'] },
    tabs: [
      { name: 'all', label: 'All', view: 'all_controls', isDefault: true, pinned: true },
      { name: 'mine', label: 'My Controls', icon: 'user', view: 'my_controls' },
      { name: 'failing', label: 'Failing', icon: 'alert-triangle', view: 'failing_controls' },
      { name: 'overdue', label: 'Overdue Review', icon: 'clock', view: 'overdue_controls' },
    ],
  },

  listViews: {
    control_board: {
      name: 'control_board',
      type: 'kanban',
      label: 'Control Board',
      data: { provider: 'object', object: 'compliance_control' },
      columns: ['code', 'title', 'framework', 'criticality'],
      kanban: {
        groupByField: 'last_status',
        columns: ['code', 'title', 'framework', 'criticality'],
      },
    },

    my_controls: {
      name: 'my_controls',
      type: 'grid',
      label: 'My Controls',
      data: { provider: 'object', object: 'compliance_control' },
      columns: ['code', 'title', 'framework', 'criticality', 'last_status', 'last_assessed_at'],
      filter: [{ field: 'owner', operator: 'equals', value: '{current_user_id}' }],
      sort: [{ field: 'code', order: 'asc' }],
    },

    failing_controls: {
      name: 'failing_controls',
      type: 'grid',
      label: 'Failing Controls',
      data: { provider: 'object', object: 'compliance_control' },
      columns: ['code', 'title', 'framework', 'criticality', 'owner', 'last_assessed_at'],
      filter: [{ field: 'last_status', operator: 'in', value: ['failed', 'partial'] }],
      sort: [
        { field: 'criticality', order: 'asc' },
        { field: 'code', order: 'asc' },
      ],
    },

    overdue_controls: {
      name: 'overdue_controls',
      type: 'grid',
      label: 'Overdue for Review',
      data: { provider: 'object', object: 'compliance_control' },
      columns: ['code', 'title', 'framework', 'criticality', 'owner', 'last_assessed_at'],
      filter: [{ field: 'is_overdue_for_review', operator: 'equals', value: true }],
      sort: [{ field: 'criticality', order: 'asc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'compliance_control' },
    sections: [
      {
        label: 'Control',
        columns: 2,
        fields: [
          { field: 'code', required: true },
          'framework',
          { field: 'title', required: true, colSpan: 2 },
          'category',
          'criticality',
          'last_status',
          { field: 'description', colSpan: 2 },
        ],
      },
      {
        label: 'Ownership & Cadence',
        columns: 2,
        fields: ['owner', 'review_frequency_days', 'last_assessed_at', 'is_overdue_for_review'],
      },
      { label: 'Notes', columns: 1, fields: ['notes'] },
    ],
  },
});
