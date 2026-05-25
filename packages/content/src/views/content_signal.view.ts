// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Signal views — capture inbox + triage queue + recent promotions.
 */
export const SignalViews = defineView({
  list: {
    type: 'grid',
    name: 'all_signals',
    label: 'All Signals',
    data: { provider: 'object', object: 'content_signal' },
    columns: [
      { field: 'headline', width: 320, link: true, pinned: 'left' },
      { field: 'source_kind', width: 150 },
      { field: 'competitor', width: 180 },
      { field: 'impact', width: 110 },
      { field: 'status', width: 120, sortable: true },
      { field: 'captured_at', width: 150, sortable: true },
      { field: 'promoted_topic', width: 200 },
    ],
    sort: [{ field: 'captured_at', order: 'desc' }],
    grouping: { fields: [{ field: 'status', order: 'asc' }] },
    pagination: { pageSize: 50 },
    exportOptions: ['csv'],
    tabs: [
      { name: 'all', label: 'All', view: 'all_signals', isDefault: true, pinned: true },
      { name: 'triage', label: 'My Triage', icon: 'inbox', view: 'my_triage_queue' },
      { name: 'promoted', label: 'Recently Promoted', icon: 'trending-up', view: 'recently_promoted' },
    ],
  },

  listViews: {
    my_triage_queue: {
      name: 'my_triage_queue',
      type: 'grid',
      label: 'Triage Queue',
      data: { provider: 'object', object: 'content_signal' },
      columns: ['headline', 'source_kind', 'competitor', 'impact', 'captured_at'],
      filter: [{ field: 'status', operator: 'equals', value: 'captured' }],
      sort: [
        { field: 'impact', order: 'desc' },
        { field: 'captured_at', order: 'desc' },
      ],
    },
    recently_promoted: {
      name: 'recently_promoted',
      type: 'grid',
      label: 'Recently Promoted (30d)',
      data: { provider: 'object', object: 'content_signal' },
      columns: ['headline', 'competitor', 'promoted_topic', 'promoted_at'],
      filter: [
        { field: 'status', operator: 'equals', value: 'promoted' },
        { field: 'promoted_at', operator: 'gte', value: '{30_days_ago}' },
      ],
      sort: [{ field: 'promoted_at', order: 'desc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'content_signal' },
    sections: [
      {
        label: 'Signal',
        columns: 2,
        fields: [
          { field: 'headline', required: true, colSpan: 2 },
          'source_kind',
          'competitor',
          'impact',
          'status',
          { field: 'source_url', colSpan: 2 },
        ],
      },
      {
        label: 'AI Assist',
        columns: 1,
        fields: ['summary', 'recommended_topic_title'],
      },
      {
        label: 'Metadata',
        columns: 2,
        fields: ['promoted_at', 'promoted_topic', 'captured_at'],
      },
      {
        label: 'Notes',
        columns: 1,
        fields: ['notes'],
      },
    ],
  },
});
