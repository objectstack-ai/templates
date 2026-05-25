// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const SLAPolicyViews = defineView({
  list: {
    type: 'grid',
    name: 'all_sla_policies',
    label: 'All SLA Policies',
    data: { provider: 'object', object: 'helpdesk_sla_policy' },
    columns: [
      { field: 'name', width: 240, link: true, pinned: 'left' },
      { field: 'applies_to_tier', width: 140 },
      { field: 'is_default', width: 100, align: 'center' },
      { field: 'first_response_urgent_minutes', width: 130, align: 'right' },
      { field: 'first_response_high_minutes', width: 130, align: 'right' },
      { field: 'resolution_urgent_minutes', width: 130, align: 'right' },
      { field: 'resolution_high_minutes', width: 130, align: 'right' },
    ],
    sort: [{ field: 'applies_to_tier', order: 'asc' }],
    pagination: { pageSize: 50 },
  },
  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'helpdesk_sla_policy' },
    sections: [
      {
        label: 'Policy',
        columns: 2,
        fields: [
          { field: 'name', required: true, colSpan: 2 },
          'applies_to_tier',
          'is_default',
        ],
      },
      {
        label: 'First Response (minutes)',
        columns: 2,
        fields: [
          'first_response_low_minutes',
          'first_response_normal_minutes',
          'first_response_high_minutes',
          'first_response_urgent_minutes',
        ],
      },
      {
        label: 'Resolution (minutes)',
        columns: 2,
        fields: [
          'resolution_low_minutes',
          'resolution_normal_minutes',
          'resolution_high_minutes',
          'resolution_urgent_minutes',
        ],
      },
      { label: 'Notes', columns: 1, fields: ['notes'] },
    ],
  },
});
