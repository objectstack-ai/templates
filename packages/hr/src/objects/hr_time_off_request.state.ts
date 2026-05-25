// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Time-Off Request lifecycle:
 *   draft     → submitted   (SUBMIT — request goes to manager)
 *   submitted → approved    (APPROVE — manager signs off)
 *   submitted → rejected    (REJECT — manager declines)
 *   submitted → draft       (KICKBACK — send back for edits)
 *   approved  → cancelled   (CANCEL  — employee cancels approved leave)
 *   draft     → cancelled   (CANCEL  — employee abandons draft)
 *   rejected  → draft       (REOPEN  — try again)
 */
export const TimeOffRequestStateMachine: StateMachineConfig = {
  id: 'time_off_lifecycle',
  initial: 'draft',
  states: {
    draft: {
      on: {
        SUBMIT: { target: 'submitted', description: 'Send to manager for approval' },
        CANCEL: { target: 'cancelled' },
      },
    },
    submitted: {
      on: {
        APPROVE: { target: 'approved' },
        REJECT: { target: 'rejected' },
        KICKBACK: { target: 'draft', description: 'Return to requester for edits' },
      },
      meta: {
        aiInstructions:
          'Awaiting manager decision. Do not auto-advance; wait for an explicit APPROVE / REJECT / KICKBACK.',
      },
    },
    approved: {
      on: {
        CANCEL: { target: 'cancelled', description: 'Employee cancels approved leave' },
      },
    },
    rejected: {
      on: { REOPEN: { target: 'draft' } },
    },
    cancelled: {
      type: 'final',
    },
  },
};
