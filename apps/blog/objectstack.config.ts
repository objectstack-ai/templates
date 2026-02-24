import { defineStack } from '@objectstack/spec';
import { BlogPlugin } from './src/plugin.js';

/**
 * Blog App Configuration
 *
 * A minimal blog/CMS application template.
 * Can be extended with comments, media library, and SEO fields.
 */
export default defineStack({
  manifest: {
    id: 'com.objectstack.templates.blog',
    namespace: 'blog',
    version: '1.0.0',
    type: 'app',
    name: 'Blog App',
    description: 'Simple blog and content management application template',
  },

  objects: [],

  plugins: [BlogPlugin],
  // Uses 'as any' because defineStack schema doesn't include runtime plugins —
  // consistent with the objectstack.config.ts pattern used across ObjectStack apps.
} as any);
