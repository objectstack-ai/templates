import { defineStack } from '@objectstack/spec';
import { TodoPlugin } from './src/plugin.js';

export default defineStack({
  manifest: {
    id: 'com.templates.todo',
    namespace: 'todo',
    version: '1.0.0',
    type: 'plugin',
    name: 'Todo',
    description: 'Task management app — todo lists and items with priorities and due dates',
  },

  // Empty objects array triggers auto-loading of ObjectQL and the memory driver.
  // Business objects are defined inside the plugin's objects[] property.
  objects: [],

  plugins: [TodoPlugin],
  // Uses 'as any' because defineStack schema doesn't include runtime plugin shape —
  // consistent with the @objectstack/hotcrm pattern.
} as any);
