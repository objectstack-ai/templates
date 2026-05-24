// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Template — a reusable outline / structure a piece can be instantiated
 * from. Small-N reference object. Editors add new templates in-app
 * (case-study v2, weekly newsletter, listicle, …) without forking the
 * package.
 *
 * The `outline_markdown` field is copied into `content_piece.body_outline`
 * at piece-creation time when a template is selected. Wiring lives in the
 * `draft_outline_from_topic` action.
 */
export const ContentTemplate = ObjectSchema.create({
  name: 'content_template',
  label: 'Template',
  pluralLabel: 'Templates',
  icon: 'layout-template',
  description: 'A reusable outline/structure for content pieces.',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 120,
    }),
    kind: Field.select({
      label: 'Format',
      required: true,
      options: [
        { label: 'Long-form Article', value: 'long_form', color: '#3B82F6', default: true },
        { label: 'Listicle', value: 'listicle', color: '#10B981' },
        { label: 'Case Study', value: 'case_study', color: '#8B5CF6' },
        { label: 'Newsletter Issue', value: 'newsletter', color: '#0EA5E9' },
        { label: 'Social Thread', value: 'thread', color: '#111827' },
        { label: 'Video Script', value: 'video_script', color: '#EF4444' },
      ],
    }),
    target_channel: Field.lookup('content_channel', {
      label: 'Preferred Channel',
      description: 'Hint for the editor — does not lock the piece to this channel.',
    }),
    target_word_count: Field.number({
      label: 'Target Word Count',
      scale: 0,
      min: 0,
      description: 'Used as a hint in the AI outline action.',
    }),
    outline_markdown: Field.markdown({
      label: 'Outline (Markdown)',
      description:
        'Copied into a new content_piece.body_outline when the piece is instantiated from this template.',
    }),
    description: Field.text({ label: 'Description', maxLength: 300 }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['name'], unique: true }, { fields: ['kind'] }],

  displayNameField: 'name',
  titleFormat: tmpl`{{record.name}}`,
  compactLayout: ['name', 'kind', 'target_channel', 'target_word_count'],
});
