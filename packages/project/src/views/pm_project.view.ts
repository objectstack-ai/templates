// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Project views — grid (primary) + kanban by status
 */
export const ProjectViews = defineView({
  list: {
    type: 'grid',
    name: 'all_projects',
    label: 'All Projects',
    data: { provider: 'object', object: 'pm_project' },
    columns: [
      { field: 'code', width: 130, link: true, pinned: 'left', sortable: true },
      { field: 'name', width: 280, sortable: true },
      { field: 'status', width: 110, sortable: true },
      { field: 'priority', width: 100, sortable: true },
      { field: 'health', width: 120, sortable: true },
      { field: 'progress_percent', width: 100, align: 'right', sortable: true },
      { field: 'ai_completion_probability', width: 130, align: 'right', sortable: true },
      { field: 'ai_risk_score', width: 110, align: 'right', sortable: true },
      { field: 'project_manager', width: 160 },
      { field: 'start_date', width: 120, sortable: true },
      { field: 'target_end_date', width: 120, sortable: true },
    ],
    sort: [{ field: 'priority', order: 'desc' }, { field: 'health', order: 'asc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    selection: { type: 'multiple' },
    pagination: { pageSize: 25, pageSizeOptions: [10, 25, 50] },
    exportOptions: ['csv', 'xlsx'],
    appearance: {
      allowedVisualizations: ['grid', 'kanban'],
    },
    tabs: [
      { name: 'all', label: 'All Projects', view: 'all_projects', isDefault: true, pinned: true },
      { name: 'active', label: 'Active', icon: 'activity', view: 'active_projects' },
      { name: 'at_risk', label: 'At Risk', icon: 'alert-triangle', view: 'at_risk_projects' },
      { name: 'my', label: 'My Projects', icon: 'user', view: 'my_projects' },
    ],
  },

  listViews: {
    project_kanban: {
      name: 'project_kanban',
      type: 'kanban',
      label: 'Project Board',
      data: { provider: 'object', object: 'pm_project' },
      columns: ['name', 'project_manager', 'progress_percent', 'ai_risk_score'],
      kanban: {
        groupByField: 'status',
        columns: ['name', 'project_manager', 'progress_percent', 'ai_risk_score'],
      },
    },

    active_projects: {
      name: 'active_projects',
      type: 'grid',
      label: 'Active Projects',
      data: {
        provider: 'object',
        object: 'pm_project',
        filter: 'status == "active"',
      },
      columns: [
        { field: 'code', width: 130, link: true, pinned: 'left' },
        { field: 'name', width: 280 },
        { field: 'health', width: 120 },
        { field: 'progress_percent', width: 100, align: 'right' },
        { field: 'ai_completion_probability', width: 130, align: 'right' },
        { field: 'ai_delay_days', width: 110, align: 'right' },
        { field: 'project_manager', width: 160 },
      ],
      sort: [{ field: 'health', order: 'asc' }],
    },

    at_risk_projects: {
      name: 'at_risk_projects',
      type: 'grid',
      label: 'At Risk Projects',
      data: {
        provider: 'object',
        object: 'pm_project',
        filter: 'health == "at_risk" || ai_risk_score >= 70',
      },
      columns: [
        { field: 'code', width: 130, link: true, pinned: 'left' },
        { field: 'name', width: 280 },
        { field: 'ai_risk_score', width: 110, align: 'right' },
        { field: 'ai_delay_days', width: 110, align: 'right' },
        { field: 'ai_recommended_action', width: 350 },
        { field: 'project_manager', width: 160 },
      ],
      sort: [{ field: 'ai_risk_score', order: 'desc' }],
    },

    my_projects: {
      name: 'my_projects',
      type: 'grid',
      label: 'My Projects',
      data: {
        provider: 'object',
        object: 'pm_project',
        filter: 'project_manager == $currentUser.id',
      },
      columns: [
        { field: 'code', width: 130, link: true, pinned: 'left' },
        { field: 'name', width: 280 },
        { field: 'status', width: 110 },
        { field: 'health', width: 120 },
        { field: 'progress_percent', width: 100, align: 'right' },
        { field: 'ai_risk_score', width: 110, align: 'right' },
      ],
      sort: [{ field: 'priority', order: 'desc' }],
    },
  },
});
