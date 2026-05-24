// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Task views — grid (primary), kanban (by status), and "my open work" filter.
 */
export const TaskViews = defineView({
  list: {
    type: 'grid',
    name: 'all_tasks',
    label: 'All Tasks',
    data: { provider: 'object', object: 'task' },
    columns: [
      { field: 'subject', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'project', width: 160, sortable: true },
      { field: 'status', width: 110, sortable: true },
      { field: 'priority', width: 100, sortable: true },
      { field: 'assignee', width: 150 },
      { field: 'due_date', width: 130, sortable: true },
      { field: 'is_overdue', width: 100, align: 'center' },
    ],
    sort: [{ field: 'due_date', order: 'asc' }],
    grouping: { fields: [{ field: 'project', order: 'asc', collapsed: false }] },
    selection: { type: 'multiple' },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: {
      allowedVisualizations: ['grid', 'kanban'],
    },
    tabs: [
      { name: 'all', label: 'All', view: 'all_tasks', isDefault: true, pinned: true },
      { name: 'board', label: 'Board', icon: 'columns-3', view: 'task_board' },
      { name: 'mine', label: 'My Open', icon: 'user', view: 'my_open_tasks' },
      { name: 'overdue', label: 'Overdue', icon: 'clock', view: 'overdue_tasks' },
    ],
    bulkActionDefs: [
      {
        name: 'reassign',
        label: 'Reassign',
        icon: 'user-check',
        operation: 'update',
        params: [
          {
            name: 'assignee',
            label: 'New Assignee',
            type: 'lookup',
            object: 'user',
            required: true,
          },
        ],
        confirmText: 'Reassign {{count}} task(s)?',
      },
      {
        name: 'mark_done',
        label: 'Mark Done',
        icon: 'check',
        operation: 'update',
        params: [],
        confirmText: 'Mark {{count}} task(s) as done?',
      },
    ],
  },

  listViews: {
    task_board: {
      name: 'task_board',
      type: 'kanban',
      label: 'Task Board',
      data: { provider: 'object', object: 'task' },
      columns: ['subject', 'priority', 'assignee', 'due_date'],
      kanban: {
        groupByField: 'status',
        columns: ['subject', 'priority', 'assignee', 'due_date'],
      },
    },

    my_open_tasks: {
      name: 'my_open_tasks',
      type: 'grid',
      label: 'My Open Tasks',
      data: { provider: 'object', object: 'task' },
      columns: ['subject', 'project', 'priority', 'due_date'],
      filter: [
        { field: 'assignee', operator: 'equals', value: '{current_user_id}' },
        { field: 'status', operator: 'in', value: ['todo', 'doing'] },
      ],
      sort: [
        { field: 'priority', order: 'desc' },
        { field: 'due_date', order: 'asc' },
      ],
    },

    overdue_tasks: {
      name: 'overdue_tasks',
      type: 'grid',
      label: 'Overdue Tasks',
      data: { provider: 'object', object: 'task' },
      columns: ['subject', 'project', 'assignee', 'priority', 'due_date'],
      filter: [
        { field: 'status', operator: 'in', value: ['todo', 'doing'] },
        { field: 'due_date', operator: 'less_than', value: '{today}' },
      ],
      sort: [{ field: 'due_date', order: 'asc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'task' },
    sections: [
      {
        label: 'Task',
        columns: 2,
        fields: [
          { field: 'subject', required: true, colSpan: 2 },
          'project',
          'assignee',
          'status',
          'priority',
        ],
      },
      {
        label: 'Planning',
        columns: 2,
        fields: ['due_date', 'estimate_hours', 'started_at', 'completed_at'],
      },
      {
        label: 'Description',
        columns: 1,
        fields: ['description'],
      },
    ],
  },
});
