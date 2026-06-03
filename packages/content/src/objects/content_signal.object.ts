// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, tmpl } from '@objectstack/spec';
/**
 * Signal — a captured event worth potentially writing about. Sources:
 *   - a competitor published something (auto-captured via RSS / manual)
 *   - a customer interview surfaced a quote
 *   - a trend appeared in search / social
 *
 * The 3-state machine (captured → promoted | ignored) keeps the inbox
 * shape: "captured" is the triage queue, "promoted" produces a topic
 * via the `signal_to_topic_promotion` flow.
 */
export const Signal = ObjectSchema.create({
  name: 'content_signal',
  label: 'Signal',
  pluralLabel: 'Signals',
  icon: 'rss',
  description: 'A captured competitive/market/customer event we may write about.',

  fieldGroups: [
    { key: 'core', label: 'Signal', icon: 'rss' },
    { key: 'classification', label: 'Classification', icon: 'tag' },
    { key: 'ai', label: 'AI Assist', icon: 'sparkles', defaultExpanded: false },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    headline: Field.text({
      label: 'Headline',
      required: true,
      searchable: true,
      maxLength: 200,
      group: 'core',
    }),

    source_kind: Field.select({
      label: 'Source',
      required: true,
      group: 'core',
      options: [
        { label: 'Competitor Post', value: 'competitor_post', color: '#EF4444', default: true },
        { label: 'Customer Quote', value: 'customer_quote', color: '#10B981' },
        { label: 'Search Trend', value: 'search_trend', color: '#F59E0B' },
        { label: 'Social Thread', value: 'social_thread', color: '#0EA5E9' },
        { label: 'Analyst Report', value: 'analyst', color: '#8B5CF6' },
        { label: 'Other', value: 'other', color: '#6B7280' },
      ],
    }),

    competitor: Field.lookup('content_competitor', {
      label: 'Competitor',
      group: 'core',
      description: 'Only set when source_kind = competitor_post.',
    }),

    source_url: Field.text({
      label: 'Source URL',
      maxLength: 400,
      group: 'core',
    }),

    captured_at: Field.datetime({
      label: 'Captured At',
      group: 'core',
      readonly: true,
      description: 'Stamped on insert by the hook.',
    }),

    status: Field.select({
      label: 'Status',
      required: true,
      group: 'classification',
      options: [
        { label: 'Captured', value: 'captured', color: '#F59E0B', default: true },
        { label: 'Promoted', value: 'promoted', color: '#10B981' },
        { label: 'Ignored', value: 'ignored', color: '#6B7280' },
      ],
    }),

    impact: Field.select({
      label: 'Impact',
      group: 'classification',
      options: [
        { label: 'Low', value: 'low', color: '#94A3B8' },
        { label: 'Medium', value: 'medium', color: '#3B82F6', default: true },
        { label: 'High', value: 'high', color: '#F59E0B' },
        { label: 'Critical', value: 'critical', color: '#EF4444' },
      ],
    }),

    // AI-assist fields (written by summarize_competitor_signal action)
    summary: Field.markdown({
      label: 'Summary',
      group: 'ai',
      description:
        'AI-extracted ~2-paragraph summary of the source. Rewritten by summarize_competitor_signal.',
    }),

    recommended_topic_title: Field.text({
      label: 'Recommended Topic Title',
      maxLength: 200,
      group: 'ai',
      description: 'Suggested title for the promoted topic. Pre-fills the topic-creation form.',
    }),

    promoted_at: Field.datetime({
      label: 'Promoted At',
      readonly: true,
      group: 'meta',
    }),

    promoted_topic: Field.lookup('content_topic', {
      label: 'Promoted Topic',
      readonly: true,
      group: 'meta',
      description: 'Set by signal_to_topic_promotion flow when status flips to promoted.',
    }),

    notes: Field.markdown({ label: 'Notes', group: 'meta' }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    feeds: true,
    activities: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['status'] },
    { fields: ['competitor'] },
    { fields: ['captured_at'] },
    { fields: ['source_kind'] },
  ],

  titleFormat: tmpl`{{record.headline}}`,
  compactLayout: ['headline', 'source_kind', 'competitor', 'impact', 'status'],

  validations: [
    {
      type: 'state_machine',
      name: 'content_signal_lifecycle',
      field: 'status',
      transitions: {captured:["promoted", "ignored"], promoted:[], ignored:[]},
      message: 'Illegal status transition.',
    },
    {
      name: 'competitor_post_requires_competitor',
      type: 'script',
      severity: 'error',
      message: 'Competitor signals must reference a competitor record.',
      condition: P`record.source_kind == "competitor_post" && record.competitor == null`,
    },
  ],

  // `promoted_at` is stamped by `content_piece.hook.ts` (signalHook) on
  // promotion. Object-level `workflows` are not a supported 7.x field.
});
