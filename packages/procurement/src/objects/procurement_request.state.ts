// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Purchase-Request lifecycle:
 *   draft       → submitted   (SUBMIT — kick off approval)
 *   submitted   → approved    (APPROVE — finance signs off)
 *   submitted   → rejected    (REJECT — denied)
 *   submitted   → draft       (KICKBACK — send back for edits)
 *   approved    → converted   (CONVERT — PO drafted)
 *   rejected    → draft       (REOPEN — try again)
 *
 * "converted" is terminal: a PO has been spawned. Edits should now
 * happen against the PO.
 */
export const PurchaseRequestStateMachine: StateMachineConfig = {
  id: 'pr_lifecycle',
  initial: 'draft',
  states: {
    draft:     { on: { SUBMIT: { target: 'submitted', description: 'Submit for approval' } } },
    submitted: {
      on: {
        APPROVE:  { target: 'approved' },
        REJECT:   { target: 'rejected' },
        KICKBACK: { target: 'draft', description: 'Send back for edits' },
      },
      meta: {
        aiInstructions:
          'Awaiting approval. Do not transition automatically; wait for the approval workflow.',
      },
    },
    approved:  { on: { CONVERT: { target: 'converted', description: 'Convert to PO' } } },
    rejected:  { on: { REOPEN:  { target: 'draft' } } },
    converted: {
      type: 'final',
      meta: { aiInstructions: 'PO created. Terminal. Edit the PO from here.' },
    },
  },
};
