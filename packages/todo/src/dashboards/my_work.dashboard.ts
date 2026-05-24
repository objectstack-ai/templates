// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * My Work — landing dashboard for any user. Surfaces "what's mine, what's
 * burning, what got done this week" without filters.
 */
export const MyWorkDashboard: Dashboard = {
  name: 'my_work_dashboard',
  label: 'My Work',
  description: 'Personal landing page: open work, overdue items, throughput.',

  columns: 12,
  gap: 4,
  refreshInterval: 120,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [{ label: 'New Task', icon: 'Plus', actionType: 'modal', actionUrl: 'create_task' }],
  },

  widgets: [
    {
      id: 'my_open_tasks',
      title: 'My Open Tasks',
      type: 'metric',
      object: 'task',
      filter: { assignee: '{current_user_id}', status: { $in: ['todo', 'doing'] } },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'CheckSquare', format: '0,0' },
    },
    {
      id: 'my_overdue',
      title: 'Overdue',
      type: 'metric',
      object: 'task',
      filter: {
        assignee: '{current_user_id}',
        status: { $in: ['todo', 'doing'] },
        due_date: { $lt: '{today}' },
      },
      aggregate: 'count',
      colorVariant: 'danger',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'done_this_week',
      title: 'Done This Week',
      type: 'metric',
      object: 'task',
      filter: {
        assignee: '{current_user_id}',
        status: 'done',
        completed_at: { $gte: '{week_start}' },
      },
      aggregate: 'count',
      colorVariant: 'success',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'Trophy', format: '0,0' },
    },
    {
      id: 'my_projects',
      title: 'Active Projects',
      type: 'metric',
      object: 'project',
      filter: { owner: '{current_user_id}', status: 'active' },
      aggregate: 'count',
      colorVariant: 'orange',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'FolderKanban', format: '0,0' },
    },
    {
      id: 'recent_overdue_list',
      title: 'Overdue Tasks',
      type: 'table',
      object: 'task',
      aggregate: 'count',
      filter: {
        assignee: '{current_user_id}',
        status: { $in: ['todo', 'doing'] },
        due_date: { $lt: '{today}' },
      },
      layout: { x: 0, y: 2, w: 12, h: 4 },
      options: {
        columns: ['subject', 'project', 'priority', 'due_date'],
        pageSize: 10,
      },
    },
  ],
};
