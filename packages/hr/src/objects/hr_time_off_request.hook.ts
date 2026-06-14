// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Time-off automation hook — stamps lifecycle timestamps and clears decision
 * metadata when a request returns to draft. The approver is routed to the
 * employee's manager by `time_off_submitted.flow.ts` (which already resolves
 * the manager to notify), not here — a hook can't do that cross-object read
 * safely in the standalone sandbox.
 */
const timeOffHook: Hook = {
  name: 'hr_time_off_automation',
  object: 'hr_time_off_request',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Normalize time-off request fields and route to the right approver.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    if (event === 'beforeInsert' && !input.status) {
      input.status = 'draft';
    }

    // Clear decision metadata when a request is kicked back to draft.
    if (
      event === 'beforeUpdate' &&
      previous &&
      input.status === 'draft' &&
      previous.status !== 'draft'
    ) {
      input.approver = null;
      input.decided_at = null;
      input.decision_note = null;
    }

    // Stamp lifecycle timestamps on status entry. (Previously dead object
    // `workflows`; `workflows` is not a supported 7.x ObjectSchema field.)
    if (event === 'beforeUpdate' && previous) {
      const now = new Date().toISOString();
      if (input.status === 'submitted' && previous.status !== 'submitted') {
        input.submitted_at = now;
      }
      if (
        (input.status === 'approved' || input.status === 'rejected') &&
        previous.status === 'submitted'
      ) {
        input.decided_at = now;
      }
    }
  },
};

export default timeOffHook;
export { timeOffHook };
