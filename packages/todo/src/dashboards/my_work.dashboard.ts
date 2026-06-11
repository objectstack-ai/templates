// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * My Work — landing dashboard for any user. Surfaces "what's mine, what's
 * burning, what got done this week" without filters.
 *
 * Trend overlay: "Done This Week" carries `compareTo: 'previousPeriod'`
 * (week-over-week delta) and a new weekly throughput line uses
 * `dateGranularity: 'week'` + `compareTo: 'previousPeriod'` so each
 * person sees their personal throughput vs. the prior 12 weeks.
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
      dataset: 'todo_task_metrics',
      values: ['task_count'],
      title: 'My Open Tasks',
      type: 'metric',
      filter: { assignee: '{current_user_id}', status: { $in: ['todo', 'doing'] } },
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 4, h: 2 },
      options: { icon: 'CheckSquare', format: '0,0' },
    },
    {
      id: 'my_overdue',
      dataset: 'todo_task_metrics',
      values: ['task_count'],
      title: 'Overdue',
      type: 'metric',
      filter: {
        assignee: '{current_user_id}',
        status: { $in: ['todo', 'doing'] },
        due_date: { $lt: '{today}' },
      },
      colorVariant: 'danger',
      layout: { x: 4, y: 0, w: 4, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'done_this_week',
      dataset: 'todo_task_metrics',
      values: ['task_count'],
      title: 'Done This Week',
      type: 'metric',
      filter: {
        assignee: '{current_user_id}',
        status: 'done',
        completed_at: { $gte: '{week_start}' },
      },
      compareTo: 'previousPeriod',
      colorVariant: 'success',
      layout: { x: 8, y: 0, w: 4, h: 2 },
      options: { icon: 'Trophy', format: '0,0' },
    },
    {
      id: 'recent_overdue_list',
      dataset: 'todo_task_metrics',
      values: ['task_count'],
      title: 'Overdue Tasks',
      type: 'table',
      filter: {
        assignee: '{current_user_id}',
        status: { $in: ['todo', 'doing'] },
        due_date: { $lt: '{today}' },
      },
      layout: { x: 0, y: 2, w: 12, h: 4 },
      options: {
        columns: ['subject', 'priority', 'labels', 'due_date'],
        pageSize: 10,
      },
    },
    {
      id: 'throughput_by_week',
      dataset: 'todo_task_metrics',
      dimensions: ['completed_at'],
      values: ['task_count'],
      title: 'My Throughput by Week (last 12 weeks)',
      type: 'line',
      filter: {
        assignee: '{current_user_id}',
        status: 'done',
        completed_at: { $gte: '{12_weeks_ago}' },
      },
      compareTo: 'previousPeriod',
      chartConfig: {
        type: 'line',
        xAxis: { field: 'completed_at', format: '%b %d', showGridLines: true, logarithmic: false },
        yAxis: [{ field: 'value', format: '0,0', showGridLines: true, logarithmic: false }],
        showLegend: true,
        showDataLabels: false,
      },
      layout: { x: 0, y: 6, w: 12, h: 4 },
    },
  ],
};
