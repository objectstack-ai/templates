// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const ProjectViews = defineView({
  list: {
    type: 'grid',
    name: 'all_projects',
    label: 'All Projects',
    data: { provider: 'object', object: 'project' },
    columns: [
      { field: 'name', width: 240, link: true, pinned: 'left', sortable: true },
      { field: 'key', width: 90 },
      { field: 'status', width: 120, sortable: true },
      { field: 'owner', width: 160 },
      { field: 'task_count', width: 110, align: 'right', summary: 'sum' },
      { field: 'target_date', width: 130, sortable: true },
    ],
    sort: [
      { field: 'status', order: 'asc' },
      { field: 'name', order: 'asc' },
    ],
    selection: { type: 'multiple' },
    pagination: { pageSize: 25, pageSizeOptions: [10, 25, 50] },
    exportOptions: ['csv', 'xlsx'],
    tabs: [
      { name: 'all', label: 'All', view: 'all_projects', isDefault: true, pinned: true },
      { name: 'active', label: 'Active', view: 'active_projects' },
      { name: 'mine', label: 'Mine', view: 'my_projects' },
    ],
  },

  listViews: {
    active_projects: {
      name: 'active_projects',
      type: 'grid',
      label: 'Active Projects',
      data: { provider: 'object', object: 'project' },
      columns: ['name', 'key', 'owner', 'task_count', 'target_date'],
      filter: [{ field: 'status', operator: 'equals', value: 'active' }],
      sort: [{ field: 'target_date', order: 'asc' }],
    },
    my_projects: {
      name: 'my_projects',
      type: 'grid',
      label: 'My Projects',
      data: { provider: 'object', object: 'project' },
      columns: ['name', 'key', 'status', 'task_count', 'target_date'],
      filter: [{ field: 'owner', operator: 'equals', value: '{current_user_id}' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'project' },
    sections: [
      {
        label: 'Project',
        columns: 2,
        fields: [{ field: 'name', required: true, colSpan: 2 }, 'key', 'status', 'owner', 'color'],
      },
      {
        label: 'Schedule',
        columns: 2,
        fields: ['start_date', 'target_date'],
      },
      {
        label: 'Description',
        columns: 1,
        fields: ['description'],
      },
    ],
  },
});
