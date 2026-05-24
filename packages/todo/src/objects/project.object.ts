// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P } from '@objectstack/spec';

/**
 * Project — container for tasks. Owned by one user, shared via a sharing rule.
 * Comments/attachments/activity ride on the platform `sys_*` polymorphic objects.
 */
export const Project = ObjectSchema.create({
  name: 'project',
  label: 'Project',
  pluralLabel: 'Projects',
  icon: 'folder-kanban',
  description: 'A container that groups related tasks.',

  fields: {
    name: Field.text({
      label: 'Project Name',
      required: true,
      searchable: true,
      maxLength: 120,
    }),
    key: Field.text({
      label: 'Key',
      description: 'Short uppercase identifier, e.g. "WEB" — used in task numbering.',
      maxLength: 8,
      unique: true,
      required: true,
    }),
    description: Field.markdown({ label: 'Description' }),
    status: Field.select({
      label: 'Status',
      required: true,
      options: [
        { label: 'Active', value: 'active', color: '#10B981', default: true },
        { label: 'On Hold', value: 'on_hold', color: '#F59E0B' },
        { label: 'Archived', value: 'archived', color: '#6B7280' },
      ],
    }),
    owner: Field.lookup('user', { label: 'Owner' }),
    start_date: Field.date({ label: 'Start Date' }),
    target_date: Field.date({ label: 'Target Date' }),
    color: Field.color({
      label: 'Accent Color',
      colorFormat: 'hex',
      presetColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    }),

    // Roll-up: total tasks in this project. (Per-status counts are derived
    // at query time via grouped task views — keeping rollups minimal here.)
    task_count: Field.summary({
      label: 'Tasks',
      summaryOperations: {
        object: 'task',
        field: 'id',
        function: 'count',
      },
    }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    files: true,
    feeds: true,
    activities: true,
    trash: true,
  },

  indexes: [{ fields: ['owner'] }, { fields: ['status'] }],

  validations: [
    {
      name: 'target_after_start',
      type: 'script',
      severity: 'error',
      message: 'Target date must be on or after the start date.',
      condition: P`record.start_date != null && record.target_date != null && record.target_date < record.start_date`,
    },
  ],
});
