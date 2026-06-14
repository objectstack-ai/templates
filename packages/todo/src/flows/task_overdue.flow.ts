// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Overdue notification — fires when a task *enters* the overdue-and-open state
 * (a past due date is set, or an overdue task is reopened to todo/doing). The
 * `previous.*` delta guard makes it fire ONCE on that transition instead of on
 * every subsequent edit of an already-overdue task — otherwise any field change
 * re-spams the assignee.
 *
 * Limitation: a task that crosses its due date purely by time passing produces
 * no update event, so this event-driven flow won't catch it. For unattended
 * "it's now overdue" detection, fork this into a scheduled flow that scans open
 * past-due tasks daily. Sends an in-app notification + email via the platform's
 * notification/email services (no per-app email infra).
 */
export const TaskOverdueFlow: Flow = {
  name: 'todo_task_overdue_notify',
  label: 'Notify Assignee When Task Overdue',
  description: 'Sends a notification and email when an open task passes its due date.',
  type: 'record_change',

  variables: [{ name: 'taskId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'todo_task',
        triggerType: 'record-after-update',
        // Fire only on the transition INTO overdue-and-open (delta guard),
        // not on every edit of an already-overdue task.
        condition:
          "record.due_date != null && record.due_date < today() && record.status in ['todo', 'doing'] && (previous.due_date == null || previous.due_date >= today() || !(previous.status in ['todo', 'doing']))",
      },
    },
    {
      id: 'get_task',
      type: 'get_record',
      label: 'Get Task',
      config: {
        objectName: 'todo_task',
        filter: { id: '{record.id}' },
        outputVariable: 'taskRecord',
      },
    },
    {
      id: 'notify',
      type: 'notify',
      label: 'Notify Assignee',
      config: {
        recipients: ['{taskRecord.assignee}'],
        title: 'Task overdue: {taskRecord.subject}',
        body: 'Task "{taskRecord.subject}" is past its due date ({taskRecord.due_date}).',
        actionUrl: '/objects/todo_task/{taskRecord.id}',
      },
    },
    {
      id: 'email',
      type: 'notify',
      label: 'Email Assignee',
      config: {
        channels: ['email'],
        recipients: ['{taskRecord.assignee.email}'],
        title: 'Overdue task: {taskRecord.subject}',
        body: 'Your task "{taskRecord.subject}" was due {taskRecord.due_date} and is still open.',
        actionUrl: '/objects/todo_task/{taskRecord.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_task', type: 'default' },
    { id: 'e2', source: 'get_task', target: 'notify', type: 'default' },
    { id: 'e3', source: 'notify', target: 'email', type: 'default' },
    { id: 'e4', source: 'email', target: 'end', type: 'default' },
  ],
};
