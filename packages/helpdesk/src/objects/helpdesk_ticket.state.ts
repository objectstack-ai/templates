// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Helpdesk Ticket lifecycle:
 *   new          → triaged          (TRIAGE — usually fired by ai_triage flow)
 *   triaged      → in_progress      (PICK_UP — agent starts working)
 *   in_progress  → waiting_customer (AWAIT_CUSTOMER — pending reply from requester)
 *   waiting_customer → in_progress  (CUSTOMER_REPLIED)
 *   in_progress  → resolved         (RESOLVE)
 *   resolved     → closed           (CLOSE — usually after grace period, see auto_close flow)
 *   resolved     → in_progress      (REOPEN — customer says it's not fixed)
 *   any active   → escalated        (ESCALATE — angry sentiment / SLA breach)
 *   escalated    → in_progress      (DE_ESCALATE)
 */
export const TicketStateMachine: StateMachineConfig = {
  id: 'ticket_lifecycle',
  initial: 'new',
  states: {
    new: {
      on: {
        TRIAGE: { target: 'triaged' },
        ESCALATE: { target: 'escalated' },
      },
    },
    triaged: {
      on: {
        PICK_UP: { target: 'in_progress' },
        ESCALATE: { target: 'escalated' },
      },
    },
    in_progress: {
      on: {
        AWAIT_CUSTOMER: { target: 'waiting_customer' },
        RESOLVE: { target: 'resolved' },
        ESCALATE: { target: 'escalated' },
      },
    },
    waiting_customer: {
      on: {
        CUSTOMER_REPLIED: { target: 'in_progress' },
        RESOLVE: { target: 'resolved', description: 'Resolve without waiting further' },
        ESCALATE: { target: 'escalated' },
      },
    },
    resolved: {
      on: {
        CLOSE: { target: 'closed' },
        REOPEN: { target: 'in_progress', description: 'Customer says issue persists' },
      },
    },
    escalated: {
      on: {
        DE_ESCALATE: { target: 'in_progress' },
        RESOLVE: { target: 'resolved' },
      },
    },
    closed: { type: 'final' },
  },
};
