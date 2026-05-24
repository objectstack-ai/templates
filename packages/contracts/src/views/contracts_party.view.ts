// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const PartyViews = defineView({
  list: {
    type: 'grid',
    name: 'all_parties',
    label: 'All Parties',
    data: { provider: 'object', object: 'contracts_party' },
    columns: [
      { field: 'legal_name', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'party_type', width: 120, sortable: true },
      { field: 'country', width: 140 },
      { field: 'primary_contact_name', width: 180 },
      { field: 'primary_contact_email', width: 240 },
    ],
    sort: [{ field: 'legal_name', order: 'asc' }],
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'contracts_party' },
    sections: [
      {
        label: 'Party',
        columns: 2,
        fields: [
          { field: 'legal_name', required: true, colSpan: 2 },
          'party_type',
          'country',
          'website',
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
