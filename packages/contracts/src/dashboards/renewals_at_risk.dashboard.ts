// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Renewals at Risk — the landing dashboard. Surfaces what's about to
 * auto-renew, what's just signed, and total exposure by counterparty.
 */
export const RenewalsAtRiskDashboard: Dashboard = {
  name: 'renewals_at_risk_dashboard',
  label: 'Renewals at Risk',
  description: 'Contracts expiring soon, recently signed, and overall portfolio exposure.',

  columns: 12,
  gap: 4,
  refreshInterval: 300,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [
      { label: 'New Contract', icon: 'Plus', actionType: 'modal', actionUrl: 'create_contract' },
    ],
  },

  widgets: [
    {
      id: 'expiring_60',
      title: 'Expiring ≤ 60 days',
      type: 'metric',
      object: 'contracts_contract',
      // NOTE: filter on base fields only — formula fields (`is_expiring_soon`,
      // `approval_required`) are not queryable by the analytics service in
      // spec 5.2. Recompute the boundary in MongoDB-style filters instead.
      filter: {
        status: 'active',
        end_date: { $gte: '{today}', $lte: '{60_days_from_now}' },
      },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'auto_renewing_30',
      title: 'Auto-Renewing ≤ 30d',
      type: 'metric',
      object: 'contracts_contract',
      filter: {
        status: 'active',
        auto_renew: true,
        end_date: { $gte: '{today}', $lte: '{30_days_from_now}' },
      },
      aggregate: 'count',
      colorVariant: 'danger',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'pending_approval',
      title: 'Pending Approval',
      type: 'metric',
      object: 'contracts_contract',
      filter: {
        status: 'in_review',
        total_value: { $gte: 50000 },
      },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'CheckCircle', format: '0,0' },
    },
    {
      id: 'active_total_value',
      title: 'Active Portfolio Value',
      type: 'metric',
      object: 'contracts_contract',
      filter: { status: 'active' },
      aggregate: 'sum',
      valueField: 'total_value',
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'TrendingUp', format: '$0,0' },
    },
    {
      id: 'expiring_table',
      title: 'Expiring Contracts (Next 60d)',
      type: 'table',
      object: 'contracts_contract',
      aggregate: 'count',
      // Only `{today}` is resolved client-side by the data endpoint; tokens
      // like `{60_days_from_now}` only work inside the analytics service.
      // We sort ascending by end_date and rely on pageSize to cap the list
      // to the nearest renewals.
      filter: {
        status: 'active',
        end_date: { $gte: '{today}' },
      },
      layout: { x: 0, y: 2, w: 8, h: 5 },
      options: {
        columns: ['title', 'contract_type', 'end_date', 'auto_renew', 'total_value'],
        pageSize: 10,
        sort: [{ field: 'end_date', order: 'asc' }],
      },
    },
    {
      id: 'pending_obligations',
      title: 'Open Obligations',
      type: 'table',
      object: 'contracts_obligation',
      aggregate: 'count',
      filter: { status: 'open' },
      layout: { x: 8, y: 2, w: 4, h: 5 },
      options: {
        columns: ['summary', 'due_date', 'amount'],
        pageSize: 10,
        sort: [{ field: 'due_date', order: 'asc' }],
      },
    },
  ],
};
