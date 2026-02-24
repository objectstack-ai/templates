import { PluginSchema } from '@objectstack/spec/kernel';
import type { PluginDefinition } from '@objectstack/spec/kernel';

import { Todo } from './todo.object.js';

/**
 * Todo App Plugin Definition
 *
 * Provides a simple task management application with:
 * - Todo items with status, priority, and due date
 * - Assignee support
 * - Activity tracking
 */
export const TodoPlugin = {
  name: 'todo',
  label: 'Todo',
  version: '1.0.0',
  description: 'Simple task management application',

  dependencies: [],

  init: async () => {},

  actions: {},

  triggers: {},

  objects: {
    todo: Todo,
  },

  apps: [
    {
      name: 'todo',
      label: 'Todo',
      navigation: [
        {
          id: 'tasks',
          type: 'group',
          label: 'Tasks',
          children: [
            { id: 'todo', label: 'All Todos', type: 'object', objectName: 'todo' },
          ],
        },
      ],
    },
  ],
};

/** Spec-validated plugin metadata */
export const TodoPluginMetadata: PluginDefinition = PluginSchema.parse({
  name: 'todo',
  label: 'Todo',
  version: '1.0.0',
  description: 'Simple task management application',
});

export default TodoPlugin;
