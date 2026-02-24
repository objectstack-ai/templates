import { Category } from './category.object.js';
import { Post } from './post.object.js';
import { Comment } from './comment.object.js';

export const BlogPlugin = {
  name: 'blog',
  label: 'Blog',
  version: '1.0.0',
  description: 'Blog and content management — posts, categories, and comment moderation',

  dependencies: [],

  init: async () => {},

  actions: {},
  triggers: {},
  workflows: {},

  objects: {
    category: Category,
    post: Post,
    comment: Comment,
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
            { id: 'comment', label: 'Comments', type: 'object', objectName: 'comment' },
          ],
        },
      ],
    },
  ],
};

export default BlogPlugin;
