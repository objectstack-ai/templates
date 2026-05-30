// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const ExpenseCategoryViews = defineView({
  list: {
    type: 'grid',
    name: 'all_categories',
    label: 'All Categories',
    data: { provider: 'object', object: 'expense_category' },
    columns: [
      { field: 'name', width: 240, link: true, pinned: 'left', sortable: true },
      { field: 'code', width: 120, sortable: true },
      { field: 'gl_account', width: 140 },
      { field: 'per_txn_limit', width: 160, align: 'right', sortable: true },
      { field: 'active', width: 100, align: 'center', sortable: true },
    ],
    sort: [{ field: 'name', order: 'asc' }],
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'expense_category' },
    sections: [
      {
        label: 'Category',
        columns: 2,
        fields: [
          { field: 'name', required: true, colSpan: 2 },
          'code',
          'gl_account',
          'per_txn_limit',
          'active',
        ],
      },
      {
        label: 'Notes',
        columns: 1,
        fields: ['description'],
      },
    ],
  },
});
