// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Escalate Angry Customer — when AI detects ai_sentiment == "angry" on a
 * high or urgent ticket, escalate to the team manager immediately.
 * Fires on update (sentiment may be detected post-create when a new
 * inbound message arrives).
 */
export const EscalateAngryCustomerFlow: Flow = {
  name: 'helpdesk_escalate_angry_customer',
  label: 'Escalate When Customer is Angry',
  description: 'On angry sentiment + high/urgent priority, escalate to team manager.',
  type: 'record_change',

  variables: [{ name: 'ticketId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'helpdesk_ticket',
        criteria:
          'ai_sentiment == "angry" && (priority == "high" || priority == "urgent") && status != "escalated" && status != "closed"',
        criteriaDialect: 'cel',
      },
    },
    {
      id: 'get_ticket',
      type: 'get_record',
      label: 'Load Ticket',
      config: {
        objectName: 'helpdesk_ticket',
        filter: { id: '{ticketId}' },
        outputVariable: 'ticket',
      },
    },
    {
      id: 'escalate',
      type: 'update_record',
      label: 'Mark Escalated',
      config: {
        objectName: 'helpdesk_ticket',
        recordId: '{ticketId}',
        values: { status: 'escalated' },
      },
    },
    {
      id: 'notify_manager',
      type: 'notify',
      label: 'Notify Team Manager',
      config: {
        recipients: ['{ticket.team.manager}'],
        title: 'Angry customer: {ticket.ticket_number}',
        body: 'AI detected angry sentiment on {priority} ticket "{ticket.name}" from {ticket.customer}. Intervene now.',
        actionUrl: '/objects/helpdesk_ticket/{ticket.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_ticket', type: 'default' },
    { id: 'e2', source: 'get_ticket', target: 'escalate', type: 'default' },
    { id: 'e3', source: 'escalate', target: 'notify_manager', type: 'default' },
    { id: 'e4', source: 'notify_manager', target: 'end', type: 'default' },
  ],
};
