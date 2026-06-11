// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Renewals at Risk — the landing dashboard. Surfaces what's about to
 * auto-renew, what's just signed, and total exposure by counterparty.
 *
 * Trend overlay: the "Contracts Signed by Month" line includes a YoY
 * (`compareTo: 'previousYear'`) overlay rendered as a muted dashed series
 * so the GC can see whether new-business velocity is up or down vs. the
 * same month last year. Server-side date bucketing (`dateGranularity:
 * 'month'`) avoids the one-row-per-signed_date spike that would otherwise
 * flatten the chart.
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
      dataset: 'contracts_contract_metrics',
      values: ['contract_count'],
      title: 'Expiring ≤ 60 days',
      type: 'metric',
      // NOTE: filter on base fields only — formula fields (`is_expiring_soon`,
      // `approval_required`) are not queryable by the analytics service in
      // spec 5.2. Recompute the boundary in MongoDB-style filters instead.
      filter: {
        status: 'active',
        end_date: { $gte: '{today}', $lte: '{60_days_from_now}' },
      },
      colorVariant: 'warning',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'auto_renewing_30',
      dataset: 'contracts_contract_metrics',
      values: ['contract_count'],
      title: 'Auto-Renewing ≤ 30d',
      type: 'metric',
      filter: {
        status: 'active',
        auto_renew: true,
        end_date: { $gte: '{today}', $lte: '{30_days_from_now}' },
      },
      colorVariant: 'danger',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'pending_approval',
      dataset: 'contracts_contract_metrics',
      values: ['contract_count'],
      title: 'Pending Approval',
      type: 'metric',
      filter: {
        status: 'in_review',
        total_value: { $gte: 50000 },
      },
      colorVariant: 'blue',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'CheckCircle', format: '0,0' },
    },
    {
      id: 'active_total_value',
      dataset: 'contracts_contract_metrics',
      values: ['sum_total_value'],
      title: 'Active Portfolio Value',
      type: 'metric',
      filter: { status: 'active' },
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'TrendingUp', format: '$0,0' },
    },
    // Record listings moved to object-bound ListViews (ADR-0017): the former
    // `expiring_table` is the Contracts "Expiring ≤ 60d" tab; `pending_obligations`
    // is the Obligations "Open" tab. KPI widgets above keep the counts here.
    {
      id: 'signed_by_month',
      dataset: 'contracts_contract_metrics',
      dimensions: ['signed_date'],
      values: ['contract_count'],
      title: 'Contracts Signed by Month (last 12 months)',
      type: 'line',
      filter: { signed_date: { $gte: '{12_months_ago}' } },
      compareTo: 'previousYear',
      chartConfig: {
        type: 'line',
        xAxis: { field: 'signed_date', format: '%b %Y', showGridLines: true, logarithmic: false },
        yAxis: [
          { field: 'contract_count', format: '0,0', showGridLines: true, logarithmic: false },
        ],
        showLegend: true,
        showDataLabels: false,
      },
      layout: { x: 0, y: 7, w: 12, h: 5 },
    },
  ],
};
