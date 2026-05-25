// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Rollup hooks — propagate metric numbers up the chain:
 *
 *     metric  ──afterInsert──▶  publication.total_*   (delta-add)
 *     metric  ──afterUpdate──▶  publication.total_*   (delta-add: new − old)
 *     publication ──afterUpdate──▶  piece.total_*     (delta-add: new − old)
 *
 * The previous design used a `flow` with an `aggregate` node; that node type
 * isn't in the v6 spec yet, so we do the rollup as a pair of `afterInsert`
 * + `afterUpdate` hooks using delta arithmetic. Cheaper than a full
 * re-aggregation on every write.
 *
 * Idempotency: the delta approach is exact for inserts and updates. Deletes
 * are intentionally not mirrored — metric deletes should be rare and
 * audited. If your fork supports metric deletes, add an `afterDelete` that
 * subtracts the deleted record's values.
 */

interface DataServices {
  services?: {
    data?: {
      get(object: string, id: string): Promise<Record<string, unknown> | null>;
      update(object: string, id: string, values: Record<string, unknown>): Promise<void>;
    };
  };
}

const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

const metricRollupHook: Hook = {
  name: 'content_metric_rollup',
  object: 'content_metric',
  events: ['afterInsert', 'afterUpdate'],
  priority: 100,
  description: 'Roll metric snapshots up into publication totals (delta).',
  handler: async (ctx: HookContext) => {
    const { event, input, previous, services } = ctx as HookContext & DataServices & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };
    if (!services?.data) return;

    const pubId = (input.publication ?? previous?.publication) as string | undefined;
    if (!pubId) return;

    const dViews =
      event === 'afterInsert'
        ? num(input.views)
        : num(input.views) - num(previous?.views);
    const dClicks =
      event === 'afterInsert'
        ? num(input.clicks)
        : num(input.clicks) - num(previous?.clicks);
    const dSignups =
      event === 'afterInsert'
        ? num(input.signups)
        : num(input.signups) - num(previous?.signups);
    const dRevenue =
      event === 'afterInsert'
        ? num(input.revenue)
        : num(input.revenue) - num(previous?.revenue);

    if (!dViews && !dClicks && !dSignups && !dRevenue && event !== 'afterInsert') return;

    const pub = await services.data.get('content_publication', pubId);
    if (!pub) return;

    const snapshotAt = (input.period_end as string | undefined) ?? new Date().toISOString();
    const prevSnapshot = pub.last_metric_at as string | undefined;
    const nextSnapshot = !prevSnapshot || snapshotAt > prevSnapshot ? snapshotAt : prevSnapshot;

    await services.data.update('content_publication', pubId, {
      total_views: num(pub.total_views) + dViews,
      total_clicks: num(pub.total_clicks) + dClicks,
      total_signups: num(pub.total_signups) + dSignups,
      total_revenue: num(pub.total_revenue) + dRevenue,
      last_metric_at: nextSnapshot,
    });
  },
};

const publicationRollupHook: Hook = {
  name: 'content_publication_rollup',
  object: 'content_publication',
  events: ['afterUpdate'],
  priority: 100,
  description: 'Roll publication totals up into piece totals (delta).',
  handler: async (ctx: HookContext) => {
    const { input, previous, services } = ctx as HookContext & DataServices & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };
    if (!services?.data) return;

    const pieceId = (input.piece ?? previous?.piece) as string | undefined;
    if (!pieceId) return;

    const dViews = num(input.total_views) - num(previous?.total_views);
    const dClicks = num(input.total_clicks) - num(previous?.total_clicks);
    const dSignups = num(input.total_signups) - num(previous?.total_signups);
    const dRevenue = num(input.total_revenue) - num(previous?.total_revenue);

    if (!dViews && !dClicks && !dSignups && !dRevenue) return;

    const piece = await services.data.get('content_piece', pieceId);
    if (!piece) return;

    await services.data.update('content_piece', pieceId, {
      total_views: num(piece.total_views) + dViews,
      total_signups: num(piece.total_signups) + dSignups,
    });
  },
};

export { metricRollupHook, publicationRollupHook };
