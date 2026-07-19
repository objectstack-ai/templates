// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Resource views — allocation grid plus a per-person rollup so PMs can spot
 * who is spread across too many projects (the resource-conflict story).
 */
export const ResourceViews = defineView({
  list: {
    type: 'grid',
    name: 'all_allocations',
    label: 'All Allocations',
    data: { provider: 'object', object: 'pm_resource' },
    columns: [
      { field: 'job_function', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'person', width: 160, sortable: true },
      { field: 'project', width: 200, sortable: true },
      { field: 'allocated_hours_per_week', width: 150, align: 'right', sortable: true },
      { field: 'start_date', width: 120, sortable: true },
      { field: 'end_date', width: 120, sortable: true },
    ],
    sort: [{ field: 'allocated_hours_per_week', order: 'desc' }],
    grouping: { fields: [{ field: 'project', order: 'asc', collapsed: false }] },
    selection: { type: 'multiple' },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: { allowedVisualizations: ['grid'] },
    tabs: [
      {
        name: 'all',
        label: 'All Allocations',
        view: 'all_allocations',
        isDefault: true,
        pinned: true,
      },
      { name: 'by_person', label: 'By Person', icon: 'user', view: 'allocations_by_person' },
    ],
  },

  listViews: {
    allocations_by_person: {
      name: 'allocations_by_person',
      type: 'grid',
      label: 'Allocations by Person',
      data: { provider: 'object', object: 'pm_resource' },
      columns: [
        { field: 'person', width: 180, pinned: 'left' },
        { field: 'job_function', width: 260 },
        { field: 'project', width: 200 },
        { field: 'allocated_hours_per_week', width: 150, align: 'right' },
      ],
      grouping: { fields: [{ field: 'person', order: 'asc', collapsed: false }] },
      sort: [
        { field: 'person', order: 'asc' },
        { field: 'allocated_hours_per_week', order: 'desc' },
      ],
    },
  },
});
