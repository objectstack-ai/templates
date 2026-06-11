// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Expenses Overview — the landing dashboard for the expense app.
 * Shows what needs a decision (pending approval), what owes money
 * (approved → awaiting reimbursement), and spend trend / mix.
 *
 * NOTE: filters use base fields only — the analytics service does NOT
 * resolve formula fields, so thresholds are recomputed inline.
 */
export const ExpensesOverviewDashboard: Dashboard = {
  name: 'expenses_overview_dashboard',
  label: 'Expenses Overview',
  description:
    'Reports awaiting approval, amounts owed to employees, and spend trend by month and category.',

  columns: 12,
  gap: 4,
  refreshInterval: 300,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [
      { label: 'New Report', icon: 'Plus', actionType: 'modal', actionUrl: 'create_report' },
    ],
  },

  widgets: [
    {
      id: 'awaiting_approval',
      dataset: 'expense_report_metrics',
      values: ['report_count'],
      title: 'Awaiting Approval',
      type: 'metric',
      filter: { status: 'submitted' },
      colorVariant: 'warning',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'awaiting_reimbursement',
      dataset: 'expense_report_metrics',
      values: ['report_count'],
      title: 'To Reimburse',
      type: 'metric',
      filter: { status: 'approved' },
      colorVariant: 'blue',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'Banknote', format: '0,0' },
    },
    {
      id: 'owed_amount',
      dataset: 'expense_report_metrics',
      values: ['sum_total_amount'],
      title: 'Owed to Employees ($)',
      type: 'metric',
      filter: { status: 'approved' },
      colorVariant: 'danger',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '$0,0' },
    },
    {
      id: 'reimbursed_total',
      dataset: 'expense_report_metrics',
      values: ['sum_total_amount'],
      title: 'Reimbursed ($)',
      type: 'metric',
      filter: { status: 'reimbursed' },
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'CheckCircle', format: '$0,0' },
    },
    // Record listings moved to object-bound ListViews (ADR-0017): the former
    // `pending_reports_table` / `to_reimburse_table` now live on the Reports
    // object as the "Awaiting Approval" / "To Reimburse" tabs. The metric
    // widgets above keep the at-a-glance counts on this dashboard.
    {
      id: 'spend_by_category',
      dataset: 'expense_line_metrics',
      dimensions: ['category'],
      values: ['sum_amount'],
      title: 'Spend by Category',
      type: 'bar',
      layout: { x: 0, y: 7, w: 5, h: 5 },
      chartConfig: {
        type: 'bar',
        xAxis: { field: 'category', showGridLines: false, logarithmic: false },
        yAxis: [{ field: 'amount', format: '$0,0', showGridLines: true, logarithmic: false }],
        showLegend: false,
        showDataLabels: false,
      },
    },
    {
      id: 'spend_by_month',
      dataset: 'expense_report_metrics',
      dimensions: ['reimbursed_at'],
      values: ['sum_total_amount'],
      title: 'Reimbursed by Month (last 12 months)',
      type: 'line',
      filter: { reimbursed_at: { $gte: '{12_months_ago}' } },
      compareTo: 'previousYear',
      chartConfig: {
        type: 'line',
        xAxis: { field: 'reimbursed_at', format: '%b %Y', showGridLines: true, logarithmic: false },
        yAxis: [{ field: 'total_amount', format: '$0,0', showGridLines: true, logarithmic: false }],
        showLegend: true,
        showDataLabels: false,
      },
      layout: { x: 5, y: 7, w: 7, h: 5 },
    },
  ],
};
