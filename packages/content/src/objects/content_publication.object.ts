// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Publication — "this piece went live on this channel at this time".
 * Resolves the piece ↔ channel M:N. Created by `publish_now` (one row per
 * entry in `piece.target_channels`).
 *
 * Metric snapshots are recorded against this row, not the piece — so a
 * blog post + LinkedIn cross-post are measured independently. The
 * `total_*` numbers are STORED fields (seed/client-maintained); cross-object
 * rollups via hook are unsupported in the standalone runtime — see
 * content/src/hooks/index.ts.
 */
export const Publication = ObjectSchema.create({
  name: 'content_publication',
  label: 'Publication',
  pluralLabel: 'Publications',
  icon: 'send',
  description: 'A single live placement of a content piece on a channel.',

  fieldGroups: [
    { key: 'core', label: 'Publication', icon: 'send' },
    { key: 'rollups', label: 'Performance', icon: 'trending-up' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    piece: Field.lookup('content_piece', {
      label: 'Piece',
      required: true,
      group: 'core',
    }),
    channel: Field.lookup('content_channel', {
      label: 'Channel',
      required: true,
      group: 'core',
    }),
    public_url: Field.text({
      label: 'Public URL',
      maxLength: 400,
      group: 'core',
      description: 'Where the live thing lives. The CMS integration seam.',
    }),
    published_at: Field.datetime({
      label: 'Published At',
      required: true,
      group: 'core',
    }),
    external_id: Field.text({
      label: 'External ID',
      maxLength: 120,
      group: 'core',
      description: 'Optional ID on the upstream system (CMS post id, LinkedIn post URN, etc.).',
    }),

    // Denormalised totals — STORED fields (seed/client-maintained). A live
    // rollup from metric snapshots needs a nested engine write, which is
    // unsupported in the standalone hook runtime — see content/src/hooks/index.ts.
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
    last_metric_at: Field.datetime({
      label: 'Last Snapshot',
      readonly: true,
      group: 'rollups',
    }),

    notes: Field.markdown({ label: 'Notes', group: 'meta' }),
  },

  enable: {
    trackHistory: true,
    apiEnabled: true,
    feeds: true,
    activities: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['piece'] }, { fields: ['channel'] }, { fields: ['published_at'] }],

  titleFormat: tmpl`{{record.piece}} on {{record.channel}}`,
  compactLayout: ['piece', 'channel', 'published_at', 'total_views', 'total_signups'],
});
