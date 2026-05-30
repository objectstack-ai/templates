// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const ExpenseLineViews = defineView({
  list: {
    type: 'grid',
    name: 'all_lines',
    label: 'All Lines',
    data: { provider: 'object', object: 'expense_line' },
    columns: [
      { field: 'description', width: 260, link: true, pinned: 'left', sortable: true },
      { field: 'expense_report', width: 220 },
      { field: 'category', width: 160 },
      { field: 'amount', width: 130, align: 'right', sortable: true },
      { field: 'expense_date', width: 130, sortable: true },
      { field: 'merchant', width: 160 },
      { field: 'payment_source', width: 140 },
      { field: 'needs_receipt', width: 120, align: 'center' },
      { field: 'receipt_attached', width: 130, align: 'center' },
    ],
    sort: [{ field: 'expense_date', order: 'desc' }],
    grouping: { fields: [{ field: 'category', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'expense_line' },
    sections: [
      {
        label: 'Detail',
        columns: 2,
        fields: [
          { field: 'expense_report', required: true, colSpan: 2 },
          'expense_date',
          'category',
          { field: 'description', required: true, colSpan: 2 },
          'merchant',
          'amount',
          'payment_source',
        ],
      },
      {
        label: 'Receipt',
        columns: 2,
        fields: ['needs_receipt', 'receipt_attached', { field: 'notes', colSpan: 2 }],
      },
    ],
  },
});
