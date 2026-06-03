// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const PurchaseOrderViews = defineView({
  list: {
    type: 'grid',
    name: 'all_orders',
    label: 'All Orders',
    data: { provider: 'object', object: 'procurement_order' },
    columns: [
      { field: 'po_number', width: 160, link: true, pinned: 'left', sortable: true },
      { field: 'vendor', width: 220 },
      { field: 'status', width: 140, sortable: true },
      { field: 'total_amount', width: 140, align: 'right', sortable: true },
      { field: 'received_amount', width: 140, align: 'right' },
      { field: 'order_date', width: 130, sortable: true },
      { field: 'expected_delivery', width: 140, sortable: true },
      { field: 'is_delivery_overdue', width: 110, align: 'center' },
      { field: 'owner', width: 160 },
    ],
    sort: [{ field: 'order_date', order: 'desc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: { allowedVisualizations: ['grid', 'kanban'] },
    tabs: [
      { name: 'all', label: 'All', view: 'all_orders', isDefault: true, pinned: true },
      { name: 'open', label: 'Open', icon: 'inbox', view: 'open_orders' },
      { name: 'overdue', label: 'Overdue', icon: 'clock', view: 'overdue_orders' },
    ],
  },

  listViews: {
    order_pipeline: {
      name: 'order_pipeline',
      type: 'kanban',
      label: 'Order Pipeline',
      data: { provider: 'object', object: 'procurement_order' },
      columns: ['po_number', 'vendor', 'total_amount', 'expected_delivery'],
      kanban: {
        groupByField: 'status',
        columns: ['po_number', 'vendor', 'total_amount', 'expected_delivery'],
      },
    },

    open_orders: {
      name: 'open_orders',
      type: 'grid',
      label: 'Open Orders',
      data: { provider: 'object', object: 'procurement_order' },
      columns: [
        'po_number',
        'vendor',
        'status',
        'total_amount',
        'received_amount',
        'expected_delivery',
      ],
      filter: [{ field: 'status', operator: 'in', value: ['sent', 'partial'] }],
      sort: [{ field: 'expected_delivery', order: 'asc' }],
    },

    overdue_orders: {
      name: 'overdue_orders',
      type: 'grid',
      label: 'Overdue Orders',
      data: { provider: 'object', object: 'procurement_order' },
      columns: ['po_number', 'vendor', 'status', 'total_amount', 'expected_delivery', 'owner'],
      filter: [
        { field: 'status', operator: 'in', value: ['sent', 'partial'] },
        { field: 'expected_delivery', operator: 'less_than', value: '{today}' },
      ],
      sort: [{ field: 'expected_delivery', order: 'asc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'procurement_order' },
    sections: [
      {
        label: 'Order',
        columns: 2,
        fields: [
          { field: 'po_number', required: true, colSpan: 2 },
          'vendor',
          'source_request',
          'status',
          'owner',
        ],
      },
      {
        label: 'Commercial',
        columns: 2,
        fields: ['total_amount', 'received_amount', 'payment_terms', 'is_fully_received'],
      },
      {
        label: 'Fulfillment',
        columns: 2,
        fields: ['order_date', 'expected_delivery', 'actual_delivery', 'is_delivery_overdue'],
      },
      {
        label: 'Line Items',
        columns: 1,
        fields: ['lines'],
      },
      {
        label: 'Notes',
        columns: 1,
        fields: ['notes'],
      },
    ],
  },
});
