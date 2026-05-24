// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { ReportInput } from '@objectstack/spec/ui';

/** Overdue tasks grouped by assignee — what's slipping and on whose plate. */
export const OverdueTasksReport: ReportInput = {
  name: 'overdue_tasks_by_assignee',
  label: 'Overdue Tasks by Assignee',
  description: 'Currently overdue tasks (status in todo/doing, due_date in the past), grouped by assignee.',
  objectName: 'task',
  type: 'summary',
  columns: [
    { field: 'id',          label: 'Count',   aggregate: 'count' },
    { field: 'subject',     label: 'Subject' },
    { field: 'project',     label: 'Project' },
    { field: 'priority',    label: 'Priority' },
    { field: 'due_date',    label: 'Due Date' },
  ],
  groupingsDown: [{ field: 'assignee', sortOrder: 'asc' }],
  filter: {
    status: { $in: ['todo', 'doing'] },
    due_date: { $lt: '{today}' },
  },
};
