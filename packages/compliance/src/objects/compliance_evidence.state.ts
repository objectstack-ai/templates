// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Evidence lifecycle:
 *   pending   → submitted    (SUBMIT — proof uploaded)
 *   submitted → approved     (APPROVE — reviewer accepted)
 *   submitted → rejected     (REJECT — needs rework)
 *   approved  → expired      (EXPIRE — auto when expires_on < today)
 *   rejected  → pending      (RESET — try again)
 *   expired   → pending      (REFRESH — new collection cycle)
 *
 * "expired" is not terminal — a fresh evidence collection cycle resets it.
 */
export const EvidenceStateMachine: StateMachineConfig = {
  id: 'evidence_lifecycle',
  initial: 'pending',
  states: {
    pending:   { on: { SUBMIT: { target: 'submitted', description: 'Upload proof' } } },
    submitted: {
      on: {
        APPROVE: { target: 'approved' },
        REJECT:  { target: 'rejected', description: 'Reviewer rejected — needs rework' },
      },
    },
    approved: {
      on: {
        EXPIRE:  { target: 'expired', description: 'expires_on reached' },
      },
    },
    rejected: { on: { RESET:   { target: 'pending' } } },
    expired:  { on: { REFRESH: { target: 'pending', description: 'Begin new collection cycle' } } },
  },
};
