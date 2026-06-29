// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P } from '@objectstack/spec';

/**
 * CTA — a call-to-action variant attached to a piece. Carries a goal
 * (signup / demo / subscribe / read / watch) and a destination URL.
 *
 * One piece typically has 1–3 CTA variants for A/B comparison. The
 * `cta_creation_default` flow auto-creates a default CTA from the
 * primary target channel when a piece is created with none.
 */
export const Cta = ObjectSchema.create({
  name: 'content_cta',
  label: 'CTA',
  pluralLabel: 'CTAs',
  icon: 'mouse-pointer-click',
  description: 'A call-to-action variant attached to a content piece.',

  fields: {
    piece: Field.lookup('content_piece', {
      label: 'Piece',
      required: true,
    }),
    label_text: Field.text({
      label: 'Button Text',
      required: true,
      maxLength: 80,
      description: 'The literal copy a reader sees on the button.',
    }),
    goal: Field.select({
      label: 'Goal',
      required: true,
      options: [
        { label: 'Signup', value: 'signup', color: '#10B981', default: true },
        { label: 'Demo', value: 'demo', color: '#3B82F6' },
        { label: 'Subscribe', value: 'subscribe', color: '#0EA5E9' },
        { label: 'Read More', value: 'read', color: '#94A3B8' },
        { label: 'Watch', value: 'watch', color: '#EF4444' },
      ],
    }),
    destination_url: Field.text({
      label: 'Destination URL',
      maxLength: 400,
      description: 'Where the click goes. Include UTM params for proper attribution.',
    }),
    variant: Field.text({
      label: 'Variant Label',
      maxLength: 40,
      description: 'Free tag for A/B identifiers (e.g. "v1", "control", "stronger-claim").',
    }),
    is_primary: Field.boolean({
      label: 'Primary',
      defaultValue: false,
      description: 'The default variant rendered if no experiment is running.',
    }),
  },

  enable: {
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['piece'] }, { fields: ['goal'] }],

  nameField: 'label_text',
  compactLayout: ['label_text', 'goal', 'piece', 'is_primary'],

  validations: [
    {
      name: 'destination_required_for_external_goals',
      type: 'script',
      severity: 'error',
      message: 'Signup / demo / subscribe / watch CTAs need a destination URL.',
      condition: P`record.goal != "read" && (record.destination_url == null || record.destination_url == "")`,
    },
  ],
});
