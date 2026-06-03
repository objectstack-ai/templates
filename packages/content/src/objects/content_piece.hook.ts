// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Piece automation hook — normalises status defaults, stamps lifecycle
 * timestamps on FORWARD status entry, and clears stale stamps when a piece
 * is sent backwards through the workflow.
 *
 * NOTE: the forward stamping previously lived in object-level `workflows`,
 * but `workflows` is not a field on the 7.x `ObjectSchema` — it was silently
 * dropped at build and never ran. The logic lives here now.
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

    if (event === 'beforeInsert' && !input.assignee) {
      const session = (ctx as HookContext & { session?: { userId?: string } }).session;
      if (session?.userId) input.assignee = session.userId;
    }

    if (event === 'beforeUpdate' && previous) {
      // Stamp lifecycle timestamps on FORWARD status entry.
      const now = new Date().toISOString();
      const enters = (s: string) => input.status === s && previous.status !== s;
      if (enters('in_review')) input.submitted_at = now;
      if (enters('approved')) input.approved_at = now;
      if (enters('published') && (input.published_at ?? previous.published_at) == null) {
        input.published_at = now;
      }
      if (enters('archived')) input.archived_at = now;

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
 * Signal hook — stamps captured_at on insert and promoted_at when the signal
 * is promoted. (The promoted_at stamp previously lived in dead object
 * `workflows`; see the note on the piece hook above.)
 */
const signalHook: Hook = {
  name: 'content_signal_automation',
  object: 'content_signal',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Stamp captured_at on signal insert and promoted_at on promotion.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };
    if (event === 'beforeInsert' && !input.captured_at) {
      input.captured_at = new Date().toISOString();
    }
    if (event === 'beforeInsert' && !input.status) {
      input.status = 'captured';
    }
    if (
      event === 'beforeUpdate' &&
      previous &&
      input.status === 'promoted' &&
      previous.status !== 'promoted'
    ) {
      input.promoted_at = new Date().toISOString();
    }
  },
};

export default pieceHook;
export { pieceHook, signalHook };
