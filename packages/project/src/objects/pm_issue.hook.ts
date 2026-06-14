// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Issue automation hook — auto-number + lifecycle timestamps (payload-only).
 *
 * - beforeInsert: assign `issue_number` (ISS-NNNN) and stamp `reported_at`.
 * - beforeUpdate: stamp `resolved_at` when the issue moves to resolved/closed;
 *   clear it when the issue is reopened.
 *
 * Payload-only mutation — no nested writes (see pm_project.hook.ts).
 */
const issueHook: Hook = {
  name: 'pm_issue_automation',
  object: 'pm_issue',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Assign issue number and stamp reported/resolved timestamps.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    if (event === 'beforeInsert') {
      if (!input.issue_number) {
        input.issue_number = `ISS-${Math.floor(Math.random() * 9000 + 1000)}`;
      }
      if (input.reported_at == null) input.reported_at = new Date().toISOString();
      return;
    }

    if (!previous) return;
    const prevStatus = previous.status as string | undefined;
    const nextStatus = input.status as string | undefined;
    if (!nextStatus || nextStatus === prevStatus) return;

    const isClosed = nextStatus === 'resolved' || nextStatus === 'closed';
    const wasClosed = prevStatus === 'resolved' || prevStatus === 'closed';
    if (isClosed && input.resolved_at == null) {
      input.resolved_at = new Date().toISOString();
    } else if (!isClosed && wasClosed) {
      input.resolved_at = null;
    }
  },
};

export default issueHook;
export { issueHook };
