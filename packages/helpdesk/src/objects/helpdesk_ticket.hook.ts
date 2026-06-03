// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Ticket automation hook — stamps `resolved_at` when a ticket reaches the
 * resolved status without one. (Previously a dead object-level `workflow`;
 * `workflows` is not a supported 7.x ObjectSchema field.)
 */
const ticketHook: Hook = {
  name: 'helpdesk_ticket_automation',
  object: 'helpdesk_ticket',
  events: ['beforeUpdate'],
  priority: 100,
  description: 'Stamp resolved_at when a ticket is resolved.',
  handler: async (ctx: HookContext) => {
    const { input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };
    if (!previous) return;
    const status = (input.status ?? previous.status) as string;
    const resolvedAt = input.resolved_at ?? previous.resolved_at;
    if (status === 'resolved' && resolvedAt == null) {
      input.resolved_at = new Date().toISOString();
    }
  },
};

export default ticketHook;
export { ticketHook };
