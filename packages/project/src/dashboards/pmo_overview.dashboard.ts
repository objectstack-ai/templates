// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * PMO Overview — portfolio health at a glance for the PMO / sponsors.
 * Answers: how many projects are in trouble, where is the risk concentrated,
 * and how is budget distributed across the portfolio.
 *
 * NOTE: filters use base fields only — the analytics service does not resolve
 * formula fields, so health/status are read directly (both are stored).
 */
export const PmoOverviewDashboard: Dashboard = {
  name: 'pmo_overview_dashboard',
  label: 'PMO Overview',
  description:
    'Portfolio health: active vs at-risk vs off-track projects, risk by category, budget by status.',

  columns: 12,
  gap: 4,
  refreshInterval: 300,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [
      { label: 'New Project', icon: 'Plus', actionType: 'modal', actionUrl: 'create_project' },
    ],
  },

  widgets: [
    {
      id: 'active_projects',
      dataset: 'pm_project_metrics',
      values: ['project_count'],
      title: 'Active Projects',
      type: 'metric',
      filter: { status: 'active' },
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Activity', format: '0,0' },
    },
    {
      id: 'at_risk_projects',
      dataset: 'pm_project_metrics',
      values: ['project_count'],
      title: 'At Risk',
      type: 'metric',
      filter: { health: 'at_risk' },
      colorVariant: 'warning',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'off_track_projects',
      dataset: 'pm_project_metrics',
      values: ['project_count'],
      title: 'Off Track',
      type: 'metric',
      filter: { health: 'off_track' },
      colorVariant: 'danger',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'TrendingDown', format: '0,0' },
    },
    {
      id: 'avg_risk_score',
      dataset: 'pm_project_metrics',
      values: ['avg_risk_score'],
      title: 'Avg AI Risk Score',
      type: 'metric',
      colorVariant: 'default',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'Sparkles', format: '0' },
    },
    {
      id: 'projects_by_health',
      dataset: 'pm_project_metrics',
      dimensions: ['health'],
      values: ['project_count'],
      title: 'Projects by Health',
      type: 'pie',
      chartConfig: {
        type: 'pie',
        xAxis: { field: 'health', showGridLines: false, logarithmic: false },
        yAxis: [{ field: 'project_count', showGridLines: true, logarithmic: false }],
        showLegend: true,
        showDataLabels: true,
      },
      options: { donut: true, legend: 'right' },
      layout: { x: 0, y: 2, w: 4, h: 6 },
    },
    {
      id: 'risk_by_category',
      dataset: 'pm_risk_metrics',
      dimensions: ['category'],
      values: ['risk_count'],
      title: 'Open Risks by Category',
      type: 'bar',
      chartConfig: {
        type: 'bar',
        xAxis: { field: 'category', showGridLines: false, logarithmic: false },
        yAxis: [{ field: 'risk_count', showGridLines: true, logarithmic: false }],
        showLegend: false,
        showDataLabels: false,
      },
      layout: { x: 4, y: 2, w: 4, h: 6 },
    },
    {
      id: 'budget_by_status',
      dataset: 'pm_project_metrics',
      dimensions: ['status'],
      values: ['sum_planned_budget'],
      title: 'Planned Budget by Status',
      type: 'bar',
      chartConfig: {
        type: 'bar',
        xAxis: { field: 'status', showGridLines: false, logarithmic: false },
        yAxis: [
          { field: 'sum_planned_budget', format: '$0,0', showGridLines: true, logarithmic: false },
        ],
        showLegend: false,
        showDataLabels: false,
      },
      layout: { x: 8, y: 2, w: 4, h: 6 },
    },
  ],
};
