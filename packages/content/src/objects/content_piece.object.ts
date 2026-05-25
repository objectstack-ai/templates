// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';
import { PieceStateMachine } from './content_piece.state';

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
 *   - sys_activity / sys_audit_log via enable.feeds/trackHistory
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

    assignee: Field.lookup('user', {
      label: 'Writer',
      group: 'core',
    }),

    editor: Field.lookup('user', {
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

    // Lifecycle stamps
    submitted_at: Field.datetime({ label: 'Submitted At', readonly: true, group: 'planning' }),
    approved_at: Field.datetime({ label: 'Approved At', readonly: true, group: 'planning' }),
    published_at: Field.datetime({ label: 'Published At', readonly: true, group: 'planning' }),
    archived_at: Field.datetime({ label: 'Archived At', readonly: true, group: 'planning' }),

    // Denormalised performance rollups (kept in sync by publication_rollup flow)
    total_views: Field.number({
      label: 'Views',
      scale: 0,
      min: 0,
      readonly: true,
      group: 'rollups',
      defaultValue: 0,
    }),
    total_clicks: Field.number({
      label: 'Clicks',
      scale: 0,
      min: 0,
      readonly: true,
      group: 'rollups',
      defaultValue: 0,
    }),
    total_signups: Field.number({
      label: 'Signups',
      scale: 0,
      min: 0,
      readonly: true,
      group: 'rollups',
      defaultValue: 0,
    }),
    total_revenue: Field.currency({
      label: 'Attributed Revenue',
      readonly: true,
      group: 'rollups',
      defaultValue: 0,
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

  stateMachines: {
    lifecycle: PieceStateMachine,
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    files: true,
    feeds: true,
    activities: true,
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
      name: 'scheduled_requires_publish_at',
      type: 'script',
      severity: 'error',
      message: 'Scheduled pieces must have a publish_at timestamp.',
      condition: P`record.status == "scheduled" && record.publish_at == null`,
    },
    {
      name: 'in_review_requires_assignee',
      type: 'script',
      severity: 'error',
      message: 'In-review pieces must have a writer assigned.',
      condition: P`record.status == "in_review" && record.assignee == null`,
    },
  ],

  workflows: [
    {
      name: 'stamp_submitted_at',
      objectName: 'content_piece',
      triggerType: 'on_update',
      criteria: P`record.status == "in_review" && previous.status != "in_review"`,
      active: true,
      actions: [
        { name: 'set_submitted_at', type: 'field_update', field: 'submitted_at', value: 'now()' },
      ],
    },
    {
      name: 'stamp_approved_at',
      objectName: 'content_piece',
      triggerType: 'on_update',
      criteria: P`record.status == "approved" && previous.status != "approved"`,
      active: true,
      actions: [
        { name: 'set_approved_at', type: 'field_update', field: 'approved_at', value: 'now()' },
      ],
    },
    {
      name: 'stamp_published_at',
      objectName: 'content_piece',
      triggerType: 'on_update',
      criteria: P`record.status == "published" && previous.status != "published" && record.published_at == null`,
      active: true,
      actions: [
        { name: 'set_published_at', type: 'field_update', field: 'published_at', value: 'now()' },
      ],
    },
    {
      name: 'stamp_archived_at',
      objectName: 'content_piece',
      triggerType: 'on_update',
      criteria: P`record.status == "archived" && previous.status != "archived"`,
      active: true,
      actions: [
        { name: 'set_archived_at', type: 'field_update', field: 'archived_at', value: 'now()' },
      ],
    },
  ],
});
