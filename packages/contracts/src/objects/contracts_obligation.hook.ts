// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Obligation automation hook — stamps `completed_at` when an obligation is
 * marked done. (Previously a dead object-level `workflow`; `workflows` is not
 * a supported 7.x ObjectSchema field.)
 */
const obligationHook: Hook = {
  name: 'contracts_obligation_automation',
  object: 'contracts_obligation',
  events: ['beforeUpdate'],
  priority: 100,
  description: 'Stamp completed_at when an obligation is marked done.',
  handler: async (ctx: HookContext) => {
    const { input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };
    if (previous && input.status === 'done' && previous.status !== 'done') {
      input.completed_at = new Date().toISOString();
    }
  },
};

export default obligationHook;
export { obligationHook };
