// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for todo_task. */
export const TodoTaskDataset = defineDataset({
  name: 'todo_task_metrics',
  label: 'todo_task metrics',
  object: 'todo_task',
  dimensions: [
    {
      name: 'completed_at',
      label: 'completed_at',
      field: 'completed_at',
      type: 'date',
      dateGranularity: 'week',
    },
  ],
  measures: [{ name: 'task_count', label: 'Tasks', aggregate: 'count' }],
});
