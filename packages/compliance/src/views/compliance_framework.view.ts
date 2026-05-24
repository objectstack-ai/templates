// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const FrameworkViews = defineView({
  list: {
    type: 'grid',
    name: 'all_frameworks',
    label: 'All Frameworks',
    data: { provider: 'object', object: 'compliance_framework' },
    columns: [
      { field: 'short_name', width: 130, link: true, pinned: 'left', sortable: true },
      { field: 'full_name', width: 320 },
      { field: 'family', width: 140, sortable: true },
      { field: 'version', width: 100 },
      { field: 'status', width: 130, sortable: true },
      { field: 'next_audit_date', width: 150, sortable: true },
      { field: 'auditor', width: 200 },
    ],
    sort: [{ field: 'short_name', order: 'asc' }],
    pagination: { pageSize: 25, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'compliance_framework' },
    sections: [
      {
        label: 'Framework',
        columns: 2,
        fields: [
          { field: 'short_name', required: true },
          'family',
          { field: 'full_name', required: true, colSpan: 2 },
          'version',
          'status',
        ],
      },
      {
        label: 'Audit',
        columns: 2,
        fields: ['next_audit_date', 'auditor'],
      },
      { label: 'Description', columns: 1, fields: ['description'] },
    ],
  },
});
