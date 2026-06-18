// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';
/**
 * KB Article — knowledge base entry. The AI triage flow recalls relevant
 * articles by category and recent usage, attaching IDs to
 * `helpdesk_ticket.ai_suggested_kb_ids`.
 *
 * For real production retrieval, a fork would add vector embeddings;
 * this template keeps it simple with category + keyword tags.
 */
export const KBArticle = ObjectSchema.create({
  name: 'helpdesk_kb_article',
  label: 'KB Article',
  pluralLabel: 'KB Articles',
  icon: 'book-open',
  description: 'Knowledge base article. Published articles are eligible for AI recall.',

  fields: {
    name: Field.text({
      label: 'Title',
      required: true,
      searchable: true,
      maxLength: 280,
    }),
    slug: Field.text({
      label: 'Slug',
      unique: true,
      maxLength: 200,
      description: 'URL-safe identifier for the portal route.',
    }),
    body: Field.markdown({ label: 'Body', required: true }),
    category: Field.select({
      label: 'Category',
      options: [
        { label: 'Getting Started', value: 'getting_started', default: true },
        { label: 'Account & Billing', value: 'billing' },
        { label: 'How-to', value: 'how_to' },
        { label: 'Troubleshooting', value: 'troubleshooting' },
        { label: 'API & Integrations', value: 'api' },
        { label: 'Known Issues', value: 'known_issues' },
      ],
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      options: [
        { label: 'Draft', value: 'draft', color: '#94A3B8', default: true },
        { label: 'In Review', value: 'review', color: '#F59E0B' },
        { label: 'Published', value: 'published', color: '#10B981' },
        { label: 'Archived', value: 'archived', color: '#6B7280' },
      ],
    }),
    tags: Field.json({
      label: 'Tags',
      description: 'Array of keyword strings. AI uses these for recall.',
    }),
    locale: Field.text({
      label: 'Locale',
      maxLength: 16,
      description: 'BCP-47 tag. Each translation is a separate article.',
    }),
    author: Field.lookup('sys_user', { label: 'Author' }),
    helpful_count: Field.number({ label: 'Helpful Votes', defaultValue: 0 }),
    unhelpful_count: Field.number({ label: 'Unhelpful Votes', defaultValue: 0 }),
    published_at: Field.datetime({ label: 'Published At' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['status'] }, { fields: ['category'] }, { fields: ['locale'] }],
  titleFormat: tmpl`{{record.name}}`,
  displayNameField: 'name',
  compactLayout: ['name', 'category', 'status', 'locale'],
  validations: [
    {
      type: 'state_machine',
      name: 'kb_article_lifecycle',
      field: 'status',
      transitions: {
        draft: ['review'],
        review: ['published', 'draft'],
        published: ['archived', 'draft'],
        archived: ['draft'],
      },
      message: 'Illegal status transition.',
    },
  ],
});
