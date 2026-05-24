// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Task lifecycle:
 *   todo → doing → done
 *   any  → cancelled
 *   done → todo (REOPEN)
 *
 * Keeps the canonical "started / completed / aborted" verbs an AI agent
 * or external API needs, while preventing accidental jumps like
 * `cancelled → done`.
 */
export const TaskStateMachine: StateMachineConfig = {
  id: 'task_lifecycle',
  initial: 'todo',
  states: {
    todo: {
      on: {
        START: { target: 'doing', description: 'Begin work on the task' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Task is queued. Confirm assignee and due date before transitioning to doing.',
      },
    },
    doing: {
      on: {
        COMPLETE: { target: 'done', description: 'All acceptance criteria met' },
        BLOCK: { target: 'todo', description: 'Unblock and re-queue' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Task in progress. If blocked, move back to todo with a comment explaining why.',
      },
    },
    done: {
      on: {
        REOPEN: { target: 'todo', description: 'Reopen if regression detected' },
      },
      meta: {
        aiInstructions:
          'Task is complete. Only reopen if a defect surfaces; otherwise do not change status.',
      },
    },
    cancelled: {
      type: 'final',
      meta: {
        aiInstructions: 'Task is cancelled and is terminal. Do not edit further.',
      },
    },
  },
};
