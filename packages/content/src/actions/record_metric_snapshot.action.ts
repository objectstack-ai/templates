// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * record_metric_snapshot — manual action on a `content_publication`.
 * Inserts a `content_metric` row for the supplied period; the
 * `publication_rollup` flow then refreshes denormalised totals on the
 * publication and parent piece.
 *
 * Reflects how teams actually measure: copy/paste from GA / Mixpanel /
 * Stripe weekly, not a real-time stream.
 */

export interface RecordMetricInput {
  publicationId: string;
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  views?: number;
  clicks?: number;
  signups?: number;
  revenue?: number;
  source?: 'analytics' | 'product' | 'revenue' | 'native' | 'manual';
  note?: string;
}

export interface RecordMetricOutput {
  metricId: string;
}

export interface RecordMetricContext {
  loadPublication: (publicationId: string) => Promise<Record<string, unknown>>;
  createMetric: (values: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export async function recordMetricSnapshot(
  input: RecordMetricInput,
  ctx: RecordMetricContext,
): Promise<RecordMetricOutput> {
  // Validate publication exists; throws if missing.
  await ctx.loadPublication(input.publicationId);

  if (new Date(input.periodEnd) < new Date(input.periodStart)) {
    throw new Error('period_end must be on or after period_start.');
  }

  const metric = await ctx.createMetric({
    publication: input.publicationId,
    period_start: input.periodStart,
    period_end: input.periodEnd,
    views: input.views ?? 0,
    clicks: input.clicks ?? 0,
    signups: input.signups ?? 0,
    revenue: input.revenue ?? 0,
    source: input.source ?? 'manual',
    note: input.note ?? null,
  });

  return { metricId: String(metric.id ?? '') };
}

export const targetObjectName = 'content_publication';
