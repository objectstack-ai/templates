// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Content piece lifecycle — eight states from idea to archive.
 *
 *   backlog → drafting → in_review → approved → scheduled → published → archived
 *                            │
 *                            └── request_changes ─▶ drafting
 *   any non-terminal ── cancel ──▶ cancelled
 *
 * Why eight states (vs. four like `todo_task`): the content workflow is
 * the demo. Multi-tab views, approval gates, and the publish action all
 * lean on the distinction between "approved" (ready to schedule) and
 * "scheduled" (date picked, awaiting publish).
 *
 * Approval gate: `in_review → approved` requires the `publish_approval`
 * approval process. Cancelling or sending back is always allowed.
 */
export const PieceStateMachine: StateMachineConfig = {
  id: 'content_piece_lifecycle',
  initial: 'backlog',
  states: {
    backlog: {
      on: {
        PICK_UP: { target: 'drafting', description: 'Assign to a writer and start drafting' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Idea is captured but no one has started. Confirm assignee and target channel before transitioning to drafting.',
      },
    },
    drafting: {
      on: {
        SUBMIT: { target: 'in_review', description: 'Submit draft to editorial lead' },
        SEND_BACK: { target: 'backlog', description: 'Park the draft and free the slot' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Author is writing. Do not auto-transition. Help with outline, hooks, and CTA suggestions only.',
      },
    },
    in_review: {
      on: {
        APPROVE: { target: 'approved', description: 'Editorial lead approves for publishing' },
        REQUEST_CHANGES: { target: 'drafting', description: 'Send back with notes' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Awaiting lead approval. The publish_approval process drives the APPROVE transition; never fire it directly.',
      },
    },
    approved: {
      on: {
        SCHEDULE: { target: 'scheduled', description: 'Pick a publish date' },
        REQUEST_CHANGES: { target: 'drafting' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Approved and ready to ship. Schedule with a concrete publish_at — same-day allowed.',
      },
    },
    scheduled: {
      on: {
        PUBLISH: { target: 'published', description: 'Publish now (or on publish_at)' },
        UNSCHEDULE: { target: 'approved', description: 'Pull off the schedule, keep approval' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Date is locked in. PUBLISH creates a publication row per target channel and stamps published_at.',
      },
    },
    published: {
      on: {
        ARCHIVE: { target: 'archived', description: 'Retire piece from active rotation' },
      },
      meta: {
        aiInstructions:
          'Live. Do not edit body content here; corrections happen on the publication record. Metrics roll up automatically.',
      },
    },
    archived: {
      type: 'final',
      meta: {
        aiInstructions:
          'Retired. Terminal. Use a new content_piece for follow-ups or refreshes.',
      },
    },
    cancelled: {
      type: 'final',
      meta: {
        aiInstructions: 'Killed before publishing. Terminal. Do not edit further.',
      },
    },
  },
};
