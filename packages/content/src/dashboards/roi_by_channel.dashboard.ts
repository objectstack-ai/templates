// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * ROI by Channel — exec-readout dashboard. Views by channel over time,
 * cumulative signups, and the top-performing publications table.
 *
 * Trend overlays: every "(90d)" KPI carries `compareTo: 'previousPeriod'`,
 * so the exec lands on a delta-vs-prior-90d number instead of a static
 * count. The signups trend uses `categoryGranularity: 'week'` (so each
 * week is its own bucket, not each timestamp) and overlays YoY
 * (`compareTo: 'previousYear'`) so seasonal patterns are obvious.
 *
 * Filters use raw fields only (no formula fields — analytics service in
 * spec 5.2 cannot query derived expressions).
 */
export const RoiByChannelDashboard: Dashboard = {
  name: 'roi_by_channel_dashboard',
  label: 'ROI by Channel',
  description: 'Views, clicks, signups, and attributed revenue by channel.',

  columns: 12,
  gap: 4,
  refreshInterval: 600,

  header: {
    showTitle: true,
    showDescription: true,
  },

  widgets: [
    {
      id: 'total_views_90d',
      title: 'Views (90d)',
      type: 'metric',
      object: 'content_publication',
      filter: { published_at: { $gte: '{90_days_ago}' } },
      aggregate: 'sum',
      valueField: 'total_views',
      compareTo: 'previousPeriod',
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Eye', format: '0,0' },
    },
    {
      id: 'total_clicks_90d',
      title: 'Clicks (90d)',
      type: 'metric',
      object: 'content_publication',
      filter: { published_at: { $gte: '{90_days_ago}' } },
      aggregate: 'sum',
      valueField: 'total_clicks',
      compareTo: 'previousPeriod',
      colorVariant: 'blue',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'MousePointerClick', format: '0,0' },
    },
    {
      id: 'total_signups_90d',
      title: 'Signups (90d)',
      type: 'metric',
      object: 'content_publication',
      filter: { published_at: { $gte: '{90_days_ago}' } },
      aggregate: 'sum',
      valueField: 'total_signups',
      compareTo: 'previousPeriod',
      colorVariant: 'success',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'UserPlus', format: '0,0' },
    },
    {
      id: 'total_revenue_90d',
      title: 'Attributed Revenue (90d)',
      type: 'metric',
      object: 'content_publication',
      filter: { published_at: { $gte: '{90_days_ago}' } },
      aggregate: 'sum',
      valueField: 'total_revenue',
      compareTo: 'previousPeriod',
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'TrendingUp', format: '$0,0' },
    },

    {
      id: 'views_by_channel_bar',
      title: 'Views by Channel (90d)',
      type: 'bar',
      object: 'content_publication',
      filter: { published_at: { $gte: '{90_days_ago}' } },
      aggregate: 'sum',
      valueField: 'total_views',
      categoryField: 'channel',
      compareTo: 'previousPeriod',
      layout: { x: 0, y: 2, w: 6, h: 5 },
      options: { stacked: true },
    },
    {
      id: 'signups_trend',
      title: 'Signups by Week (90d)',
      type: 'line',
      object: 'content_metric',
      filter: { period_start: { $gte: '{last_quarter_start}' } },
      aggregate: 'sum',
      valueField: 'signups',
      categoryField: 'period_start',
      categoryGranularity: 'week',
      compareTo: 'previousYear',
      chartConfig: {
        type: 'line',
        xAxis: { field: 'period_start', format: '%b %d', showGridLines: true, logarithmic: false },
        yAxis: [{ field: 'signups', format: '0,0', showGridLines: true, logarithmic: false }],
        showLegend: true,
        showDataLabels: false,
      },
      layout: { x: 6, y: 2, w: 6, h: 5 },
    },

    {
      id: 'top_publications',
      title: 'Top 10 Publications by Signups',
      type: 'table',
      object: 'content_publication',
      aggregate: 'count',

      layout: { x: 0, y: 7, w: 12, h: 5 },
      options: {
        columns: [
          'piece',
          'channel',
          'published_at',
          'total_views',
          'total_clicks',
          'total_signups',
          'total_revenue',
        ],
        pageSize: 10,
        sort: [{ field: 'total_signups', order: 'desc' }],
      },
    },
  ],
};
