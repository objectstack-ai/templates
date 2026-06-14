// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Contract automation hook — normalize fields on save, stamp the signed date,
 * and drive the date-based lifecycle transitions (activate on effective date,
 * expire on end date).
 *
 * The signed-date stamp and the activate/expire transitions previously lived
 * in object-level `workflows`, which is not a supported 7.x `ObjectSchema`
 * field (silently dropped at build → never ran). They live here now, and the
 * date comparisons are done in JS — sidestepping the CEL `date <=> timestamp`
 * type gap as a bonus.
 */
const contractHook: Hook = {
  name: 'contracts_contract_automation',
  object: 'contracts_contract',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Normalize contract fields and drive date-based lifecycle transitions.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    // Default status on insert
    if (event === 'beforeInsert' && !input.status) {
      input.status = 'draft';
    }

    // When kicked back from in_review to draft, clear stale signed_date.
    if (
      event === 'beforeUpdate' &&
      previous &&
      input.status === 'draft' &&
      previous.status === 'in_review'
    ) {
      input.signed_date = null;
    }

    // Stamp signed_date when the contract enters "signed" without one. (The
    // `signed_requires_signed_date` validation then passes — the stamp runs
    // before validations.)
    if (
      event === 'beforeUpdate' &&
      previous &&
      input.status === 'signed' &&
      previous.status !== 'signed' &&
      (input.signed_date ?? previous.signed_date) == null
    ) {
      input.signed_date = new Date().toISOString().slice(0, 10); // date-only
    }

    // Date-driven lifecycle. Faithful to the original `on_update` triggers:
    // re-evaluated whenever the record is written.
    if (event === 'beforeUpdate' && previous) {
      const status = (input.status ?? previous.status) as string;
      const startOfTodayMs = Date.parse(new Date().toISOString().slice(0, 10));

      // signed + effective date reached → active
      if (status === 'signed') {
        const eff = (input.effective_date ?? previous.effective_date) as string | null;
        if (eff != null && Date.parse(eff) <= startOfTodayMs) {
          input.status = 'active';
        }
      }

      // active + end date passed + not auto-renewing → expired
      if (status === 'active') {
        const end = (input.end_date ?? previous.end_date) as string | null;
        const autoRenew = (input.auto_renew ?? previous.auto_renew) as boolean | null;
        if (end != null && Date.parse(end) < startOfTodayMs && autoRenew === false) {
          input.status = 'expired';
        }
      }
    }

    // Stamp approved_at the moment an approver is first recorded.
    const prevApprover = previous?.approver ?? null;
    if (input.approver != null && prevApprover == null && input.approved_at == null) {
      input.approved_at = new Date().toISOString();
    }
    // Clear the stamp if the approver is removed.
    if (event === 'beforeUpdate' && input.approver === null) {
      input.approved_at = null;
    }

    // Auto-renew sanity: zero notice days are nonsensical; default 30.
    if (input.auto_renew === true && input.renewal_notice_days == null) {
      input.renewal_notice_days = 30;
    }
  },
};

export default contractHook;
export { contractHook };
