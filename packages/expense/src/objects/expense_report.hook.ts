// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Expense-Report automation hook — insert defaults + lifecycle timestamps.
 *
 * - beforeInsert: default status/total, auto-number (EXP-YYYYMMDD-XXXX).
 * - beforeUpdate: stamp submitted_at / approved_at / reimbursed_at on the
 *   matching status transition; clear reimbursement fields when reopened.
 *
 * NOTE — this hook only mutates the incoming `input` payload; it never issues a
 * nested `ctx.api` write. That is deliberate and required: hook bodies run in a
 * single shared QuickJS (asyncify) sandbox that permits only one suspended
 * async call at a time, so a hook that performs a *nested* engine write
 * re-enters the sandbox and crashes the process. See CHARTER.md
 * ("Rollup vs. lifecycle hooks") for why `expense_report.total_amount` is NOT
 * maintained by a cross-object rollup hook.
 */
const reportHook: Hook = {
  name: 'expense_report_automation',
  object: 'expense_report',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Normalize expense-report fields and stamp lifecycle timestamps.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    if (event === 'beforeInsert') {
      if (!input.status) input.status = 'draft';
      // total_amount is a live summary roll-up now — the engine computes it from
      // the report's lines; do not seed a header default here.
      if (!input.report_number) {
        const ts = new Date();
        const date = `${ts.getUTCFullYear()}${String(ts.getUTCMonth() + 1).padStart(2, '0')}${String(
          ts.getUTCDate(),
        ).padStart(2, '0')}`;
        const rand = Math.floor(Math.random() * 9000 + 1000);
        input.report_number = `EXP-${date}-${rand}`;
      }
      return;
    }

    // beforeUpdate — react to status transitions (payload mutation only).
    if (!previous) return;
    const nowIso = new Date().toISOString();
    const prevStatus = previous.status as string | undefined;
    const nextStatus = input.status as string | undefined;

    if (nextStatus && nextStatus !== prevStatus) {
      if (nextStatus === 'submitted' && input.submitted_at == null) {
        input.submitted_at = nowIso;
      }
      if (nextStatus === 'approved' && input.approved_at == null) {
        input.approved_at = nowIso;
      }
      if (nextStatus === 'reimbursed' && input.reimbursed_at == null) {
        input.reimbursed_at = nowIso;
      }
      // Reopening a rejected report — clear stale reimbursement data.
      if (nextStatus === 'draft' && prevStatus === 'rejected') {
        input.reimbursed_at = null;
        input.payment_reference = null;
      }
    }
  },
};

export default reportHook;
export { reportHook };
