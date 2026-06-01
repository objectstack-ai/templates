// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * SLA Resolution Breach — escalates a ticket whose resolution_due_at has
 * passed without a resolved_at. Notifies team manager + sets status to
 * escalated.
 */
export const SlaResolutionBreachFlow: Flow = {
  name: 'helpdesk_sla_resolution_breach',
  label: 'Escalate — Resolution SLA Breached',
  description:
    'When a ticket misses its resolution deadline, notify the team manager and escalate.',
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
          'resolution_due_at != null && resolved_at == null && resolution_due_at < now() && status != "closed" && status != "escalated"',
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
      id: 'set_escalated',
      type: 'update_record',
      label: 'Mark Escalated',
      config: {
        objectName: 'helpdesk_ticket',
        recordId: '{ticketId}',
        values: { status: 'escalated', priority: 'urgent' },
      },
    },
    {
      id: 'notify_manager',
      type: 'notify',
      label: 'Notify Team Manager',
      config: {
        recipients: ['{ticket.team.manager}'],
        title: 'SLA breached: {ticket.ticket_number}',
        body: 'Ticket "{ticket.name}" missed its resolution SLA ({ticket.resolution_due_at}). Auto-escalated.',
        actionUrl: '/objects/helpdesk_ticket/{ticket.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_ticket', type: 'default' },
    { id: 'e2', source: 'get_ticket', target: 'set_escalated', type: 'default' },
    { id: 'e3', source: 'set_escalated', target: 'notify_manager', type: 'default' },
    { id: 'e4', source: 'notify_manager', target: 'end', type: 'default' },
  ],
};
