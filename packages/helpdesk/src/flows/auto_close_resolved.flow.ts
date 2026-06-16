// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
type Flow = Automation.Flow;

/**
 * Auto-Close Resolved — closes any ticket that has been in `resolved` for 7+
 * days with no further customer reply.
 *
 * Why a SCHEDULED flow, not record-change (#1874): "has been resolved for 7
 * days" is time-relative. A record-change trigger only fires when the row is
 * mutated, so a resolved-and-forgotten ticket would never cross the boundary.
 * A daily schedule re-evaluates the population against `daysAgo(7)`.
 *
 * Idempotency is the status transition itself: the bulk update only matches
 * `status == 'resolved'`, and closing flips it to `closed`, so it cannot match
 * twice. No loop / no guard field needed.
 */
export const AutoCloseResolvedFlow: Flow = {
  name: 'helpdesk_auto_close_resolved',
  label: 'Auto-Close Long-Resolved Tickets',
  description: 'Close tickets that have been resolved for 7 days with no further customer reply.',
  type: 'schedule',

  variables: [],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start (Scheduled)',
      config: {
        schedule: 'cron:0 1 * * *', // Daily at 1am
      },
    },
    {
      id: 'close',
      type: 'update_record',
      label: 'Close Long-Resolved Tickets',
      config: {
        objectName: 'helpdesk_ticket',
        // Bulk update: every still-resolved ticket whose resolved_at is 7+ days
        // old. The status flip is the idempotency guard.
        filter: {
          status: 'resolved',
          resolved_at: { $lte: cel`daysAgo(7)` },
        },
        fields: { status: 'closed' },
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'close', type: 'default' },
    { id: 'e2', source: 'close', target: 'end', type: 'default' },
  ],
};
