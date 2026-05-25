// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const KBArticleViews = defineView({
  list: {
    type: 'grid',
    name: 'all_kb_articles',
    label: 'All KB Articles',
    data: { provider: 'object', object: 'helpdesk_kb_article' },
    columns: [
      { field: 'name', width: 360, link: true, pinned: 'left', sortable: true },
      { field: 'category', width: 180, sortable: true },
      { field: 'status', width: 130, sortable: true },
      { field: 'locale', width: 100 },
      { field: 'author', width: 180 },
      { field: 'helpful_count', width: 110, align: 'right' },
      { field: 'unhelpful_count', width: 110, align: 'right' },
      { field: 'published_at', width: 170, sortable: true },
    ],
    sort: [{ field: 'published_at', order: 'desc' }],
    grouping: { fields: [{ field: 'status', order: 'asc' }] },
    pagination: { pageSize: 50 },
    tabs: [
      { name: 'all', label: 'All', view: 'all_kb_articles', isDefault: true, pinned: true },
      { name: 'published', label: 'Published', view: 'published_articles' },
      { name: 'drafts', label: 'Drafts', view: 'draft_articles' },
    ],
  },
  listViews: {
    published_articles: {
      name: 'published_articles',
      type: 'grid',
      label: 'Published',
      data: { provider: 'object', object: 'helpdesk_kb_article' },
      columns: ['name', 'category', 'locale', 'helpful_count', 'published_at'],
      filter: [{ field: 'status', operator: 'equals', value: 'published' }],
      sort: [{ field: 'helpful_count', order: 'desc' }],
    },
    draft_articles: {
      name: 'draft_articles',
      type: 'grid',
      label: 'Drafts',
      data: { provider: 'object', object: 'helpdesk_kb_article' },
      columns: ['name', 'category', 'author'],
      filter: [{ field: 'status', operator: 'in', value: ['draft', 'review'] }],
    },
  },
  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'helpdesk_kb_article' },
    sections: [
      {
        label: 'Article',
        columns: 2,
        fields: [
          { field: 'name', required: true, colSpan: 2 },
          'slug',
          'category',
          'status',
          'locale',
          'author',
          { field: 'tags', colSpan: 2 },
          { field: 'body', colSpan: 2 },
        ],
      },
      {
        label: 'Engagement',
        columns: 2,
        fields: ['helpful_count', 'unhelpful_count', 'published_at'],
      },
    ],
  },
});
