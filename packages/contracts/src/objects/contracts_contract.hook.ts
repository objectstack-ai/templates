// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Contract automation hook — normalize fields on save. Keeps free-form
 * fields consistent with the state machine and seeds defaults the formula
 * + workflow layer can't.
 */
const contractHook: Hook = {
  name: 'contracts_contract_automation',
  object: 'contracts_contract',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Normalize contract fields on save.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    // Default status on insert
    if (event === 'beforeInsert' && !input.status) {
      input.status = 'draft';
    }

    // When kicked back from in_review to draft, clear stale signed_date.
    if (
      event === 'beforeUpdate' &&
      previous &&
      input.status === 'draft' &&
      previous.status === 'in_review'
    ) {
      input.signed_date = null;
    }

    // Auto-renew sanity: zero notice days are nonsensical; default 30.
    if (input.auto_renew === true && input.renewal_notice_days == null) {
      input.renewal_notice_days = 30;
    }
  },
};

export default contractHook;
export { contractHook };
