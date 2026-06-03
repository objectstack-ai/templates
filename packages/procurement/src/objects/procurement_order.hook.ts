// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Order automation hook — auto-advances an order to "received" once the
 * received amount covers the total. (Previously a dead object-level
 * `workflow`; `workflows` is not a supported 7.x ObjectSchema field. The
 * sent→received / partial→received transitions are both legal in the
 * order state machine.)
 */
const orderHook: Hook = {
  name: 'procurement_order_automation',
  object: 'procurement_order',
  events: ['beforeUpdate'],
  priority: 100,
  description: 'Auto-mark an order received once fully received.',
  handler: async (ctx: HookContext) => {
    const { input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };
    if (!previous) return;
    const received = (input.received_amount ?? previous.received_amount) as number | null;
    const total = (input.total_amount ?? previous.total_amount) as number | null;
    const status = (input.status ?? previous.status) as string;
    if (
      received != null &&
      total != null &&
      received >= total &&
      (status === 'sent' || status === 'partial')
    ) {
      input.status = 'received';
    }
  },
};

export default orderHook;
export { orderHook };
