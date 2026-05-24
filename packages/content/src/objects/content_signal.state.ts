// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Signal lifecycle — three states. Captured from competitor watching or
 * inbound trend monitoring, then triaged.
 *
 *   captured → promoted   (becomes a content_topic — flow handles the link)
 *           → ignored     (not interesting / off-strategy)
 *
 * Once promoted or ignored the row is terminal: re-triage by cloning a new
 * signal record (cheap; signals are high-N).
 */
export const SignalStateMachine: StateMachineConfig = {
  id: 'content_signal_lifecycle',
  initial: 'captured',
  states: {
    captured: {
      on: {
        PROMOTE: { target: 'promoted', description: 'Convert into a content_topic' },
        IGNORE: { target: 'ignored', description: 'Not worth chasing' },
      },
      meta: {
        aiInstructions:
          'New signal. Summarize and recommend whether to PROMOTE or IGNORE. Promotion creates a content_topic via the signal_to_topic_promotion flow.',
      },
    },
    promoted: {
      type: 'final',
      meta: {
        aiInstructions:
          'Already promoted to a topic. Terminal. Add follow-up signals as new captured rows.',
      },
    },
    ignored: {
      type: 'final',
      meta: {
        aiInstructions:
          'Reviewed and dropped. Terminal. Re-capture as a fresh signal if circumstances change.',
      },
    },
  },
};
