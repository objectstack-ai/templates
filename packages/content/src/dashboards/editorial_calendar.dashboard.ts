// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Editorial Calendar — the lead's view. Drops the calendar widget in
 * center stage, with a channel-mix counter alongside.
 */
export const EditorialCalendarDashboard: Dashboard = {
  name: 'editorial_calendar_dashboard',
  label: 'Editorial Calendar',
  description: 'Month-over-month editorial calendar with channel mix and scheduling gaps.',

  columns: 12,
  gap: 4,
  refreshInterval: 300,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [
      { label: 'New Piece', icon: 'Plus', actionType: 'modal', actionUrl: 'create_piece' },
    ],
  },

  widgets: [
    {
      id: 'pieces_scheduled',
      title: 'Pieces Scheduled (30d)',
      type: 'metric',
      object: 'content_piece',
      filter: {
        status: 'scheduled',
        publish_at: { $gte: '{today}', $lte: '{30_days_from_now}' },
      },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Calendar', format: '0,0' },
    },
    {
      id: 'pieces_in_review',
      title: 'Awaiting Approval',
      type: 'metric',
      object: 'content_piece',
      filter: { status: 'in_review' },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'CheckCircle', format: '0,0' },
    },
    {
      id: 'pieces_published_30d',
      title: 'Published (30d)',
      type: 'metric',
      object: 'content_piece',
      filter: {
        status: 'published',
        published_at: { $gte: '{last_month_start}' },
      },
      aggregate: 'count',
      colorVariant: 'success',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'Send', format: '0,0' },
    },
    {
      id: 'pieces_overdue',
      title: 'Overdue',
      type: 'metric',
      object: 'content_piece',
      filter: {
        status: { $in: ['scheduled', 'approved', 'in_review', 'drafting'] },
        publish_at: { $lt: '{today}' },
      },
      aggregate: 'count',
      colorVariant: 'danger',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },

    {
      id: 'calendar_main',
      title: 'Upcoming Calendar',
      type: 'table',
      object: 'content_piece',
      aggregate: 'count',
      filter: {
        status: { $in: ['approved', 'scheduled', 'published'] },
        publish_at: { $gte: '{last_month_start}' },
      },
      layout: { x: 0, y: 2, w: 8, h: 6 },
      options: {
        columns: ['title', 'status', 'format', 'target_channels', 'publish_at'],
        pageSize: 25,
        sort: [{ field: 'publish_at', order: 'asc' }],
      },
    },
    {
      id: 'publications_by_channel',
      title: 'Publications by Channel (30d)',
      type: 'pie',
      object: 'content_publication',
      filter: { published_at: { $gte: '{last_month_start}' } },
      aggregate: 'count',
      categoryField: 'channel',
      layout: { x: 8, y: 2, w: 4, h: 6 },
      options: { donut: true, legend: 'right' },
    },
  ],
};
