// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Publication views — all / this week / grouped by channel.
 */
export const PublicationViews = defineView({
  list: {
    type: 'grid',
    name: 'all_publications',
    label: 'All Publications',
    data: { provider: 'object', object: 'content_publication' },
    columns: [
      { field: 'piece', width: 280, link: true, pinned: 'left' },
      { field: 'channel', width: 150 },
      { field: 'published_at', width: 160, sortable: true },
      { field: 'total_views', width: 110, align: 'right' },
      { field: 'total_clicks', width: 110, align: 'right' },
      { field: 'total_signups', width: 110, align: 'right' },
      { field: 'total_revenue', width: 140, align: 'right' },
      { field: 'last_metric_at', width: 150 },
    ],
    sort: [{ field: 'published_at', order: 'desc' }],
    grouping: { fields: [{ field: 'channel', order: 'asc' }] },
    pagination: { pageSize: 50 },
    exportOptions: ['csv', 'xlsx'],
    tabs: [
      { name: 'all', label: 'All', view: 'all_publications', isDefault: true, pinned: true },
      { name: 'top', label: 'Top Performers', icon: 'trophy', view: 'top_publications' },
      { name: 'week', label: 'This Week', icon: 'calendar', view: 'this_week_publications' },
      { name: 'by_channel', label: 'By Channel', icon: 'layers', view: 'by_channel_publications' },
    ],
  },

  listViews: {
    // Top publications by signups — surfaces the former `top_publications`
    // dashboard table as an object-bound ListView (ADR-0017).
    top_publications: {
      name: 'top_publications',
      type: 'grid',
      label: 'Top Performers',
      data: { provider: 'object', object: 'content_publication' },
      columns: [
        'piece',
        'channel',
        'published_at',
        'total_views',
        'total_clicks',
        'total_signups',
        'total_revenue',
      ],
      sort: [{ field: 'total_signups', order: 'desc' }],
    },

    this_week_publications: {
      name: 'this_week_publications',
      type: 'grid',
      label: 'This Week',
      data: { provider: 'object', object: 'content_publication' },
      columns: ['piece', 'channel', 'published_at', 'total_views', 'total_signups'],
      filter: [{ field: 'published_at', operator: 'gte', value: '{week_start}' }],
      sort: [{ field: 'published_at', order: 'desc' }],
    },
    by_channel_publications: {
      name: 'by_channel_publications',
      type: 'grid',
      label: 'By Channel',
      data: { provider: 'object', object: 'content_publication' },
      columns: ['piece', 'channel', 'published_at', 'total_views', 'total_signups'],
      grouping: { fields: [{ field: 'channel', order: 'asc' }] },
      sort: [{ field: 'published_at', order: 'desc' }],
    },
  },
});
