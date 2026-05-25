// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const TeamViews = defineView({
  list: {
    type: 'grid',
    name: 'all_teams',
    label: 'All Teams',
    data: { provider: 'object', object: 'helpdesk_team' },
    columns: [
      { field: 'name', width: 240, link: true, pinned: 'left' },
      { field: 'code', width: 100 },
      { field: 'specialty', width: 200 },
      { field: 'manager', width: 180 },
      { field: 'is_active', width: 100, align: 'center' },
      { field: 'business_hours', width: 240 },
    ],
    sort: [{ field: 'name', order: 'asc' }],
    pagination: { pageSize: 50 },
  },
  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'helpdesk_team' },
    sections: [
      {
        label: 'Team',
        columns: 2,
        fields: [
          { field: 'name', required: true, colSpan: 2 },
          'code',
          'specialty',
          'manager',
          'is_active',
          { field: 'business_hours', colSpan: 2 },
        ],
      },
    ],
  },
});
