// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Task automation hook — keeps free-form fields consistent with the state
 * machine and stamps audit metadata that workflows can't derive on insert.
 */
const taskHook: Hook = {
  name: 'todo_task_automation',
  object: 'todo_task',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Normalize task fields on save.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    // Default status
    if (event === 'beforeInsert' && !input.status) {
      input.status = 'todo';
    }

    // Auto-clear started_at / completed_at when status moves backward.
    if (event === 'beforeUpdate' && previous) {
      if (input.status === 'todo' && previous.status !== 'todo') {
        input.started_at = null;
        input.completed_at = null;
      }
    }
  },
};

export default taskHook;
export { taskHook };
