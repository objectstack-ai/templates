// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Piece automation hook — normalises status defaults and clears stale
 * lifecycle stamps when a piece is sent backwards through the workflow.
 * Anything time-stamping FORWARD is handled by declarative `workflows`
 * on the object itself.
 */
const pieceHook: Hook = {
  name: 'content_piece_automation',
  object: 'content_piece',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Normalise content_piece status defaults and clear stamps on rewind.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    if (event === 'beforeInsert' && !input.status) {
      input.status = 'backlog';
    }

    if (event === 'beforeUpdate' && previous) {
      // Sending in_review back to drafting → wipe submitted_at so a re-submit
      // gets a fresh timestamp.
      if (input.status === 'drafting' && previous.status === 'in_review') {
        input.submitted_at = null;
      }
      // Pulling off the schedule → wipe approved_at/published_at if regression
      // crossed back into drafting (REQUEST_CHANGES from approved).
      if (input.status === 'drafting' && previous.status === 'approved') {
        input.approved_at = null;
      }
      // Unscheduling: keep approved_at, drop publish_at-rooted state. Nothing
      // to clear yet (publish_at is user-managed), so no-op.
    }
  },
};

/**
 * Signal hook — stamps captured_at on insert. Cheaper than a workflow:
 * insert-time stamps don't fit the `triggerType: 'on_update'` shape.
 */
const signalHook: Hook = {
  name: 'content_signal_automation',
  object: 'content_signal',
  events: ['beforeInsert'],
  priority: 100,
  description: 'Stamp captured_at on signal insert.',
  handler: async (ctx: HookContext) => {
    const { input } = ctx as HookContext & {
      input: Record<string, unknown>;
    };
    if (!input.captured_at) {
      input.captured_at = new Date().toISOString();
    }
    if (!input.status) {
      input.status = 'captured';
    }
  },
};

export default pieceHook;
export { pieceHook, signalHook };
