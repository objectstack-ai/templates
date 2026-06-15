// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Risk automation hook — auto-id + computed priority (payload-only).
 *
 * `priority` is the classic impact × likelihood score (1–25) that drives the
 * risk register's sort and the "Critical" tab. It is computed here from the
 * manual impact/likelihood selects so the readonly number always reflects them.
 * Payload-only mutation — no nested writes (see pm_project.hook.ts).
 *
 * The handler runs body-only in the QuickJS sandbox, so the impact/likelihood
 * scale map is defined INSIDE the handler — a module-scope const is not in
 * scope at runtime and would throw ReferenceError on every insert.
 */
const riskHook: Hook = {
  name: 'pm_risk_automation',
  object: 'pm_risk',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Assign risk id and compute priority from impact × likelihood.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    const SCALE: Record<string, number> = {
      very_low: 1,
      low: 2,
      medium: 3,
      high: 4,
      very_high: 5,
    };

    if (event === 'beforeInsert' && !input.risk_id) {
      input.risk_id = `RISK-${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    const eff = (field: string) =>
      Object.prototype.hasOwnProperty.call(input, field) ? input[field] : previous?.[field];
    const impact = SCALE[String(eff('impact'))];
    const likelihood = SCALE[String(eff('likelihood'))];
    if (impact && likelihood) {
      input.priority = impact * likelihood;
    }
  },
};

export default riskHook;
export { riskHook };
