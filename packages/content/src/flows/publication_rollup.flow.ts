// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Publication rollup — keep `content_publication.total_*` columns in sync
 * with the underlying metric snapshots, and also bubble the totals up to
 * the parent `content_piece` so its dashboard/widget filters don't have
 * to join.
 *
 * Triggered on metric insert/update. The flow reads all metric rows for
 * the snapshot's publication, sums them, then writes back denormalised
 * totals on both the publication and (via a second step) the piece.
 *
 * Why denormalised: the analytics service in spec 5.2 doesn't allow
 * filtered SUM(child.*) from a parent list view. Storing totals on the
 * parent makes the editorial-calendar and ROI dashboards usable without
 * a cube round-trip.
 */
export const PublicationRollupFlow: Flow = {
  name: 'content_publication_rollup',
  label: 'Roll Up Metrics to Publication & Piece',
  description:
    'On metric snapshot insert/update, refresh the publication.total_* and piece.total_* denormalised fields.',
  type: 'record_change',

  variables: [{ name: 'metricId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'content_metric',
        criteria:
          'ISCHANGED(views) OR ISCHANGED(clicks) OR ISCHANGED(signups) OR ISCHANGED(revenue) OR ISNEW()',
      },
    },
    {
      id: 'get_metric',
      type: 'get_record',
      label: 'Load Metric',
      config: {
        objectName: 'content_metric',
        filter: { id: '{metricId}' },
        outputVariable: 'metric',
      },
    },
    {
      id: 'aggregate_publication',
      type: 'script',
      label: 'Sum Sibling Metrics',
      config: {
        objectName: 'content_metric',
        filter: { publication: '{metric.publication}' },
        aggregations: [
          { name: 'views_sum', type: 'sum', field: 'views' },
          { name: 'clicks_sum', type: 'sum', field: 'clicks' },
          { name: 'signups_sum', type: 'sum', field: 'signups' },
          { name: 'revenue_sum', type: 'sum', field: 'revenue' },
          { name: 'last_snapshot', type: 'max', field: 'period_end' },
        ],
        outputVariable: 'pubTotals',
      },
    },
    {
      id: 'update_publication',
      type: 'update_record',
      label: 'Update Publication Rollups',
      config: {
        objectName: 'content_publication',
        recordId: '{metric.publication}',
        values: {
          total_views: '{pubTotals.views_sum}',
          total_clicks: '{pubTotals.clicks_sum}',
          total_signups: '{pubTotals.signups_sum}',
          total_revenue: '{pubTotals.revenue_sum}',
          last_metric_at: '{pubTotals.last_snapshot}',
        },
      },
    },
    {
      id: 'get_publication',
      type: 'get_record',
      label: 'Reload Publication',
      config: {
        objectName: 'content_publication',
        filter: { id: '{metric.publication}' },
        outputVariable: 'publication',
      },
    },
    {
      id: 'aggregate_piece',
      type: 'script',
      label: 'Sum Sibling Publications',
      config: {
        objectName: 'content_publication',
        filter: { piece: '{publication.piece}' },
        aggregations: [
          { name: 'views_sum', type: 'sum', field: 'total_views' },
          { name: 'clicks_sum', type: 'sum', field: 'total_clicks' },
          { name: 'signups_sum', type: 'sum', field: 'total_signups' },
          { name: 'revenue_sum', type: 'sum', field: 'total_revenue' },
        ],
        outputVariable: 'pieceTotals',
      },
    },
    {
      id: 'update_piece',
      type: 'update_record',
      label: 'Update Piece Rollups',
      config: {
        objectName: 'content_piece',
        recordId: '{publication.piece}',
        values: {
          total_views: '{pieceTotals.views_sum}',
          total_clicks: '{pieceTotals.clicks_sum}',
          total_signups: '{pieceTotals.signups_sum}',
          total_revenue: '{pieceTotals.revenue_sum}',
        },
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_metric', type: 'default' },
    { id: 'e2', source: 'get_metric', target: 'aggregate_publication', type: 'default' },
    { id: 'e3', source: 'aggregate_publication', target: 'update_publication', type: 'default' },
    { id: 'e4', source: 'update_publication', target: 'get_publication', type: 'default' },
    { id: 'e5', source: 'get_publication', target: 'aggregate_piece', type: 'default' },
    { id: 'e6', source: 'aggregate_piece', target: 'update_piece', type: 'default' },
    { id: 'e7', source: 'update_piece', target: 'end', type: 'default' },
  ],
};
