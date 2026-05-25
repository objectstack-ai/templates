// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const CustomerViews = defineView({
  list: {
    type: 'grid',
    name: 'all_customers',
    label: 'All Customers',
    data: { provider: 'object', object: 'helpdesk_customer' },
    columns: [
      { field: 'name', width: 240, link: true, pinned: 'left', sortable: true },
      { field: 'email', width: 260, sortable: true },
      { field: 'company', width: 220 },
      { field: 'tier', width: 130, sortable: true },
      { field: 'locale', width: 100 },
      { field: 'timezone', width: 180 },
    ],
    sort: [{ field: 'name', order: 'asc' }],
    pagination: { pageSize: 50 },
    exportOptions: ['csv', 'xlsx'],
  },
  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'helpdesk_customer' },
    sections: [
      {
        label: 'Customer',
        columns: 2,
        fields: [
          { field: 'name', required: true, colSpan: 2 },
          'email',
          'company',
          'tier',
          'locale',
          'timezone',
          'portal_user',
        ],
      },
      { label: 'Notes', columns: 1, fields: ['notes'] },
    ],
  },
});
