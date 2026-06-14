// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * PM Workbench — the delivery view for a project manager: pipeline by stage,
 * project mix, and where risk is sitting by lifecycle stage.
 */
export const PmWorkbenchDashboard: Dashboard = {
  name: 'pm_workbench_dashboard',
  label: 'PM Workbench',
  description: 'Delivery pipeline by stage, project mix by type, and risk by lifecycle stage.',

  columns: 12,
  gap: 4,
  refreshInterval: 300,

  header: { showTitle: true, showDescription: true },

  widgets: [
    {
      id: 'wb_planning',
      dataset: 'pm_project_metrics',
      values: ['project_count'],
      title: 'In Planning',
      type: 'metric',
      filter: { status: 'planning' },
      colorVariant: 'default',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'PencilRuler', format: '0,0' },
    },
    {
      id: 'wb_active',
      dataset: 'pm_project_metrics',
      values: ['project_count'],
      title: 'Active',
      type: 'metric',
      filter: { status: 'active' },
      colorVariant: 'blue',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'Activity', format: '0,0' },
    },
    {
      id: 'wb_completed',
      dataset: 'pm_project_metrics',
      values: ['project_count'],
      title: 'Completed',
      type: 'metric',
      filter: { status: 'completed' },
      colorVariant: 'success',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'CheckCircle', format: '0,0' },
    },
    {
      id: 'wb_open_risks',
      dataset: 'pm_risk_metrics',
      values: ['risk_count'],
      title: 'Open Risks',
      type: 'metric',
      colorVariant: 'warning',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'wb_projects_by_type',
      dataset: 'pm_project_metrics',
      dimensions: ['project_type'],
      values: ['project_count'],
      title: 'Projects by Type',
      type: 'bar',
      chartConfig: {
        type: 'bar',
        xAxis: { field: 'project_type', showGridLines: false, logarithmic: false },
        yAxis: [{ field: 'project_count', showGridLines: true, logarithmic: false }],
        showLegend: false,
        showDataLabels: false,
      },
      layout: { x: 0, y: 2, w: 6, h: 6 },
    },
    {
      id: 'wb_risks_by_status',
      dataset: 'pm_risk_metrics',
      dimensions: ['status'],
      values: ['risk_count'],
      title: 'Risks by Stage',
      type: 'bar',
      chartConfig: {
        type: 'bar',
        xAxis: { field: 'status', showGridLines: false, logarithmic: false },
        yAxis: [{ field: 'risk_count', showGridLines: true, logarithmic: false }],
        showLegend: false,
        showDataLabels: false,
      },
      layout: { x: 6, y: 2, w: 6, h: 6 },
    },
  ],
};
