// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Topic — the editorial brief. Owns the intent; one topic can spawn many
 * pieces (e.g. a long-form article + a teaser thread + a newsletter cut).
 *
 * Sharing rule `topic_team_scope` reads `visibility` to gate cross-team
 * access; child pieces inherit. Default is `team` so a contributor's brief
 * is visible to peers; flip to `private` for sensitive bets.
 */
export const Topic = ObjectSchema.create({
  name: 'content_topic',
  label: 'Topic',
  pluralLabel: 'Topics',
  icon: 'lightbulb',
  description: 'An editorial brief. The why-we-should-write-this.',

  fieldGroups: [
    { key: 'core', label: 'Topic', icon: 'lightbulb' },
    { key: 'planning', label: 'Planning', icon: 'target' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    title: Field.text({
      label: 'Title',
      required: true,
      searchable: true,
      maxLength: 200,
      group: 'core',
    }),

    brief: Field.markdown({
      label: 'Brief',
      group: 'core',
      description: 'The argument: who it is for, what it claims, the proof points we need.',
    }),

    pillar: Field.select({
      label: 'Content Pillar',
      group: 'planning',
      description: 'Which strategic theme this falls under. Fork and customise.',
      options: [
        { label: 'Product Education', value: 'product_education', color: '#3B82F6', default: true },
        { label: 'Industry Insight', value: 'industry_insight', color: '#8B5CF6' },
        { label: 'Customer Story', value: 'customer_story', color: '#10B981' },
        { label: 'Thought Leadership', value: 'thought_leadership', color: '#F59E0B' },
        { label: 'Community / DevRel', value: 'community', color: '#0EA5E9' },
      ],
    }),

    funnel_stage: Field.select({
      label: 'Funnel Stage',
      group: 'planning',
      options: [
        { label: 'Awareness (TOFU)', value: 'tofu', color: '#94A3B8', default: true },
        { label: 'Consideration (MOFU)', value: 'mofu', color: '#3B82F6' },
        { label: 'Decision (BOFU)', value: 'bofu', color: '#10B981' },
      ],
    }),

    priority: Field.select({
      label: 'Priority',
      group: 'planning',
      options: [
        { label: 'Low', value: 'low', color: '#94A3B8' },
        { label: 'Normal', value: 'normal', color: '#3B82F6', default: true },
        { label: 'High', value: 'high', color: '#F59E0B' },
      ],
    }),

    target_keyword: Field.text({
      label: 'Target Keyword',
      maxLength: 120,
      group: 'planning',
      description: 'Primary SEO term, if applicable.',
    }),

    visibility: Field.select({
      label: 'Visibility',
      required: true,
      group: 'core',
      description:
        'Drives the topic_team_scope sharing rule. Private = owner only; Team = visible to the whole team.',
      options: [
        { label: 'Team', value: 'team', color: '#10B981', default: true },
        { label: 'Private', value: 'private', color: '#6B7280' },
      ],
    }),

    owner: Field.lookup('sys_user', {
      label: 'Owner',
      group: 'core',
      description:
        'Person accountable for landing this topic. Defaults to created_by; never require — the platform fills it.',
    }),

    source_signal: Field.lookup('content_signal', {
      label: 'Source Signal',
      group: 'meta',
      description: 'Linked back when the topic was promoted from a triaged signal.',
    }),

    tags: Field.text({
      label: 'Tags',
      maxLength: 200,
      group: 'meta',
      description: 'Comma-separated free tags. Replace with a junction in your fork if needed.',
    }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['owner'] },
    { fields: ['pillar'] },
    { fields: ['funnel_stage'] },
    { fields: ['visibility'] },
  ],

  displayNameField: 'title',
  compactLayout: ['title', 'pillar', 'funnel_stage', 'priority', 'owner', 'visibility'],
});
