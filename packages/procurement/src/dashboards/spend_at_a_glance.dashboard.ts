// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Spend at a Glance — landing dashboard.
 * Surface what's pending approval, what's in flight with vendors, and
 * spend totals so the buying team has a single pane of glass.
 *
 * Trend overlay: the new "PO Value by Month" line chart uses
 * `dateGranularity: 'month'` + `compareTo: 'previousYear'` so the
 * buying team can see whether monthly commitment is up vs. the same
 * month last year — the conversation the CFO opens every QBR with.
 *
 * NOTE: filters use base fields only — analytics service in spec 5.2
 * does NOT resolve formula fields, so we recompute conditions inline.
 */
export const SpendAtAGlanceDashboard: Dashboard = {
  name: 'spend_at_a_glance_dashboard',
  label: 'Spend at a Glance',
  description: 'Open POs, MTD commitments, requests awaiting approval, and top vendors by spend.',

  columns: 12,
  gap: 4,
  refreshInterval: 300,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [
      { label: 'New Request', icon: 'Plus', actionType: 'modal', actionUrl: 'create_request' },
    ],
  },

  widgets: [
    {
      id: 'awaiting_approval',
      dataset: 'procurement_request_metrics',
      values: ['request_count'],
      title: 'PRs Awaiting Approval',
      type: 'metric',
      filter: { status: 'submitted', estimated_amount: { $gte: 5000 } },
      colorVariant: 'warning',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'open_pos',
      dataset: 'procurement_order_metrics',
      values: ['order_count'],
      title: 'Open Purchase Orders',
      type: 'metric',
      filter: { status: { $in: ['sent', 'partial'] } },
      colorVariant: 'blue',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'FileCheck', format: '0,0' },
    },
    {
      id: 'overdue_pos',
      dataset: 'procurement_order_metrics',
      values: ['order_count'],
      title: 'Overdue Deliveries',
      type: 'metric',
      filter: {
        status: { $in: ['sent', 'partial'] },
        expected_delivery: { $lt: '{today}' },
      },
      colorVariant: 'danger',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'open_commitment',
      dataset: 'procurement_order_metrics',
      values: ['sum_total_amount'],
      title: 'Open Commitment ($)',
      type: 'metric',
      filter: { status: { $in: ['sent', 'partial'] } },
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'TrendingUp', format: '$0,0' },
    },
    {
      id: 'pending_requests_table',
      dataset: 'procurement_request_metrics',
      values: ['request_count'],
      title: 'Requests Awaiting Approval',
      type: 'table',
      filter: { status: 'submitted' },
      layout: { x: 0, y: 2, w: 8, h: 5 },
      options: {
        columns: ['title', 'vendor', 'category', 'estimated_amount', 'needed_by'],
        pageSize: 10,
        sort: [{ field: 'estimated_amount', order: 'desc' }],
      },
    },
    {
      id: 'open_pos_table',
      dataset: 'procurement_order_metrics',
      values: ['order_count'],
      title: 'Open Purchase Orders',
      type: 'table',
      filter: { status: { $in: ['sent', 'partial'] } },
      layout: { x: 8, y: 2, w: 4, h: 5 },
      options: {
        columns: ['po_number', 'vendor', 'total_amount', 'expected_delivery'],
        pageSize: 10,
        sort: [{ field: 'expected_delivery', order: 'asc' }],
      },
    },
    {
      id: 'po_value_by_month',
      dataset: 'procurement_order_metrics',
      dimensions: ['order_date'],
      values: ['sum_total_amount'],
      title: 'PO Value by Month (last 12 months)',
      type: 'line',
      filter: { order_date: { $gte: '{12_months_ago}' } },
      compareTo: 'previousYear',
      chartConfig: {
        type: 'line',
        xAxis: { field: 'order_date', format: '%b %Y', showGridLines: true, logarithmic: false },
        yAxis: [{ field: 'total_amount', format: '$0,0', showGridLines: true, logarithmic: false }],
        showLegend: true,
        showDataLabels: false,
      },
      layout: { x: 0, y: 7, w: 12, h: 5 },
    },
  ],
};
