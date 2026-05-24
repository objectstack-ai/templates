// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Purchase-Request automation hook — defaults + state-transition cleanup.
 */
const requestHook: Hook = {
  name: 'procurement_request_automation',
  object: 'procurement_request',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Normalize PR fields on save.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    if (event === 'beforeInsert') {
      if (!input.status) input.status = 'draft';
      // Auto-generate a PR number if missing. Format: PR-YYYYMMDD-XXXX
      if (!input.request_number) {
        const ts = new Date();
        const date = `${ts.getUTCFullYear()}${String(ts.getUTCMonth() + 1).padStart(2, '0')}${String(
          ts.getUTCDate(),
        ).padStart(2, '0')}`;
        const rand = Math.floor(Math.random() * 9000 + 1000);
        input.request_number = `PR-${date}-${rand}`;
      }
    }

    // When a rejected PR is re-opened, clear the converted_po link defensively.
    if (
      event === 'beforeUpdate' &&
      previous &&
      input.status === 'draft' &&
      previous.status === 'rejected'
    ) {
      input.converted_po = null;
    }
  },
};

export default requestHook;
export { requestHook };
