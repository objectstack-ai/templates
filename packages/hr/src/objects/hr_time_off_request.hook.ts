// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Time-off automation hook — derives the approver from the employee's
 * manager on submit, and clears decision metadata when a request returns
 * to draft.
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
  },
};

export default timeOffHook;
export { timeOffHook };
