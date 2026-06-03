// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const PurchaseRequestViews = defineView({
  list: {
    type: 'grid',
    name: 'all_requests',
    label: 'All Requests',
    data: { provider: 'object', object: 'procurement_request' },
    columns: [
      { field: 'title', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'request_number', width: 150, sortable: true },
      { field: 'vendor', width: 180 },
      { field: 'category', width: 150, sortable: true },
      { field: 'status', width: 130, sortable: true },
      { field: 'estimated_amount', width: 140, align: 'right', sortable: true },
      { field: 'needed_by', width: 130, sortable: true },
      { field: 'requester', width: 160 },
      { field: 'approval_required', width: 130, align: 'center' },
    ],
    sort: [{ field: 'needed_by', order: 'asc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: { allowedVisualizations: ['grid', 'kanban'] },
    tabs: [
      { name: 'all', label: 'All', view: 'all_requests', isDefault: true, pinned: true },
      { name: 'mine', label: 'My Requests', icon: 'user', view: 'my_requests' },
      { name: 'awaiting', label: 'Awaiting Approval', icon: 'check', view: 'awaiting_approval' },
    ],
  },

  listViews: {
    request_pipeline: {
      name: 'request_pipeline',
      type: 'kanban',
      label: 'Request Pipeline',
      data: { provider: 'object', object: 'procurement_request' },
      columns: ['title', 'vendor', 'estimated_amount', 'needed_by'],
      kanban: {
        groupByField: 'status',
        columns: ['title', 'vendor', 'estimated_amount', 'needed_by'],
      },
    },

    my_requests: {
      name: 'my_requests',
      type: 'grid',
      label: 'My Requests',
      data: { provider: 'object', object: 'procurement_request' },
      columns: ['title', 'vendor', 'category', 'status', 'estimated_amount', 'needed_by'],
      filter: [{ field: 'requester', operator: 'equals', value: '{current_user_id}' }],
      sort: [{ field: 'needed_by', order: 'asc' }],
    },

    awaiting_approval: {
      name: 'awaiting_approval',
      type: 'grid',
      label: 'Awaiting Approval',
      data: { provider: 'object', object: 'procurement_request' },
      columns: ['title', 'vendor', 'category', 'estimated_amount', 'requester', 'needed_by'],
      filter: [
        { field: 'status', operator: 'equals', value: 'submitted' },
        { field: 'estimated_amount', operator: 'gte', value: 5000 },
      ],
      sort: [{ field: 'estimated_amount', order: 'desc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'procurement_request' },
    sections: [
      {
        label: 'Request',
        columns: 2,
        fields: [
          { field: 'title', required: true, colSpan: 2 },
          'request_number',
          'requester',
          'vendor',
          'category',
          'status',
          { field: 'justification', colSpan: 2 },
        ],
      },
      {
        label: 'Commercial',
        columns: 2,
        fields: ['estimated_amount', 'needed_by', 'cost_center', 'approval_required'],
      },
      {
        label: 'Conversion',
        columns: 1,
        fields: ['converted_po', 'notes'],
      },
    ],
  },
});
