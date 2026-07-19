// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Channel — a publishing surface (Blog, Newsletter, LinkedIn, X, YouTube).
 *
 * Small-N reference data; rarely changes after initial setup. The
 * `default_cta_goal` field powers the `cta_creation_default` flow: when a
 * new piece is created we drop a starter CTA targeting the channel's
 * canonical goal (newsletter → subscribe, blog → signup, etc.).
 */
export const Channel = ObjectSchema.create({
  name: 'content_channel',
  sharingModel: 'public_read',
  label: 'Channel',
  pluralLabel: 'Channels',
  icon: 'megaphone',
  description: 'A publishing surface — where content actually goes live.',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 80,
    }),
    kind: Field.select({
      label: 'Kind',
      required: true,
      options: [
        { label: 'Blog', value: 'blog', color: '#3B82F6', default: true },
        { label: 'Newsletter', value: 'newsletter', color: '#10B981' },
        { label: 'LinkedIn', value: 'linkedin', color: '#0EA5E9' },
        { label: 'X (Twitter)', value: 'twitter_x', color: '#111827' },
        { label: 'YouTube', value: 'youtube', color: '#EF4444' },
        { label: 'Podcast', value: 'podcast', color: '#8B5CF6' },
        { label: 'Other', value: 'other', color: '#6B7280' },
      ],
    }),
    base_url: Field.text({
      label: 'Base URL',
      maxLength: 200,
      description: 'Used to construct publication permalinks; e.g. https://blog.acme.com/.',
    }),
    default_cta_goal: Field.select({
      label: 'Default CTA Goal',
      options: [
        { label: 'Signup', value: 'signup', color: '#10B981', default: true },
        { label: 'Demo', value: 'demo', color: '#3B82F6' },
        { label: 'Subscribe', value: 'subscribe', color: '#0EA5E9' },
        { label: 'Read More', value: 'read', color: '#94A3B8' },
        { label: 'Watch', value: 'watch', color: '#EF4444' },
      ],
    }),
    color: Field.color({
      label: 'Color',
      defaultValue: '#3B82F6',
      description: 'Used on the editorial calendar to colour pieces by channel.',
    }),
    active: Field.boolean({
      label: 'Active',
      defaultValue: true,
    }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['name'], unique: true }, { fields: ['kind'] }],

  nameField: 'name',
  highlightFields: ['name', 'kind', 'default_cta_goal', 'active'],
});
