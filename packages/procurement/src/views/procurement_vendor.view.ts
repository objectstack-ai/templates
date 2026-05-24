// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const VendorViews = defineView({
  list: {
    type: 'grid',
    name: 'all_vendors',
    label: 'All Vendors',
    data: { provider: 'object', object: 'procurement_vendor' },
    columns: [
      { field: 'name', width: 260, link: true, pinned: 'left', sortable: true },
      { field: 'vendor_code', width: 120, sortable: true },
      { field: 'category', width: 160, sortable: true },
      { field: 'status', width: 140, sortable: true },
      { field: 'country', width: 100 },
      { field: 'default_payment_terms', width: 130 },
      { field: 'primary_contact_name', width: 180 },
      { field: 'primary_contact_email', width: 240 },
    ],
    sort: [{ field: 'name', order: 'asc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'procurement_vendor' },
    sections: [
      {
        label: 'Vendor',
        columns: 2,
        fields: [
          { field: 'name', required: true, colSpan: 2 },
          'vendor_code',
          'category',
          'status',
          'country',
          'website',
          'default_payment_terms',
        ],
      },
      {
        label: 'Contact',
        columns: 2,
        fields: ['primary_contact_name', 'primary_contact_email'],
      },
      {
        label: 'Notes',
        columns: 1,
        fields: ['notes'],
      },
    ],
  },
});
