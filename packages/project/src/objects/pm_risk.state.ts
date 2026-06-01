// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Risk status state machine.
 * Lifecycle: identified → assessing → mitigating → monitoring → closed/realized
 */
export const RiskStateMachine: StateMachineConfig = {
  id: 'risk_lifecycle',
  initial: 'identified',
  states: {
    identified: {
      on: {
        ASSESS: { target: 'assessing', description: 'Begin impact / likelihood assessment.' },
        CLOSE: { target: 'closed', description: 'Not relevant — close it out.' },
      },
      meta: {
        aiInstructions:
          'Risk has been logged. Score impact and likelihood before moving to assessing.',
      },
    },
    assessing: {
      on: {
        MITIGATE: { target: 'mitigating', description: 'Begin mitigation work.' },
        MONITOR: { target: 'monitoring', description: 'Accept and watch for triggers.' },
        CLOSE: { target: 'closed', description: 'Close the risk.' },
      },
      meta: {
        aiInstructions:
          'Risk is being assessed. Recommend mitigate vs. accept-and-monitor based on score.',
      },
    },
    mitigating: {
      on: {
        MITIGATED: { target: 'monitoring', description: 'Mitigation complete — monitor residual.' },
        REALIZE: { target: 'realized', description: 'Risk has occurred.' },
      },
      meta: {
        aiInstructions: 'Mitigation in progress. Track owner and due date on mitigation actions.',
      },
    },
    monitoring: {
      on: {
        REACTIVATE: { target: 'mitigating', description: 'Triggers re-emerged — re-mitigate.' },
        CLOSE: { target: 'closed', description: 'Residual risk acceptable — close.' },
        REALIZE: { target: 'realized', description: 'Risk has occurred.' },
      },
      meta: {
        aiInstructions: 'Mitigation in place. Watch for trigger conditions; close when stable.',
      },
    },
    closed: {
      type: 'final',
      meta: {
        aiInstructions: 'Risk closed and terminal. Do not change status.',
      },
    },
    realized: {
      type: 'final',
      meta: {
        aiInstructions: 'Risk realized and terminal — track follow-up as an issue.',
      },
    },
  },
};
