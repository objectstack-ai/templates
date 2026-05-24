// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Evidence — default approved_by when status flips to approved; clear
 * stale approval on rejection.
 */
const evidenceHook: Hook = {
  name: 'compliance_evidence_automation',
  object: 'compliance_evidence',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Default approver + clear stale approvals.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous, user } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
      user?: { id?: string };
    };

    if (event === 'beforeInsert' && !input.status) {
      input.status = 'pending';
    }

    if (
      event === 'beforeUpdate' &&
      previous &&
      input.status === 'approved' &&
      previous.status === 'submitted' &&
      !input.approved_by
    ) {
      if (user?.id) input.approved_by = user.id;
    }

    if (
      event === 'beforeUpdate' &&
      previous &&
      input.status === 'rejected'
    ) {
      input.approved_by = null;
    }
  },
};

export default evidenceHook;
export { evidenceHook };
