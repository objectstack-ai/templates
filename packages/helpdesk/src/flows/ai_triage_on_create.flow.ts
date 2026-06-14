// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * AI Triage On Create — runs when a ticket is created (status == "new").
 *
 * The deterministic AI baseline (ai_summary / ai_category / ai_sentiment /
 * ai_priority_suggestion / ai_language / ai_confidence / ai_triage_at) is set
 * synchronously by `helpdesk_ticket.hook.ts` on insert, so every ticket has
 * populated `ai_*` fields even with no LLM wired up. This flow is the seam for
 * **richer** triage and routing on top of that baseline.
 *
 * To plug in a real LLM (OpenAI / Anthropic / Bedrock / Azure / 通义 / 文心):
 *   1. Add a `script` node before `set_status_triaged` that calls your provider
 *      (platform `services.http`) and updates the ticket with the response —
 *      same field shapes, so dashboards / automations / analytics don't change.
 *   2. Gate `set_status_triaged` on a confidence threshold (e.g. ≥ 0.6) to
 *      route low-confidence tickets to a human triage queue instead.
 *
 * After triage, the flow advances status: new → triaged.
 */
export const AITriageOnCreateFlow: Flow = {
  name: 'helpdesk_ai_triage_on_create',
  label: 'AI Triage on Ticket Create',
  description:
    'On new ticket, populate AI fields (category, sentiment, summary, suggested reply, KB recall) and advance to triaged.',
  type: 'record_change',

  variables: [{ name: 'ticketId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'helpdesk_ticket',
        triggerType: 'record-after-create',
        condition: 'status == "new"',
      },
    },
    // NOTE: the ai_* baseline is set by helpdesk_ticket.hook.ts on insert.
    // Insert your LLM `script` node here (see the file header) to enrich it.
    {
      id: 'set_status_triaged',
      type: 'update_record',
      label: 'Advance Status → triaged',
      config: {
        objectName: 'helpdesk_ticket',
        filter: { id: '{record.id}' },
        fields: { status: 'triaged' },
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'set_status_triaged', type: 'default' },
    { id: 'e2', source: 'set_status_triaged', target: 'end', type: 'default' },
  ],
};
