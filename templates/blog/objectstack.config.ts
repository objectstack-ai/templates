import { defineStack } from '@objectstack/spec';
import { BlogPlugin } from './src/plugin.js';

export default defineStack({
  manifest: {
    id: 'com.templates.blog',
    namespace: 'blog',
    version: '1.0.0',
    type: 'plugin',
    name: 'Blog',
    description: 'Blog and content management app — posts, categories, and comment moderation',
  },

  // Empty objects array triggers auto-loading of ObjectQL and the memory driver.
  // Business objects are defined inside the plugin's objects[] property.
  objects: [],

  plugins: [BlogPlugin],
  // Uses 'as any' because defineStack schema doesn't include runtime plugin shape —
  // consistent with the @objectstack/hotcrm pattern.
} as any);
