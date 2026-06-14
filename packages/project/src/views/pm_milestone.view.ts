// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Milestone views — grid + timeline/gantt
 */
export const MilestoneViews = defineView({
  list: {
    type: 'grid',
    name: 'all_milestones',
    label: 'All Milestones',
    data: { provider: 'object', object: 'pm_milestone' },
    columns: [
      { field: 'name', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'project', width: 160, sortable: true },
      { field: 'status', width: 120, sortable: true },
      { field: 'is_critical_path', width: 120, align: 'center', sortable: true },
      { field: 'planned_date', width: 120, sortable: true },
      { field: 'actual_date', width: 120, sortable: true },
      { field: 'deliverables', width: 300 },
    ],
    sort: [{ field: 'planned_date', order: 'asc' }],
    grouping: { fields: [{ field: 'project', order: 'asc', collapsed: false }] },
    selection: { type: 'multiple' },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: {
      allowedVisualizations: ['grid', 'timeline'],
    },
    tabs: [
      {
        name: 'all',
        label: 'All Milestones',
        view: 'all_milestones',
        isDefault: true,
        pinned: true,
      },
      { name: 'upcoming', label: 'Upcoming', icon: 'calendar', view: 'upcoming_milestones' },
      { name: 'at_risk', label: 'At Risk', icon: 'alert-triangle', view: 'at_risk_milestones' },
      {
        name: 'critical_path',
        label: 'Critical Path',
        icon: 'zap',
        view: 'critical_path_milestones',
      },
    ],
  },

  listViews: {
    upcoming_milestones: {
      name: 'upcoming_milestones',
      type: 'grid',
      label: 'Upcoming Milestones',
      data: { provider: 'object', object: 'pm_milestone' },
      filter: [
        { field: 'status', operator: 'in', value: ['not_started', 'in_progress'] },
        { field: 'planned_date', operator: 'not_equals', value: null },
      ],
      columns: [
        { field: 'name', width: 280, link: true, pinned: 'left' },
        { field: 'project', width: 160 },
        { field: 'status', width: 120 },
        { field: 'planned_date', width: 120 },
        { field: 'is_critical_path', width: 120, align: 'center' },
      ],
      sort: [{ field: 'planned_date', order: 'asc' }],
    },

    at_risk_milestones: {
      name: 'at_risk_milestones',
      type: 'grid',
      label: 'At Risk Milestones',
      data: { provider: 'object', object: 'pm_milestone' },
      // "At risk" = still open but the planned date is already in the past.
      filter: [
        { field: 'status', operator: 'in', value: ['not_started', 'in_progress'] },
        { field: 'planned_date', operator: 'less_than', value: '{today}' },
      ],
      columns: [
        { field: 'name', width: 280, link: true, pinned: 'left' },
        { field: 'project', width: 160 },
        { field: 'planned_date', width: 120 },
        { field: 'is_critical_path', width: 120, align: 'center' },
        { field: 'deliverables', width: 300 },
      ],
      sort: [{ field: 'planned_date', order: 'asc' }],
    },

    critical_path_milestones: {
      name: 'critical_path_milestones',
      type: 'grid',
      label: 'Critical Path Milestones',
      data: { provider: 'object', object: 'pm_milestone' },
      filter: [{ field: 'is_critical_path', operator: 'equals', value: true }],
      columns: [
        { field: 'name', width: 280, link: true, pinned: 'left' },
        { field: 'project', width: 160 },
        { field: 'status', width: 120 },
        { field: 'planned_date', width: 120 },
        { field: 'actual_date', width: 120 },
      ],
      sort: [
        { field: 'project', order: 'asc' },
        { field: 'planned_date', order: 'asc' },
      ],
    },
  },
});
