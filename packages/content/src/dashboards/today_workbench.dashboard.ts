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
      dataset: 'content_piece_metrics',
      values: ['piece_count'],
      title: 'My Drafts',
      type: 'metric',
      filter: {
        $or: [{ assignee: '{current_user_id}' }, { assignee: null }],
        status: { $in: ['backlog', 'drafting'] },
      },
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'PenTool', format: '0,0' },
    },
    {
      id: 'my_pieces_in_review',
      dataset: 'content_piece_metrics',
      values: ['piece_count'],
      title: 'In Review',
      type: 'metric',
      filter: {
        $or: [{ assignee: '{current_user_id}' }, { assignee: null }],
        status: 'in_review',
      },
      colorVariant: 'warning',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'CheckCircle', format: '0,0' },
    },
    {
      id: 'scheduled_this_week',
      dataset: 'content_piece_metrics',
      values: ['piece_count'],
      title: 'Scheduled This Week',
      type: 'metric',
      filter: {
        status: 'scheduled',
        publish_at: { $gte: '{current_week_start}' },
      },
      colorVariant: 'blue',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'published_last_7d',
      dataset: 'content_piece_metrics',
      values: ['piece_count'],
      title: 'Published Last 7d',
      type: 'metric',
      filter: {
        status: 'published',
        published_at: { $gte: '{last_week_start}' },
      },
      compareTo: 'previousPeriod',
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'Send', format: '0,0' },
    },

    // Record listings moved to object-bound ListViews (ADR-0017): `my_pieces_table`
    // is covered by the Pieces "My Drafts" tab; `signals_to_triage` is the Signals
    // "My Triage" tab (my_triage_queue, status=captured).
  ],
};
