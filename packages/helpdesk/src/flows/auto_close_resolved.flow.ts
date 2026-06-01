// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Auto-Close Resolved — if a ticket has been in `resolved` for 7 days without
 * customer reply, close it. Scheduler re-evaluates daily.
 *
 * The `daysAgo(7)` CEL helper is supported; we compare resolved_at (a
 * datetime) to today minus 7 days. If the underlying CEL doesn't accept
 * datetime-vs-date comparison, replace with a date-cast helper in your fork.
 */
export const AutoCloseResolvedFlow: Flow = {
  name: 'helpdesk_auto_close_resolved',
  label: 'Auto-Close Long-Resolved Tickets',
  description: 'Close tickets that have been resolved for 7 days with no further customer reply.',
  type: 'record_change',

  variables: [{ name: 'ticketId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'helpdesk_ticket',
        criteria: 'status == "resolved" && resolved_at != null && resolved_at <= daysAgo(7)',
        criteriaDialect: 'cel',
      },
    },
    {
      id: 'close',
      type: 'update_record',
      label: 'Mark Closed',
      config: {
        objectName: 'helpdesk_ticket',
        recordId: '{ticketId}',
        values: { status: 'closed' },
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'close', type: 'default' },
    { id: 'e2', source: 'close', target: 'end', type: 'default' },
  ],
};
