// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Project automation hook — auto-code + derived health (payload-only).
 *
 * - beforeInsert: assign a human-readable `code` (PRJ-NNNN) when missing and
 *   seed an initial `health`.
 * - beforeUpdate: re-derive `health` (RAG) from the AI risk score, schedule,
 *   and lifecycle status so list/board views and the PMO dashboard can filter
 *   and group on a single signal.
 *
 * NOTE — this hook only mutates the incoming `input` payload; it never issues a
 * nested `ctx.api` write. Hook bodies share one QuickJS (asyncify) sandbox that
 * permits a single suspended async call, so a nested engine write crashes the
 * process. That is why `progress_percent` / `actual_cost` (which would need a
 * cross-object rollup from milestones / timesheets) are stored fields kept in
 * sync by seed/client, not by this hook.
 *
 * IMPORTANT — the handler runs **body-only** in the QuickJS sandbox: only the
 * function body ships, so module-scope helpers are NOT in scope at runtime.
 * `deriveHealth` is therefore defined INSIDE the handler. (A top-level helper
 * threw `ReferenceError: deriveHealth is not defined` and silently failed every
 * insert — caught in runtime testing, not by the build.)
 */
const projectHook: Hook = {
  name: 'pm_project_automation',
  object: 'pm_project',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Assign project code and derive RAG health from risk + schedule.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    const deriveHealth = (
      status: unknown,
      riskScore: unknown,
      plannedEnd: unknown,
      actualEnd: unknown,
    ): 'on_track' | 'at_risk' | 'off_track' => {
      if (status === 'completed' || status === 'cancelled') return 'on_track';
      if (typeof plannedEnd === 'string' && !actualEnd) {
        const due = Date.parse(plannedEnd);
        if (!Number.isNaN(due) && due < Date.now()) return 'off_track';
      }
      const score = typeof riskScore === 'number' ? riskScore : Number(riskScore);
      if (!Number.isNaN(score) && score >= 70) return 'off_track';
      if (status === 'at_risk') return 'at_risk';
      if (!Number.isNaN(score) && score >= 40) return 'at_risk';
      return 'on_track';
    };

    if (event === 'beforeInsert') {
      if (!input.code) {
        input.code = `PRJ-${Math.floor(Math.random() * 9000 + 1000)}`;
      }
      input.health = deriveHealth(
        input.status,
        input.ai_risk_score,
        input.planned_end_date,
        input.actual_end_date,
      );
      return;
    }

    // beforeUpdate — re-derive health from the effective (merged) values.
    const eff = (field: string) =>
      Object.prototype.hasOwnProperty.call(input, field) ? input[field] : previous?.[field];
    input.health = deriveHealth(
      eff('status'),
      eff('ai_risk_score'),
      eff('planned_end_date'),
      eff('actual_end_date'),
    );
  },
};

export default projectHook;
export { projectHook };
