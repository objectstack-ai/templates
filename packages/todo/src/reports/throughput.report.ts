// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { ReportInput } from '@objectstack/spec/ui';

/** Tasks completed per week, broken down by assignee — throughput trend. */
export const ThroughputReport: ReportInput = {
  name: 'todo_task_throughput_by_week',
  label: 'Task Throughput (Week × Assignee)',
  description: 'Weekly count of completed tasks grouped by assignee.',
  objectName: 'todo_task',
  type: 'matrix',
  columns: [{ field: 'id', label: 'Completed', aggregate: 'count' }],
  groupingsDown: [{ field: 'assignee', sortOrder: 'asc' }],
  groupingsAcross: [{ field: 'completed_at', dateGranularity: 'week', sortOrder: 'asc' }],
  filter: { status: 'done' },
};
