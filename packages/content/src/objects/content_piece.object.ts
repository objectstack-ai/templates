// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';
/**
 * Content piece — the unit of work. State machine drives the workflow;
 * everything else (publications, metrics, CTAs) hangs off this row.
 *
 * One piece may go live on multiple channels — the M:N is modeled through
 * `content_publication`. `target_channels` (multi-lookup) is the EDITORIAL
 * intent; once published, the actual live-on-channel record set lives in
 * publication rows.
 *
 * Polymorphic platform features:
 *   - sys_comment    (thread_id = "content_piece:{id}")
 *   - sys_attachment (parent_object = "content_piece", parent_id = "{id}")
 *   - sys_audit_log  (per-field via Field.trackHistory, plugin-audit / ADR-0052)
 */
export const Piece = ObjectSchema.create({
  name: 'content_piece',
  label: 'Content Piece',
  pluralLabel: 'Content Pieces',
  icon: 'file-text',
  description: 'A single piece of content moving through the editorial workflow.',

  fieldGroups: [
    { key: 'core', label: 'Piece', icon: 'file-text' },
    { key: 'planning', label: 'Planning', icon: 'calendar' },
    { key: 'body', label: 'Body', icon: 'pen-tool' },
    { key: 'rollups', label: 'Performance', icon: 'trending-up', defaultExpanded: false },
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

    slug: Field.text({
      label: 'Slug',
      maxLength: 200,
      group: 'core',
      description: 'URL-safe identifier. Used by the CMS adapter; we do not render the body here.',
    }),

    topic: Field.lookup('content_topic', {
      label: 'Topic',
      required: true,
      group: 'core',
    }),

    template: Field.lookup('content_template', {
      label: 'Template',
      group: 'core',
      description: 'Optional starting outline. Copied into body_outline at create-time.',
    }),

    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Backlog', value: 'backlog', color: '#94A3B8', default: true },
        { label: 'Drafting', value: 'drafting', color: '#3B82F6' },
        { label: 'In Review', value: 'in_review', color: '#F59E0B' },
        { label: 'Approved', value: 'approved', color: '#10B981' },
        { label: 'Scheduled', value: 'scheduled', color: '#0EA5E9' },
        { label: 'Published', value: 'published', color: '#16A34A' },
        { label: 'Archived', value: 'archived', color: '#6B7280' },
        { label: 'Cancelled', value: 'cancelled', color: '#475569' },
      ],
    }),

    format: Field.select({
      label: 'Format',
      group: 'core',
      options: [
        { label: 'Long-form Article', value: 'long_form', color: '#3B82F6', default: true },
        { label: 'Listicle', value: 'listicle', color: '#10B981' },
        { label: 'Case Study', value: 'case_study', color: '#8B5CF6' },
        { label: 'Newsletter Issue', value: 'newsletter', color: '#0EA5E9' },
        { label: 'Social Thread', value: 'thread', color: '#111827' },
        { label: 'Video Script', value: 'video_script', color: '#EF4444' },
      ],
    }),

    assignee: Field.lookup('sys_user', {
      label: 'Writer',
      group: 'core',
    }),

    editor: Field.lookup('sys_user', {
      label: 'Editor',
      group: 'core',
      description: 'The lead reviewing the draft.',
    }),

    target_channels: Field.lookup('content_channel', {
      label: 'Target Channels',
      multiple: true,
      group: 'planning',
      description:
        'Editorial intent. The publish_now action creates one publication row per active channel here.',
    }),

    // Planning
    publish_at: Field.datetime({ label: 'Publish At', group: 'planning' }),
    word_count_target: Field.number({
      label: 'Target Words',
      scale: 0,
      min: 0,
      group: 'planning',
    }),

    // Body
    summary: Field.text({
      label: 'Hook / Summary',
      maxLength: 400,
      group: 'body',
      description: 'One-paragraph value proposition. Used on social cards and the editorial list.',
    }),
    body_outline: Field.markdown({
      label: 'Outline',
      group: 'body',
      description: 'Draft outline. Rewritten by the draft_outline_from_topic AI action.',
    }),
    body_draft: Field.markdown({
      label: 'Draft Body',
      group: 'body',
    }),

    // SEO — the pre-publish checklist these teams actually track.
    seo_title: Field.text({
      label: 'SEO Title',
      maxLength: 70,
      group: 'body',
      description: 'Title tag (≤ 60–70 chars). Falls back to the piece title if blank.',
    }),
    meta_description: Field.text({
      label: 'Meta Description',
      maxLength: 160,
      group: 'body',
      description: 'Search-result snippet (≤ 160 chars).',
    }),
    primary_keyword: Field.text({
      label: 'Primary Keyword',
      maxLength: 120,
      searchable: true,
      group: 'body',
      description: 'The target query this piece is optimised to rank for.',
    }),

    // Lifecycle stamps
    submitted_at: Field.datetime({ label: 'Submitted At', readonly: true, group: 'planning' }),
    approved_at: Field.datetime({ label: 'Approved At', readonly: true, group: 'planning' }),
    // `date` (not `datetime`): the published-by-month chart filters `published_at
    // >= {12_months_ago}`, which only matches an ISO-date-string column. See AGENTS.md.
    published_at: Field.date({ label: 'Published At', readonly: true, group: 'planning' }),
    archived_at: Field.datetime({ label: 'Archived At', readonly: true, group: 'planning' }),

    // Denormalised performance rollups — native roll-up summaries (#1870),
    // recomputed server-side as child `content_publication` rows change (FK
    // `content_publication.piece` auto-detected). Sums each publication's own
    // rolled-up totals up to the piece. Replaces the broken publication_rollup flow.
    total_views: Field.summary({
      label: 'Views',
      group: 'rollups',
      summaryOperations: { object: 'content_publication', field: 'total_views', function: 'sum' },
    }),
    total_clicks: Field.summary({
      label: 'Clicks',
      group: 'rollups',
      summaryOperations: { object: 'content_publication', field: 'total_clicks', function: 'sum' },
    }),
    total_signups: Field.summary({
      label: 'Signups',
      group: 'rollups',
      summaryOperations: { object: 'content_publication', field: 'total_signups', function: 'sum' },
    }),
    total_revenue: Field.summary({
      label: 'Attributed Revenue',
      group: 'rollups',
      summaryOperations: { object: 'content_publication', field: 'total_revenue', function: 'sum' },
    }),

    // Derived signals
    is_overdue: Field.formula({
      label: 'Overdue?',
      group: 'planning',
      expression: F`record.publish_at != null && record.publish_at < now() && record.status != "published" && record.status != "archived" && record.status != "cancelled"`,
    }),

    is_top_performer: Field.formula({
      label: 'Top Performer?',
      group: 'rollups',
      expression: F`record.status == "published" && record.total_signups >= 25`,
    }),

    tags: Field.text({
      label: 'Tags',
      maxLength: 200,
      group: 'meta',
    }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['topic'] },
    { fields: ['status'] },
    { fields: ['assignee'] },
    { fields: ['editor'] },
    { fields: ['publish_at'] },
    { fields: ['published_at'] },
  ],

  titleFormat: tmpl`{{record.title}}`,
  compactLayout: ['title', 'status', 'format', 'assignee', 'publish_at'],

  validations: [
    {
      type: 'state_machine',
      name: 'content_piece_lifecycle',
      field: 'status',
      transitions: {
        backlog: ['drafting', 'cancelled'],
        drafting: ['in_review', 'backlog', 'cancelled'],
        in_review: ['approved', 'drafting', 'cancelled'],
        approved: ['scheduled', 'drafting', 'cancelled'],
        scheduled: ['published', 'approved', 'cancelled'],
        published: ['archived'],
        archived: [],
        cancelled: [],
      },
      message: 'Illegal status transition.',
    },
    {
      name: 'scheduled_requires_publish_at',
      type: 'script',
      severity: 'error',
      message: 'Scheduled pieces must have a publish_at timestamp.',
      condition: P`record.status == "scheduled" && record.publish_at == null`,
    },
    {
      // `assignee` is an OPTIONAL sys_user lookup. Seed/import/automation paths
      // legitimately create in-review pieces without a resolvable user
      // reference (lookup seeds resolve by natural-key string; there is no
      // seed-time user to point at), so this is a soft data-quality signal —
      // surfaced in the UI — rather than a hard insert blocker. (9.9.x now
      // evaluates `== null` rules on insert, which is why error-severity here
      // rejected the seeded in-review pieces and cascaded to their CTAs.)
      name: 'in_review_requires_assignee',
      type: 'script',
      severity: 'warning',
      message: 'In-review pieces should have a writer assigned.',
      condition: P`record.status == "in_review" && record.assignee == null`,
    },
  ],

  // Lifecycle timestamps (submitted_at / approved_at / published_at /
  // archived_at) are stamped by `content_piece.hook.ts` on status entry.
  // Object-level `workflows` are not a supported 7.x ObjectSchema field.
});
