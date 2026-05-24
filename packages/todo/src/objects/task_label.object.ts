// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Junction object — implements M:N between `task` and `label`.
 * Master-detail to `task` so labels are cleaned up when the task is deleted.
 */
export const TaskLabel = ObjectSchema.create({
  name: 'task_label',
  label: 'Task Label',
  pluralLabel: 'Task Labels',
  icon: 'tag',
  description: 'Junction table linking tasks to labels.',

  fields: {
    task: Field.masterDetail('task', {
      label: 'Task',
      required: true,
    }),
    label: Field.lookup('label', {
      label: 'Label',
      required: true,
    }),
  },

  enable: {
    apiEnabled: true,
  },

  indexes: [{ fields: ['task', 'label'], unique: true }],
});
