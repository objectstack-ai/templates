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
  description: 'Reports awaiting approval, amounts owed to employees, and spend trend by month and category.',

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
      title: 'Awaiting Approval',
      type: 'metric',
      object: 'expense_report',
      filter: { status: 'submitted' },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'awaiting_reimbursement',
      title: 'To Reimburse',
      type: 'metric',
      object: 'expense_report',
      filter: { status: 'approved' },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'Banknote', format: '0,0' },
    },
    {
      id: 'owed_amount',
      title: 'Owed to Employees ($)',
      type: 'metric',
      object: 'expense_report',
      filter: { status: 'approved' },
      aggregate: 'sum',
      valueField: 'total_amount',
      colorVariant: 'danger',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '$0,0' },
    },
    {
      id: 'reimbursed_total',
      title: 'Reimbursed ($)',
      type: 'metric',
      object: 'expense_report',
      filter: { status: 'reimbursed' },
      aggregate: 'sum',
      valueField: 'total_amount',
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'CheckCircle', format: '$0,0' },
    },
    {
      id: 'pending_reports_table',
      title: 'Reports Awaiting Approval',
      type: 'table',
      object: 'expense_report',
      aggregate: 'count',
      filter: { status: 'submitted' },
      layout: { x: 0, y: 2, w: 8, h: 5 },
      options: {
        columns: ['title', 'requester', 'total_amount', 'cost_center', 'submitted_at'],
        pageSize: 10,
        sort: [{ field: 'total_amount', order: 'desc' }],
      },
    },
    {
      id: 'to_reimburse_table',
      title: 'Approved — To Reimburse',
      type: 'table',
      object: 'expense_report',
      aggregate: 'count',
      filter: { status: 'approved' },
      layout: { x: 8, y: 2, w: 4, h: 5 },
      options: {
        columns: ['title', 'requester', 'total_amount'],
        pageSize: 10,
        sort: [{ field: 'approved_at', order: 'asc' }],
      },
    },
    {
      id: 'spend_by_category',
      title: 'Spend by Category',
      type: 'bar',
      object: 'expense_line',
      aggregate: 'sum',
      valueField: 'amount',
      categoryField: 'category',
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
      title: 'Reimbursed by Month (last 12 months)',
      type: 'line',
      object: 'expense_report',
      filter: { reimbursed_at: { $gte: '{12_months_ago}' } },
      aggregate: 'sum',
      valueField: 'total_amount',
      categoryField: 'reimbursed_at',
      categoryGranularity: 'month',
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
