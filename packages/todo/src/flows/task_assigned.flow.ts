// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Welcome-the-assignee — on assignment change, ping the new assignee.
 * Exercises a `record_change` flow that reads `previous.*` to detect deltas.
 */
export const TaskAssignedFlow: Flow = {
  name: 'todo_task_assigned_notify',
  label: 'Notify New Assignee',
  description: 'Notifies a user when a task is freshly assigned to them.',
  type: 'record_change',

  variables: [{ name: 'taskId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'todo_task',
        criteria: 'assignee != NULL AND assignee != PRIOR(assignee)',
      },
    },
    {
      id: 'get_task',
      type: 'get_record',
      label: 'Get Task',
      config: {
        objectName: 'todo_task',
        filter: { id: '{taskId}' },
        outputVariable: 'taskRecord',
      },
    },
    {
      id: 'notify',
      type: 'script',
      label: 'Notify Assignee',
      config: {
        actionType: 'notification',
        recipients: ['{taskRecord.assignee}'],
        title: 'New task assigned: {taskRecord.subject}',
        body: 'You have a new task assigned to you.',
        link: '/objects/todo_task/{taskRecord.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_task', type: 'default' },
    { id: 'e2', source: 'get_task', target: 'notify', type: 'default' },
    { id: 'e3', source: 'notify', target: 'end', type: 'default' },
  ],
};
