# Roadmap

Planned work across the template collection. This file tracks what's **coming**;
each template's `README.md` describes what it does **today**. Keep the two in
sync — when a feature ships, move it from here into the template and its README.
If it's still a scaffold, it belongs here, not in present-tense marketing copy.

## AI

Several templates lead with AI in their pitch. The honest current state is mixed,
so it's tracked here as a plan rather than implied as delivered.

### Current state

| Template | AI surface | Status today |
|---|---|---|
| contracts | `extract_terms` — AI metadata extraction | **Real** — calls `api.openai.com` directly ([extract_terms.action.ts](../packages/contracts/src/actions/extract_terms.action.ts)). Dark without an `OPENAI_API_KEY`. |
| content | `draft_outline_from_topic`, `suggest_cta`, `summarize_competitor_signal` | **Real** — same raw OpenAI calls. Dark without a key. |
| helpdesk | ticket triage (`ai_summary` / `ai_category` / `ai_sentiment` / `ai_suggested_reply` / `ai_suggested_kb_ids`) | **Scaffold** — deterministic baseline (`ai_summary = description.slice(0, 280)`); [`ai_triage_on_create.flow.ts`](../packages/helpdesk/src/flows/ai_triage_on_create.flow.ts) is an "insert your LLM here" stub. |
| project | risk / delay / budget forecasting (`ai_*` fields) | **Scaffold** — the flow prediction node is labelled `STUB`; seed values are illustrative, not computed. |
| todo, expense, hr, compliance, procurement | — | No AI; deterministic by design. |

### Plan

1. **Route AI through the platform model registry, not raw `api.openai.com`.**
   Replace the direct `fetch()` calls (contracts, content) with ObjectStack's
   AI / model-registry services (see the `objectstack-ai` skill). Payoff:
   provider-agnostic (OpenAI, **Anthropic / Claude**, Bedrock, local), central
   key management, and it actually demonstrates the "AI-native" platform instead
   of bypassing it.

2. **Degrade honestly.** With no model configured, AI fields/actions should show
   an explicit "configure AI to enable" state — never a silent stub output
   (helpdesk's substring) or a failing network call (contracts/content without a
   key). A user must never mistake a placeholder for a prediction.

3. **Pick one AI flagship and finish it.** `helpdesk` is the best candidate:
   real triage → `ai_summary` / `ai_category` / `ai_sentiment` /
   `ai_suggested_reply`, plus embedding-based KB recall for `ai_suggested_kb_ids`,
   shipped end-to-end through (1) and (2). Let the others stay honest
   deterministic starters until each earns the same treatment.

4. **Stop shipping seeded numbers that look computed.** project's
   `ai_completion_probability` etc. are hand-authored demo values. Once (3)'s
   pattern exists, either compute them or keep them clearly marked as samples
   (the field group is now labelled "AI Predictions (scaffolded)").

## Non-AI

- **project** — Gantt rendering (schema ready, UI pending platform); resolve the
  scope overlap with `todo` (task-level vs portfolio-level).
- **content** — trim toward the starter charter; at 9 objects / ~5,200 `src` LOC
  it is over the ≤6 objects / ≤2,500 LOC budget in
  [TEMPLATE_GUIDE.md](../TEMPLATE_GUIDE.md).
- **Marketplace category facets** — labels render inconsistently (Title Case for
  some categories, lowercase for others). The fix belongs in the marketplace
  UI's category → label map, not in the template manifests (which all use
  lowercase slugs).
