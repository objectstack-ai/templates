// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const GoodsReceiptViews = defineView({
  list: {
    type: 'grid',
    name: 'all_receipts',
    label: 'All Receipts',
    data: { provider: 'object', object: 'procurement_receipt' },
    columns: [
      { field: 'receipt_number', width: 160, link: true, pinned: 'left', sortable: true },
      { field: 'purchase_order', width: 200 },
      { field: 'quality', width: 120, sortable: true },
      { field: 'received_value', width: 140, align: 'right', sortable: true },
      { field: 'received_at', width: 160, sortable: true },
      { field: 'received_by', width: 160 },
    ],
    sort: [{ field: 'received_at', order: 'desc' }],
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'procurement_receipt' },
    sections: [
      {
        label: 'Receipt',
        columns: 2,
        fields: [
          { field: 'purchase_order', required: true, colSpan: 2 },
          'receipt_number',
          'quality',
          'received_value',
          'received_at',
          'received_by',
        ],
      },
      {
        label: 'Notes',
        columns: 1,
        fields: ['notes'],
      },
    ],
  },
});
