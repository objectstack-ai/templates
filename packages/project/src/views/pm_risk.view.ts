// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Risk views — grid (primary) + risk matrix
 */
export const RiskViews = defineView({
  list: {
    type: 'grid',
    name: 'all_risks',
    label: 'All Risks',
    data: { provider: 'object', object: 'pm_risk' },
    columns: [
      { field: 'risk_id', width: 130, link: true, pinned: 'left', sortable: true },
      { field: 'name', width: 280, sortable: true },
      { field: 'project', width: 160 },
      { field: 'category', width: 120, sortable: true },
      { field: 'status', width: 120, sortable: true },
      { field: 'priority', width: 100, sortable: true },
      { field: 'impact', width: 100, sortable: true },
      { field: 'likelihood', width: 110, sortable: true },
      { field: 'ai_impact_score', width: 100, align: 'right', sortable: true },
      { field: 'ai_likelihood', width: 110, align: 'right', sortable: true },
      { field: 'response_strategy', width: 120 },
      { field: 'owner', width: 140 },
    ],
    sort: [
      { field: 'priority', order: 'desc' },
      { field: 'ai_impact_score', order: 'desc' },
    ],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    selection: { type: 'multiple' },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: {
      allowedVisualizations: ['grid'],
    },
    tabs: [
      { name: 'all', label: 'All Risks', view: 'all_risks', isDefault: true, pinned: true },
      { name: 'active', label: 'Active', icon: 'alert-circle', view: 'active_risks' },
      { name: 'critical', label: 'Critical', icon: 'alert-triangle', view: 'critical_risks' },
      { name: 'by_project', label: 'By Project', icon: 'folder', view: 'risks_by_project' },
    ],
  },

  listViews: {
    active_risks: {
      name: 'active_risks',
      type: 'grid',
      label: 'Active Risks',
      data: { provider: 'object', object: 'pm_risk' },
      filter: [
        { field: 'status', operator: 'in', value: ['identified', 'monitoring', 'mitigating'] },
      ],
      columns: [
        { field: 'risk_id', width: 130, link: true, pinned: 'left' },
        { field: 'name', width: 280 },
        { field: 'project', width: 160 },
        { field: 'priority', width: 100 },
        { field: 'ai_impact_score', width: 100, align: 'right' },
        { field: 'ai_likelihood', width: 110, align: 'right' },
        { field: 'ai_mitigation_suggestion', width: 300 },
      ],
      sort: [{ field: 'priority', order: 'desc' }],
    },

    critical_risks: {
      name: 'critical_risks',
      type: 'grid',
      label: 'Critical Risks',
      data: { provider: 'object', object: 'pm_risk' },
      // priority is impact × likelihood (1–25); "critical" = 15+.
      filter: [{ field: 'priority', operator: 'greater_or_equal', value: 15 }],
      columns: [
        { field: 'risk_id', width: 130, link: true, pinned: 'left' },
        { field: 'name', width: 280 },
        { field: 'project', width: 160 },
        { field: 'priority', width: 100, align: 'right' },
        { field: 'ai_impact_score', width: 100, align: 'right' },
        { field: 'response_strategy', width: 120 },
        { field: 'owner', width: 140 },
        { field: 'mitigation_plan', width: 300 },
      ],
      sort: [{ field: 'ai_impact_score', order: 'desc' }],
    },

    risks_by_project: {
      name: 'risks_by_project',
      type: 'grid',
      label: 'Risks by Project',
      data: { provider: 'object', object: 'pm_risk' },
      columns: [
        { field: 'project', width: 160, pinned: 'left' },
        { field: 'risk_id', width: 130, link: true },
        { field: 'name', width: 280 },
        { field: 'priority', width: 100 },
        { field: 'status', width: 120 },
        { field: 'ai_impact_score', width: 100, align: 'right' },
      ],
      grouping: { fields: [{ field: 'project', order: 'asc', collapsed: true }] },
      sort: [
        { field: 'project', order: 'asc' },
        { field: 'priority', order: 'desc' },
      ],
    },
  },
});
