// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Assessment → Control roll-up.
 *
 * Copies the *latest completed* assessment's outcome onto its control:
 *   compliance_control.last_status      ← latest passed/partial/failed status
 *   compliance_control.last_assessed_at ← that assessment's assessed_at (epoch ms)
 *
 * This is a NON-aggregate cross-object roll-up ("most recent", not a sum/count),
 * so a native `summary` field cannot express it — the correct tool is a hook that
 * issues a nested `ctx.api` write to the parent control. That write used to crash
 * the QuickJS hook sandbox (`memory access out of bounds`, framework#1867), which
 * is why `last_status` / `last_assessed_at` were hand-maintained stored fields.
 * framework#1867 is fixed, so the roll-up is now live.
 *
 * IMPORTANT — body-only sandbox: only the handler's function body ships to
 * QuickJS at runtime; module-scope helpers are NOT in scope. Everything the
 * handler needs is therefore declared INSIDE the handler.
 *
 * Recompute strategy: on every assessment insert/update we re-derive the control
 * from ALL of its assessments (not just the changed row), so the control always
 * reflects the true latest outcome regardless of the order rows arrive in.
 *
 * Delete caveat: `afterDelete` receives only `{ id }` — no `control` FK — so it
 * cannot know which control to recompute (framework#1867's note). Deleting the
 * most-recent assessment therefore leaves `last_status` stale until the next
 * assessment on that control writes; assessments are effectively immutable audit
 * records, so this is an accepted edge, not a routine path.
 */
const assessmentRollupHook: Hook = {
  name: 'compliance_assessment_rollup',
  object: 'compliance_assessment',
  events: ['afterInsert', 'afterUpdate'],
  priority: 100,
  description: "Roll the latest completed assessment's result up onto its control.",
  handler: async (ctx: HookContext) => {
    const c = ctx as HookContext & {
      input?: Record<string, unknown>;
      result?: Record<string, unknown>;
      api?: {
        object: (name: string) => {
          find: (q: unknown) => Promise<Array<Record<string, unknown>>>;
          findOne: (q: unknown) => Promise<Record<string, unknown> | undefined>;
          update: (data: Record<string, unknown>, opts?: unknown) => Promise<unknown>;
        };
      };
    };
    const api = c.api;
    if (!api) return;

    // Resolve the changed assessment's control FK. Different lifecycle paths
    // expose the record under different keys (result / input / input.doc /
    // input.data), so probe all of them, then fall back to reading the row.
    const input = (c.input ?? {}) as Record<string, unknown>;
    const carriers = [c.result, input, input.doc, input.data].filter(
      (o): o is Record<string, unknown> => !!o && typeof o === 'object',
    );
    const pick = (key: string): unknown => {
      for (const o of carriers) {
        if (o[key] !== undefined && o[key] !== null) return o[key];
      }
      return undefined;
    };

    let controlId = pick('control') as string | undefined;
    const assessmentId = pick('id') as string | undefined;
    if (!controlId && assessmentId) {
      const row = await api.object('compliance_assessment').findOne({ where: { id: assessmentId } });
      controlId = (row?.control as string | undefined) ?? undefined;
    }
    if (!controlId) return;

    // Re-derive from all of the control's assessments: pick the completed one
    // (passed/partial/failed) with the greatest assessed_at.
    const rows = await api.object('compliance_assessment').find({ where: { control: controlId } });
    const toEpoch = (v: unknown): number | null => {
      if (v == null) return null;
      if (typeof v === 'number') return v;
      const p = Date.parse(String(v));
      return Number.isNaN(p) ? null : p;
    };
    let latest: Record<string, unknown> | null = null;
    let latestAt = -Infinity;
    for (const a of rows ?? []) {
      const s = a.status;
      if (s !== 'passed' && s !== 'partial' && s !== 'failed') continue;
      const at = toEpoch(a.assessed_at);
      if (at == null) continue;
      if (at > latestAt) {
        latestAt = at;
        latest = a;
      }
    }

    // The body-only sandbox exposes the engine-repo FACADE, whose single-record
    // update is `update(data, opts)` with the id carried in `data` (there is no
    // `updateById` here) — mirror the engine's own updateById recipe: id in the
    // payload AND a `where: { id }` scope.
    // `last_assessed_at` is a datetime field — it wants an ISO-8601 string, not
    // an epoch number. Normalise the (date-granular) assessed_at through Date.
    // The control's `is_overdue_for_review` formula coerces the datetime back to
    // epoch for its arithmetic, so an ISO string is the correct stored form.
    const patch = latest
      ? { last_status: latest.status, last_assessed_at: new Date(latestAt).toISOString() }
      : { last_status: 'not_tested', last_assessed_at: null };
    await api
      .object('compliance_control')
      .update({ id: controlId, ...patch }, { where: { id: controlId } });
  },
};

export default assessmentRollupHook;
export { assessmentRollupHook };
