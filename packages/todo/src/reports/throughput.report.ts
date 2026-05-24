// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { ReportInput } from '@objectstack/spec/ui';

/** Tasks completed per week, broken down by project — throughput trend. */
export const ThroughputReport: ReportInput = {
  name: 'task_throughput_by_week',
  label: 'Task Throughput (Week × Project)',
  description: 'Weekly count of completed tasks grouped by project.',
  objectName: 'task',
  type: 'matrix',
  columns: [{ field: 'id', label: 'Completed', aggregate: 'count' }],
  groupingsDown:   [{ field: 'project', sortOrder: 'asc' }],
  groupingsAcross: [{ field: 'completed_at', dateGranularity: 'week', sortOrder: 'asc' }],
  filter: { status: 'done' },
};
