// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Contract lifecycle:
 *   draft       → in_review        (submit for internal approval)
 *   in_review   → signed           (counterparty signed, PDF attached)
 *   in_review   → draft            (kicked back during approval)
 *   signed      → active           (effective date reached; usually auto via flow)
 *   active      → expired          (auto when end_date < today)
 *   active      → terminated       (early termination)
 *   any open    → cancelled        (never signed; killed in negotiation)
 *
 * AI agents reading this: never jump straight from draft to active.
 * Approvals enforce the in_review step.
 */
export const ContractStateMachine: StateMachineConfig = {
  id: 'contract_lifecycle',
  initial: 'draft',
  states: {
    draft: {
      on: {
        SUBMIT: { target: 'in_review', description: 'Submit for internal approval' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Contract metadata is still being entered or extracted. Confirm party, amount, dates, and contract_type are populated before SUBMIT.',
      },
    },
    in_review: {
      on: {
        SIGN: { target: 'signed', description: 'Counterparty signed and PDF attached' },
        REJECT: { target: 'draft', description: 'Kicked back by approver — fix issues then resubmit' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Awaiting internal approval. Do not transition automatically. Wait for the approval workflow to dispatch SIGN or REJECT.',
      },
    },
    signed: {
      on: {
        ACTIVATE: { target: 'active', description: 'Effective date reached' },
        TERMINATE: { target: 'terminated', description: 'Terminated before effective date' },
      },
      meta: {
        aiInstructions:
          'Fully executed but not yet in force. ACTIVATE fires automatically on the effective date.',
      },
    },
    active: {
      on: {
        EXPIRE: { target: 'expired', description: 'End date reached without renewal' },
        TERMINATE: { target: 'terminated', description: 'Early termination by either party' },
        RENEW: { target: 'active', description: 'Renewed — rolls dates forward, stays active' },
      },
      meta: {
        aiInstructions:
          'Currently in force. RENEW updates dates in place; do not create a new contract for routine auto-renewals.',
      },
    },
    expired: {
      type: 'final',
      meta: {
        aiInstructions:
          'Reached end_date without renewal. Terminal. Create a new contract record to re-engage the party.',
      },
    },
    terminated: {
      type: 'final',
      meta: {
        aiInstructions: 'Ended early. Terminal. Record termination reason in notes.',
      },
    },
    cancelled: {
      type: 'final',
      meta: {
        aiInstructions: 'Never signed. Terminal. Do not edit further.',
      },
    },
  },
};
