// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';
import { TaskStateMachine } from './todo_task.state';

/**
 * Task — the unit of work. Status state machine, optional assignee, optional
 * labels (multi). Urgent tasks trigger the approval process.
 *
 * Polymorphic platform features come for free:
 *   - sys_comment    (thread_id = "todo_task:{id}")
 *   - sys_attachment (parent_object = "todo_task", parent_id = "{id}")
 *   - sys_activity / sys_audit_log (auto when enable.feeds/trackHistory = true)
 */
export const Task = ObjectSchema.create({
  name: 'todo_task',
  label: 'Task',
  pluralLabel: 'Tasks',
  icon: 'check-square',
  description: 'A single unit of work.',

  fieldGroups: [
    { key: 'core', label: 'Task', icon: 'check-square' },
    { key: 'planning', label: 'Planning', icon: 'calendar' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    subject: Field.text({
      label: 'Subject',
      required: true,
      searchable: true,
      maxLength: 200,
      group: 'core',
    }),

    description: Field.markdown({
      label: 'Description',
      group: 'core',
    }),

    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'To Do', value: 'todo', color: '#94A3B8', default: true },
        { label: 'Doing', value: 'doing', color: '#3B82F6' },
        { label: 'Done', value: 'done', color: '#10B981' },
        { label: 'Cancelled', value: 'cancelled', color: '#6B7280' },
      ],
    }),

    priority: Field.select({
      label: 'Priority',
      required: true,
      group: 'core',
      options: [
        { label: 'Low', value: 'low', color: '#60A5FA' },
        { label: 'Normal', value: 'normal', color: '#10B981', default: true },
        { label: 'High', value: 'high', color: '#F59E0B' },
        { label: 'Urgent', value: 'urgent', color: '#EF4444' },
      ],
    }),

    assignee: Field.lookup('user', {
      label: 'Assignee',
      group: 'core',
    }),

    labels: Field.lookup('todo_label', {
      label: 'Labels',
      group: 'core',
      multiple: true,
    }),

    // Planning
    due_date: Field.date({ label: 'Due Date', group: 'planning' }),
    started_at: Field.datetime({ label: 'Started At', readonly: true, group: 'planning' }),
    completed_at: Field.datetime({ label: 'Completed At', readonly: true, group: 'planning' }),
    estimate_hours: Field.number({
      label: 'Estimate (hours)',
      scale: 2,
      min: 0,
      group: 'planning',
    }),

    // Approval mirror (written by the approval process — see approvals/)
    approval_status: Field.select({
      label: 'Approval Status',
      group: 'meta',
      readonly: true,
      options: [
        { label: 'Not Required', value: 'not_required', default: true },
        { label: 'Pending', value: 'pending', color: '#F59E0B' },
        { label: 'Approved', value: 'approved', color: '#10B981' },
        { label: 'Rejected', value: 'rejected', color: '#EF4444' },
      ],
    }),

    // Derived flags
    is_overdue: Field.formula({
      label: 'Overdue?',
      group: 'meta',
      expression: F`record.due_date != null && record.due_date < today() && record.status != "done" && record.status != "cancelled"`,
    }),
  },

  stateMachines: {
    lifecycle: TaskStateMachine,
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    files: true,
    feeds: true,
    activities: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['assignee'] },
    { fields: ['status'] },
    { fields: ['due_date'] },
  ],

  titleFormat: tmpl`{{record.subject}}`,
  compactLayout: ['subject', 'status', 'priority', 'assignee', 'due_date'],

  validations: [
    {
      name: 'completed_at_when_done',
      type: 'script',
      severity: 'error',
      message: 'completed_at is set automatically when status becomes done.',
      condition: P`record.status != "done" && record.completed_at != null`,
    },
  ],

  workflows: [
    {
      name: 'stamp_started_at',
      objectName: 'todo_task',
      triggerType: 'on_update',
      criteria: P`record.status == "doing" && previous.status != "doing" && record.started_at == null`,
      active: true,
      actions: [
        { name: 'set_started_at', type: 'field_update', field: 'started_at', value: 'now()' },
      ],
    },
    {
      name: 'stamp_completed_at',
      objectName: 'todo_task',
      triggerType: 'on_update',
      criteria: P`record.status == "done" && previous.status != "done"`,
      active: true,
      actions: [
        { name: 'set_completed_at', type: 'field_update', field: 'completed_at', value: 'now()' },
      ],
    },
  ],
});
