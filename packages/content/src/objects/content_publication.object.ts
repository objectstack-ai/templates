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
    // `date` (not `datetime`): the ROI dashboard filters `published_at >=
    // {90_days_ago}`, which only matches an ISO-date-string column — a datetime
    // epoch column never matches the analytics ISO-string date tokens. See AGENTS.md.
    published_at: Field.date({
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

    // Denormalised totals — native roll-up summaries (#1870). The engine
    // recomputes these server-side whenever a child `content_metric` row is
    // inserted/updated/deleted (FK `content_metric.publication` auto-detected).
    // This replaces the old `publication_rollup` flow, whose script-node
    // "aggregations" never ran (the automation engine has no aggregate node) —
    // and a hook can't do it either (nested cross-object write is unsupported in
    // the standalone QuickJS runtime; see content/src/hooks/index.ts).
    total_views: Field.summary({
      label: 'Views',
      group: 'rollups',
      summaryOperations: { object: 'content_metric', field: 'views', function: 'sum' },
    }),
    total_clicks: Field.summary({
      label: 'Clicks',
      group: 'rollups',
      summaryOperations: { object: 'content_metric', field: 'clicks', function: 'sum' },
    }),
    total_signups: Field.summary({
      label: 'Signups',
      group: 'rollups',
      summaryOperations: { object: 'content_metric', field: 'signups', function: 'sum' },
    }),
    total_revenue: Field.summary({
      label: 'Attributed Revenue',
      group: 'rollups',
      summaryOperations: { object: 'content_metric', field: 'revenue', function: 'sum' },
    }),
    last_metric_at: Field.summary({
      label: 'Last Snapshot',
      group: 'rollups',
      summaryOperations: { object: 'content_metric', field: 'period_end', function: 'max' },
    }),

    notes: Field.markdown({ label: 'Notes', group: 'meta' }),
  },

  enable: {
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['piece'] }, { fields: ['channel'] }, { fields: ['published_at'] }],

  titleFormat: tmpl`{{record.piece}} on {{record.channel}}`,
  compactLayout: ['piece', 'channel', 'published_at', 'total_views', 'total_signups'],
});
