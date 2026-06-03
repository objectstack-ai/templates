// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Obligation overdue — when an open obligation passes its due date, ping
 * the assignee. Same shape as todo's task-overdue flow; demonstrates the
 * polymorphic notification + email services.
 */
export const ObligationOverdueFlow: Flow = {
  name: 'contracts_obligation_overdue_notify',
  label: 'Notify Assignee When Obligation Overdue',
  description: 'Sends a notification and email when an open obligation passes its due date.',
  type: 'record_change',

  variables: [{ name: 'obligationId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'contracts_obligation',
        triggerType: 'record-after-update',
        condition: 'due_date != null && due_date < daysFromNow(0) && status == "open"',
      },
    },
    {
      id: 'get_obligation',
      type: 'get_record',
      label: 'Get Obligation',
      config: {
        objectName: 'contracts_obligation',
        filter: { id: '{record.id}' },
        outputVariable: 'obligationRecord',
      },
    },
    {
      id: 'notify',
      type: 'notify',
      label: 'Notify Assignee',
      config: {
        recipients: ['{obligationRecord.assignee}'],
        title: 'Obligation overdue: {obligationRecord.summary}',
        body: 'Obligation "{obligationRecord.summary}" on contract {obligationRecord.contract} is past its due date ({obligationRecord.due_date}).',
        actionUrl: '/objects/contracts_obligation/{obligationRecord.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_obligation', type: 'default' },
    { id: 'e2', source: 'get_obligation', target: 'notify', type: 'default' },
    { id: 'e3', source: 'notify', target: 'end', type: 'default' },
  ],
};
