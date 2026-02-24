import { defineStack } from '@objectstack/spec';
import { TodoPlugin } from './src/plugin.js';

/**
 * Todo App Configuration
 *
 * A minimal task management application template.
 * Can be extended with additional fields, hooks, and actions.
 */
export default defineStack({
  manifest: {
    id: 'com.objectstack.templates.todo',
    namespace: 'todo',
    version: '1.0.0',
    type: 'app',
    name: 'Todo App',
    description: 'Simple task management application template',
  },

  objects: [],

  plugins: [TodoPlugin],
  // Uses 'as any' because defineStack schema doesn't include runtime plugins —
  // consistent with the objectstack.config.ts pattern used across ObjectStack apps.
} as any);
