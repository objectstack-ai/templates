// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Ticket automation hook (payload-only — no nested writes).
 *
 * beforeInsert makes a freshly-created ticket immediately usable:
 *   - `ticket_number` — auto-assigned (TIC-YYYYMMDD-NNNN) so the required/
 *     unique field never blocks creation from the agent UI or the portal.
 *   - SLA due dates — `first_response_due_at` / `resolution_due_at` derived
 *     from priority using the same default minutes as `helpdesk_sla_policy`.
 *     (A fork can read the customer's actual policy; cross-object reads are a
 *     fork concern, so the defaults live here to keep the hook payload-only.)
 *   - AI triage baseline — the deterministic stub the charter promises: the
 *     `ai_*` fields are populated on every ticket so "AI is the product" is
 *     true at runtime, not just in seed data. Replace with a real LLM call in
 *     `ai_triage_on_create.flow.ts` for richer triage; the field shapes stay.
 *
 * beforeUpdate stamps `resolved_at` when a ticket reaches the resolved status.
 *
 * IMPORTANT — the handler runs body-only in the QuickJS sandbox, so the SLA
 * minute maps are defined INSIDE the handler. Module-scope consts are not in
 * scope at runtime and throw ReferenceError when referenced (only bites tickets
 * created without pre-set SLA fields — e.g. from the UI/portal; seed rows
 * pre-fill them and skip the lookup).
 */
const ticketHook: Hook = {
  name: 'helpdesk_ticket_automation',
  object: 'helpdesk_ticket',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Auto-number, derive SLA due dates, seed AI triage baseline, stamp resolved_at.',
  handler: async (ctx: HookContext) => {
    const { event, input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    // First-response / resolution targets in minutes (mirror the SLA policy
    // defaults), keyed by ticket priority.
    const FIRST_RESPONSE_MIN: Record<string, number> = {
      low: 1440,
      normal: 480,
      high: 120,
      urgent: 30,
    };
    const RESOLUTION_MIN: Record<string, number> = {
      low: 10080,
      normal: 2880,
      high: 1440,
      urgent: 240,
    };

    if (event === 'beforeInsert') {
      if (!input.ticket_number) {
        const ts = new Date();
        const date = `${ts.getUTCFullYear()}${String(ts.getUTCMonth() + 1).padStart(2, '0')}${String(
          ts.getUTCDate(),
        ).padStart(2, '0')}`;
        const rand = Math.floor(Math.random() * 9000 + 1000);
        input.ticket_number = `TIC-${date}-${rand}`;
      }

      const priority = (input.priority as string) || 'normal';
      const now = Date.now();
      if (input.first_response_due_at == null) {
        const mins = FIRST_RESPONSE_MIN[priority] ?? FIRST_RESPONSE_MIN.normal;
        input.first_response_due_at = new Date(now + mins * 60000).toISOString();
      }
      if (input.resolution_due_at == null) {
        const mins = RESOLUTION_MIN[priority] ?? RESOLUTION_MIN.normal;
        input.resolution_due_at = new Date(now + mins * 60000).toISOString();
      }

      // AI triage baseline (deterministic stub — replace with an LLM in the flow).
      if (input.ai_triage_at == null) {
        if (input.ai_summary == null) {
          input.ai_summary = String(input.description ?? '').slice(0, 280);
        }
        if (input.ai_category == null) input.ai_category = 'other';
        if (input.ai_sentiment == null) input.ai_sentiment = 'neutral';
        if (input.ai_priority_suggestion == null) input.ai_priority_suggestion = priority;
        if (input.ai_language == null) input.ai_language = 'en';
        if (input.ai_confidence == null) input.ai_confidence = 0.5;
        if (input.ai_suggested_kb_ids == null) input.ai_suggested_kb_ids = [];
        input.ai_triage_at = new Date().toISOString();
      }
      return;
    }

    // beforeUpdate — stamp resolved_at on resolution.
    if (!previous) return;
    const status = (input.status ?? previous.status) as string;
    const resolvedAt = input.resolved_at ?? previous.resolved_at;
    if (status === 'resolved' && resolvedAt == null) {
      input.resolved_at = new Date().toISOString();
    }
  },
};

export default ticketHook;
export { ticketHook };
