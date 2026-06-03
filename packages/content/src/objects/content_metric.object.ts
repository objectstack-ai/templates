// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Metric — a time-stamped reading for a publication. Weekly snapshot
 * cadence is the assumed pattern (cf. the seed data) but nothing in the
 * schema enforces it; record daily if you have the data.
 *
 * Why a standalone object (vs. a JSON blob on publication):
 *   - cube `publication_performance` becomes trivial — dims are real columns
 *   - charts and the ROI dashboard pull from this directly
 *   - history is preserved without trackHistory diffing JSON
 */
export const Metric = ObjectSchema.create({
  name: 'content_metric',
  label: 'Metric Snapshot',
  pluralLabel: 'Metric Snapshots',
  icon: 'bar-chart-2',
  description: 'A single-period performance reading for a publication.',

  fields: {
    publication: Field.lookup('content_publication', {
      label: 'Publication',
      required: true,
    }),
    period_start: Field.date({
      label: 'Period Start',
      required: true,
      description: 'Start of the window the reading covers (typically Monday of the ISO week).',
    }),
    period_end: Field.date({
      label: 'Period End',
      required: true,
    }),
    views: Field.number({ label: 'Views', scale: 0, min: 0, defaultValue: 0 }),
    clicks: Field.number({ label: 'Clicks', scale: 0, min: 0, defaultValue: 0 }),
    signups: Field.number({ label: 'Signups', scale: 0, min: 0, defaultValue: 0 }),
    revenue: Field.currency({ label: 'Attributed Revenue', defaultValue: 0 }),
    source: Field.select({
      label: 'Source',
      description: 'Where the numbers came from. Honest tagging beats fake precision.',
      options: [
        { label: 'GA / Plausible', value: 'analytics', color: '#3B82F6', default: true },
        { label: 'Mixpanel / Amplitude', value: 'product', color: '#10B981' },
        { label: 'Stripe / Revenue Tool', value: 'revenue', color: '#F59E0B' },
        { label: 'Platform Native', value: 'native', color: '#8B5CF6' },
        { label: 'Manual / Estimate', value: 'manual', color: '#6B7280' },
      ],
    }),
    note: Field.text({
      label: 'Note',
      maxLength: 200,
      description: 'Optional one-liner (e.g. "spike from podcast mention").',
    }),
  },

  enable: {
    apiEnabled: true,
    trash: true,
  },

  indexes: [{ fields: ['publication'] }, { fields: ['period_start'] }, { fields: ['period_end'] }],

  titleFormat: tmpl`{{record.publication}} — {{record.period_start}}`,
  compactLayout: ['publication', 'period_start', 'period_end', 'views', 'signups', 'revenue'],
});
