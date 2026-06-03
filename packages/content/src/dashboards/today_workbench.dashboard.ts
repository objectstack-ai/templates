// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Today Workbench — the IC's landing page. Surfaces what you own, what's
 * burning, and where to start triaging signals.
 *
 * "Published Last 7d" carries `compareTo: 'previousPeriod'` so each writer
 * sees their week-over-week throughput delta on landing — the answer to
 * the only question they really ask: "is this week better than last?"
 */
export const TodayWorkbenchDashboard: Dashboard = {
  name: 'today_workbench_dashboard',
  label: 'Today Workbench',
  description:
    'Your shift on the editorial floor: drafts in flight, what is pending review, and signals to triage.',

  columns: 12,
  gap: 4,
  refreshInterval: 120,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [{ label: 'New Piece', icon: 'Plus', actionType: 'modal', actionUrl: 'create_piece' }],
  },

  widgets: [
    {
      id: 'my_drafts_in_flight',
      title: 'My Drafts',
      type: 'metric',
      object: 'content_piece',
      filter: {
        $or: [{ assignee: '{current_user_id}' }, { assignee: null }],
        status: { $in: ['backlog', 'drafting'] },
      },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'PenTool', format: '0,0' },
    },
    {
      id: 'my_pieces_in_review',
      title: 'In Review',
      type: 'metric',
      object: 'content_piece',
      filter: {
        $or: [{ assignee: '{current_user_id}' }, { assignee: null }],
        status: 'in_review',
      },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'CheckCircle', format: '0,0' },
    },
    {
      id: 'scheduled_this_week',
      title: 'Scheduled This Week',
      type: 'metric',
      object: 'content_piece',
      filter: {
        status: 'scheduled',
        publish_at: { $gte: '{current_week_start}' },
      },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'published_last_7d',
      title: 'Published Last 7d',
      type: 'metric',
      object: 'content_piece',
      filter: {
        status: 'published',
        published_at: { $gte: '{last_week_start}' },
      },
      aggregate: 'count',
      compareTo: 'previousPeriod',
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'Send', format: '0,0' },
    },

    {
      id: 'my_pieces_table',
      title: 'Pieces I own (or unassigned), not done',
      type: 'table',
      object: 'content_piece',
      aggregate: 'count',
      filter: {
        $or: [{ assignee: '{current_user_id}' }, { assignee: null }],
        status: { $in: ['backlog', 'drafting', 'in_review', 'approved', 'scheduled'] },
      },
      layout: { x: 0, y: 2, w: 7, h: 5 },
      options: {
        columns: ['title', 'status', 'format', 'publish_at'],
        pageSize: 10,
        sort: [{ field: 'publish_at', order: 'asc' }],
      },
    },

    {
      id: 'signals_to_triage',
      title: 'Signals to Triage',
      type: 'table',
      object: 'content_signal',
      aggregate: 'count',
      filter: { status: 'captured' },
      layout: { x: 7, y: 2, w: 5, h: 5 },
      options: {
        columns: ['headline', 'source_kind', 'impact', 'captured_at'],
        pageSize: 10,
        sort: [{ field: 'impact', order: 'desc' }],
      },
    },
  ],
};
