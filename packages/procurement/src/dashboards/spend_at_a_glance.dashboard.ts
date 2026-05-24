// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Spend at a Glance — landing dashboard.
 * Surface what's pending approval, what's in flight with vendors, and
 * spend totals so the buying team has a single pane of glass.
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
      title: 'PRs Awaiting Approval',
      type: 'metric',
      object: 'procurement_request',
      filter: { status: 'submitted', estimated_amount: { $gte: 5000 } },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'open_pos',
      title: 'Open Purchase Orders',
      type: 'metric',
      object: 'procurement_order',
      filter: { status: { $in: ['sent', 'partial'] } },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'FileCheck', format: '0,0' },
    },
    {
      id: 'overdue_pos',
      title: 'Overdue Deliveries',
      type: 'metric',
      object: 'procurement_order',
      filter: {
        status: { $in: ['sent', 'partial'] },
        expected_delivery: { $lt: '{today}' },
      },
      aggregate: 'count',
      colorVariant: 'danger',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'open_commitment',
      title: 'Open Commitment ($)',
      type: 'metric',
      object: 'procurement_order',
      filter: { status: { $in: ['sent', 'partial'] } },
      aggregate: 'sum',
      valueField: 'total_amount',
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'TrendingUp', format: '$0,0' },
    },
    {
      id: 'pending_requests_table',
      title: 'Requests Awaiting Approval',
      type: 'table',
      object: 'procurement_request',
      aggregate: 'count',
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
      title: 'Open Purchase Orders',
      type: 'table',
      object: 'procurement_order',
      aggregate: 'count',
      filter: { status: { $in: ['sent', 'partial'] } },
      layout: { x: 8, y: 2, w: 4, h: 5 },
      options: {
        columns: ['po_number', 'vendor', 'total_amount', 'expected_delivery'],
        pageSize: 10,
        sort: [{ field: 'expected_delivery', order: 'asc' }],
      },
    },
  ],
};
