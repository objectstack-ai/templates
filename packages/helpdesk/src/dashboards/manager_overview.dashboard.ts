// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Manager Overview — volume, SLA compliance, sentiment distribution,
 * AI assist hit rate. Designed for support leads doing weekly reviews.
 *
 * Trend overlay: "Avg CSAT" carries `compareTo: 'previousPeriod'` so the
 * lead lands on a satisfaction-trend delta, and a new "Resolutions by
 * Day (30d)" line uses `categoryGranularity: 'day'` + `compareTo:
 * 'previousPeriod'` to show throughput vs. the prior month — the chart
 * support leads typically build by hand in spreadsheets after each WBR.
 */
export const ManagerOverviewDashboard: Dashboard = {
  name: 'manager_overview_dashboard',
  label: 'Support Manager Overview',
  description: 'Volume, SLA health, sentiment mix, and AI assist effectiveness.',

  columns: 12,
  gap: 4,
  refreshInterval: 300,

  header: { showTitle: true, showDescription: true },

  widgets: [
    {
      id: 'total_open',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'Open Tickets',
      type: 'metric',
      object: 'helpdesk_ticket',
      filter: { status: { $nin: ['closed', 'resolved'] } },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Inbox', format: '0,0' },
    },
    {
      id: 'breaching_overview',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'SLA Breaching',
      type: 'metric',
      object: 'helpdesk_ticket',
      filter: {
        status: { $nin: ['closed', 'resolved'] },
        resolution_due_at: { $lt: '{today}' },
      },
      aggregate: 'count',
      colorVariant: 'danger',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'escalated',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'Escalated',
      type: 'metric',
      object: 'helpdesk_ticket',
      filter: { status: 'escalated' },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'Flame', format: '0,0' },
    },
    {
      id: 'avg_csat',
      dataset: 'ticket_metrics', values: ['avg_csat'],
      title: 'Avg CSAT',
      type: 'metric',
      object: 'helpdesk_ticket',
      filter: {
        csat_score: { $gte: 1 },
        resolved_at: { $gte: '{30_days_ago}' },
      },
      aggregate: 'avg',
      valueField: 'csat_score',
      compareTo: 'previousPeriod',
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'Star', format: '0.00' },
    },

    {
      id: 'tickets_by_status',
      dataset: 'ticket_metrics', dimensions: ['status'], values: ['ticket_count'],
      title: 'Tickets by Status',
      type: 'bar',
      object: 'helpdesk_ticket',
      aggregate: 'count',
      categoryField: 'status',
      layout: { x: 0, y: 2, w: 6, h: 4 },
    },
    {
      id: 'tickets_by_sentiment',
      dataset: 'ticket_metrics', dimensions: ['ai_sentiment'], values: ['ticket_count'],
      title: 'Sentiment Distribution',
      type: 'pie',
      object: 'helpdesk_ticket',
      aggregate: 'count',
      filter: { status: { $nin: ['closed'] } },
      categoryField: 'ai_sentiment',
      layout: { x: 6, y: 2, w: 6, h: 4 },
    },

    {
      id: 'tickets_by_category',
      dataset: 'ticket_metrics', dimensions: ['ai_category'], values: ['ticket_count'],
      title: 'AI Category Mix',
      type: 'bar',
      object: 'helpdesk_ticket',
      aggregate: 'count',
      categoryField: 'ai_category',
      layout: { x: 0, y: 6, w: 6, h: 4 },
    },
    {
      id: 'tickets_by_channel',
      dataset: 'ticket_metrics', dimensions: ['channel'], values: ['ticket_count'],
      title: 'Volume by Channel',
      type: 'bar',
      object: 'helpdesk_ticket',
      aggregate: 'count',
      categoryField: 'channel',
      layout: { x: 6, y: 6, w: 6, h: 4 },
    },

    {
      id: 'recent_escalated',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'Recently Escalated',
      type: 'table',
      object: 'helpdesk_ticket',
      aggregate: 'count',
      filter: { status: 'escalated' },
      layout: { x: 0, y: 10, w: 12, h: 5 },
      options: {
        columns: [
          'ticket_number',
          'name',
          'customer',
          'team',
          'assignee',
          'ai_sentiment',
          'priority',
        ],
        pageSize: 10,
        sort: [{ field: 'priority', order: 'desc' }],
      },
    },
    {
      id: 'resolutions_by_day',
      dataset: 'ticket_metrics', dimensions: ['resolved_at'], values: ['ticket_count'],
      title: 'Resolutions by Day (last 30 days)',
      type: 'line',
      object: 'helpdesk_ticket',
      filter: {
        status: { $in: ['resolved', 'closed'] },
        resolved_at: { $gte: '{30_days_ago}' },
      },
      aggregate: 'count',
      categoryField: 'resolved_at',
      categoryGranularity: 'day',
      compareTo: 'previousPeriod',
      chartConfig: {
        type: 'line',
        xAxis: { field: 'resolved_at', format: '%b %d', showGridLines: true, logarithmic: false },
        yAxis: [{ field: 'value', format: '0,0', showGridLines: true, logarithmic: false }],
        showLegend: true,
        showDataLabels: false,
      },
      layout: { x: 0, y: 15, w: 12, h: 5 },
    },
  ],
};
