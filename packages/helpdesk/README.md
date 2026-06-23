# @objectlab/helpdesk — AI-First Customer Support

> Customer support template that treats **AI as a first-class schema citizen**: triage, sentiment, suggested replies, and KB recall are native ticket fields. A deterministic baseline ships so it runs today — wire your LLM provider to make the AI fields smart.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/helpdesk)

## Run in the browser

Click the StackBlitz badge above to launch this template in a WebContainer. It uses `@objectstack/driver-sqlite-wasm` (sql.js) instead of `better-sqlite3`, which can't compile inside WebContainers. The `.stackblitzrc` sets `OS_DATABASE_DRIVER=sqlite-wasm` so the standalone stack picks the WASM driver automatically. The `packageManager` field pins **pnpm** so StackBlitz/Corepack uses pnpm (npm trips over the optional `better-sqlite3` dependency inside WebContainers).

## Why this template

| Most CRMs / helpdesks | This template |
|---|---|
| AI is a paid Macro / App | AI fields baked into the schema |
| KB suggestion = separate plugin | `ai_suggested_kb_ids` lives on the ticket |
| Sentiment available in "Premium" | `ai_sentiment` drives escalation flows out of the box |
| Customer portal = +$$$/seat | Same app, just a permission profile |
| Data is locked in vendor cloud | Open SQL, exportable, no lock-in |
| English-first, others bolt-on | en + zh-CN shipped; ja/ko trivial to add |

> **On the AI:** the rows above describe the *schema / architecture*. The `ai_*` behaviors ship as a deterministic baseline + flow scaffold — wire your LLM to populate them (see [Plugging in your LLM](#plugging-in-your-llm)).

## What's in the box

**6 objects**
- `helpdesk_ticket` — the centerpiece, **with AI fields native to the schema**
- `helpdesk_customer` — end-user contacts
- `helpdesk_team` — support queues (Tier 1 / Tier 2 / Billing / …)
- `helpdesk_message` — thread messages (inbound / outbound / internal note)
- `helpdesk_kb_article` — knowledge base
- `helpdesk_sla_policy` — first-response & resolution targets per priority

**AI fields on every ticket** (`ai_*`)
- `ai_summary` — TL;DR
- `ai_category` — bug / how-to / billing / outage / feature_request / feedback / other
- `ai_intent` — what the customer ultimately wants
- `ai_sentiment` — positive / neutral / frustrated / angry (drives escalation)
- `ai_priority_suggestion` — AI's recommendation, separate from human-set priority
- `ai_language` — BCP-47, drives reply language
- `ai_suggested_reply` — first-draft reply
- `ai_suggested_kb_ids` — recalled articles
- `ai_confidence` — 0-1; we route < 0.6 to human triage

**5 flows**
- `ai_triage_on_create` — stub that fills AI fields and advances `new → triaged`. **Replace the script body with your LLM provider call** — schema stays the same.
- `sla_first_response_warn` — alert assignee when first-response SLA is near
- `sla_resolution_breach` — auto-escalate + notify manager on miss
- `auto_close_resolved` — close resolved tickets after 7 days
- `escalate_angry_customer` — `ai_sentiment == angry` + high/urgent → escalate

**2 dashboards**
- Agent Workbench — your queue, breaches, angry customers, awaiting triage
- Manager Overview — volume, SLA, sentiment mix, category mix, channel mix

**4 roles / 3 permission profiles**
- `helpdesk_admin` → `helpdesk_manager` → `helpdesk_agent` (hierarchical)
- `helpdesk_customer` (portal user — sees only their own tickets)

## Plugging in your LLM

The `ai_triage_on_create` flow currently runs a stub. To wire up real AI:

1. Replace the `ai_triage` script node in `src/flows/ai_triage_on_create.flow.ts` with an HTTP call (OpenAI / Anthropic / Bedrock / Azure / 通义 / 文心 / Ollama).
2. Map provider output to the `ai_*` fields. Schema doesn't change.
3. Optionally add a vector-embedding step for true semantic KB recall (replace tag-based shortlist).

Cost guardrails: skip AI on tickets where `priority == 'low' && channel == 'feedback'`, or cap at N tickets/day per customer tier.

## Running

```bash
cd packages/helpdesk
pnpm install
pnpm dev      # http://localhost:4006
```

Default login: `admin` / `admin` (from platform). The seed data includes 9 tickets covering every status and sentiment, plus 6 KB articles and 4 SLA policies.

## What's NOT in this template (gaps documented in `framework/docs/PLATFORM_GAPS_FROM_TEMPLATES.md`)

- **No real notification delivery** (#1) — platform-side; flows fire but emails/IM don't go out yet.
- **No real LLM call** — by design; you bring your own (see "Plugging in your LLM").
- **No file attachment UI** (#3) — schema has `enable.files: true`; UX pending platform.
- **No multi-step approval / OOO / delegation** (#5) — escalation is single-step.
- **No conditional form fields** (#8) — agent sees the full form.
- **No print/PDF ticket export** (#9).

These are *platform* limitations — when they ship, this template gains them for free.

## Status

⚠️ **Reference implementation**, not production-grade. Demonstrates the AI-first design pattern. Fork and harden before shipping to customers.

## License

Apache-2.0
