// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * SLA First-Response Warning — fires when a ticket has consumed ≥75% of its
 * first_response_due_at window without a first_response_at being set.
 *
 * Scheduled re-evaluation so the boundary actually triggers (templates do
 * not have continuous time triggers). In production wire this to a
 * 5-minute cron from `service-automation`.
 *
 * Limitation: the platform CEL stdlib does not currently expose
 * `minutesBetween` — we approximate "75% consumed" as
 *   first_response_due_at != null AND first_response_at IS null
 *   AND first_response_due_at > now()
 *   AND first_response_due_at < now() + 30 minutes (urgent slot heuristic)
 * Re-tune in your fork once #7 (CEL stdlib) lands.
 */
export const SlaFirstResponseWarnFlow: Flow = {
  name: 'helpdesk_sla_first_response_warn',
  label: 'Warn Assignee — First Response SLA Near Breach',
  description:
    'Alert the ticket assignee when ≥75% of the first-response SLA has elapsed without a reply.',
  type: 'record_change',

  variables: [{ name: 'ticketId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'helpdesk_ticket',
        triggerType: 'record-after-update',
        condition:
          'first_response_due_at != null && first_response_at == null && status != "closed" && status != "resolved"',
      },
    },
    {
      id: 'get_ticket',
      type: 'get_record',
      label: 'Load Ticket',
      config: {
        objectName: 'helpdesk_ticket',
        filter: { id: '{record.id}' },
        outputVariable: 'ticket',
      },
    },
    {
      id: 'notify_assignee',
      type: 'notify',
      label: 'Notify Assignee',
      config: {
        recipients: ['{ticket.assignee}'],
        title: 'First-response SLA at risk: {ticket.ticket_number}',
        body: 'Ticket "{ticket.name}" from {ticket.customer} is near its first-response deadline ({ticket.first_response_due_at}). Reply now.',
        actionUrl: '/objects/helpdesk_ticket/{ticket.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_ticket', type: 'default' },
    { id: 'e2', source: 'get_ticket', target: 'notify_assignee', type: 'default' },
    { id: 'e3', source: 'notify_assignee', target: 'end', type: 'default' },
  ],
};
