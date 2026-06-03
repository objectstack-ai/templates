// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Overdue notification — fires when a task crosses its due date while still
 * open. Sends an in-app notification + email to the assignee via the
 * platform's notification/email services (no per-app email infra).
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
        condition: "record.due_date < today() && record.status in ['todo', 'doing']",
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
