// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';
/**
 * Task — the unit of work. Status state machine, optional assignee, optional
 * labels (multi).
 *
 * Polymorphic platform features come for free:
 *   - sys_comment    (thread_id = "todo_task:{id}")
 *   - sys_attachment (parent_object = "todo_task", parent_id = "{id}")
 *   - sys_audit_log  (per-field via Field.trackHistory, plugin-audit / ADR-0052)
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

    assignee: Field.lookup('sys_user', {
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
    // `date` (not `datetime`): the throughput chart filters `completed_at >=
    // {12_weeks_ago}`, which only matches an ISO-date-string column — a datetime
    // epoch column never matches the analytics ISO-string date tokens. See AGENTS.md.
    completed_at: Field.date({ label: 'Completed At', readonly: true, group: 'planning' }),
    estimate_hours: Field.number({
      label: 'Estimate (hours)',
      scale: 2,
      min: 0,
      group: 'planning',
    }),

    // Derived flags
    is_overdue: Field.formula({
      label: 'Overdue?',
      group: 'meta',
      expression: F`record.due_date != null && record.due_date < today() && record.status != "done" && record.status != "cancelled"`,
    }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['assignee'] }, { fields: ['status'] }, { fields: ['due_date'] }],

  titleFormat: tmpl`{{record.subject}}`,
  compactLayout: ['subject', 'status', 'priority', 'assignee', 'due_date'],

  validations: [
    {
      type: 'state_machine',
      name: 'task_lifecycle',
      field: 'status',
      transitions: {
        todo: ['doing', 'cancelled'],
        doing: ['done', 'todo', 'cancelled'],
        done: ['todo'],
        cancelled: [],
      },
      message: 'Illegal status transition.',
    },
    {
      name: 'completed_at_when_done',
      type: 'script',
      severity: 'error',
      message: 'completed_at is set automatically when status becomes done.',
      condition: P`record.status != "done" && record.completed_at != null`,
    },
    {
      // Urgent work needs a deadline. (The `due_date_required_for_urgent`
      // message already shipped in translations; this is the missing rule.)
      name: 'due_date_required_for_urgent',
      type: 'script',
      severity: 'error',
      message: 'Urgent tasks must have a due date.',
      condition: P`record.priority == "urgent" && record.due_date == null && record.status != "done" && record.status != "cancelled"`,
    },
  ],

  // `started_at` / `completed_at` are stamped by `todo_task.hook.ts` on
  // status entry. Object-level `workflows` are not a supported 7.x field.
});
