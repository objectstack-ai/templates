// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * AI Triage On Create — runs when a ticket is created (status == "new").
 *
 * In this template the AI step is a **stub** that sets sensible defaults:
 *   - ai_category = "other"
 *   - ai_sentiment = "neutral"
 *   - ai_priority_suggestion = priority (echoed)
 *   - ai_language = customer.locale (or "en")
 *   - ai_summary = first 280 chars of description
 *   - ai_suggested_reply = templated acknowledgement
 *   - ai_suggested_kb_ids = []
 *   - ai_confidence = 0.5
 *   - ai_triage_at = now()
 *
 * To plug in a real LLM (OpenAI / Anthropic / Bedrock / Azure / 通义 / 文心):
 *   1. Replace the `ai_triage` script node body with an HTTP call to your
 *      provider (use platform `services.http` or a custom hook).
 *   2. Map provider output to the same fields — schema doesn't change.
 *   3. Adjust the `criteria` / `set_status_triaged` thresholds for
 *      auto-triage vs human-triage routing (we use ai_confidence ≥ 0.6).
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
        criteria: 'status == "new"',
        criteriaDialect: 'cel',
        triggerOn: 'create',
      },
    },
    {
      id: 'ai_triage',
      type: 'script',
      label: 'AI Triage (STUB — replace with LLM call)',
      config: {
        // Stub: defaults that look reasonable on a fresh seed.
        // Production: call your LLM provider here, return structured JSON.
        actionType: 'invoke_function',
        functionName: 'helpdesk.aiTriageStub',
        inputs: { ticketId: '{ticketId}' },
        // The stub function (or your LLM wrapper) is expected to update
        // the ticket record directly with ai_* fields.
      },
    },
    {
      id: 'set_status_triaged',
      type: 'update_record',
      label: 'Advance Status → triaged',
      config: {
        objectName: 'helpdesk_ticket',
        recordId: '{ticketId}',
        values: { status: 'triaged' },
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'ai_triage', type: 'default' },
    { id: 'e2', source: 'ai_triage', target: 'set_status_triaged', type: 'default' },
    { id: 'e3', source: 'set_status_triaged', target: 'end', type: 'default' },
  ],
};
