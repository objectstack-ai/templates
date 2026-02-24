import { PluginSchema } from '@objectstack/spec/kernel';
import type { PluginDefinition } from '@objectstack/spec/kernel';

import { Post } from './post.object.js';
import { Category } from './category.object.js';

/**
 * Blog App Plugin Definition
 *
 * Provides a simple blog/CMS application with:
 * - Posts with status (draft/published/archived)
 * - Categories with hierarchical structure
 * - Author assignment and activity tracking
 */
export const BlogPlugin = {
  name: 'blog',
  label: 'Blog',
  version: '1.0.0',
  description: 'Simple blog and content management application',

  dependencies: [],

  init: async () => {},

  actions: {},

  triggers: {},

  objects: {
    post: Post,
    category: Category,
  },

  apps: [
    {
      name: 'blog',
      label: 'Blog',
      navigation: [
        {
          id: 'content',
          type: 'group',
          label: 'Content',
          children: [
            { id: 'post', label: 'Posts', type: 'object', objectName: 'post' },
            { id: 'category', label: 'Categories', type: 'object', objectName: 'category' },
          ],
        },
      ],
    },
  ],
};

/** Spec-validated plugin metadata */
export const BlogPluginMetadata: PluginDefinition = PluginSchema.parse({
  name: 'blog',
  label: 'Blog',
  version: '1.0.0',
  description: 'Simple blog and content management application',
});

export default BlogPlugin;
