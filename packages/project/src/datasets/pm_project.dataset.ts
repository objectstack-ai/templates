// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for pm_project portfolio analytics. */
export const ProjectDataset = defineDataset({
  name: 'pm_project_metrics',
  label: 'pm_project metrics',
  object: 'pm_project',
  dimensions: [
    { name: 'status', label: 'status', field: 'status', type: 'string' },
    { name: 'health', label: 'health', field: 'health', type: 'string' },
    { name: 'priority', label: 'priority', field: 'priority', type: 'string' },
    { name: 'project_type', label: 'project_type', field: 'project_type', type: 'string' },
  ],
  measures: [
    { name: 'project_count', label: 'project_count', aggregate: 'count' },
    { name: 'avg_risk_score', label: 'avg_risk_score', aggregate: 'avg', field: 'ai_risk_score' },
    {
      name: 'sum_planned_budget',
      label: 'sum_planned_budget',
      aggregate: 'sum',
      field: 'planned_budget',
    },
    { name: 'sum_actual_cost', label: 'sum_actual_cost', aggregate: 'sum', field: 'actual_cost' },
  ],
});
