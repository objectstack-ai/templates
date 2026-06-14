# Helpdesk Template Charter

## Mission
Ship a customer-support template where **AI is the product**, not an add-on. Make the "AI-as-core-citizen" pattern obvious so other templates inherit it.

## Non-goals (v0.1)
- Real LLM integration (template ships with a stub — see README "Plugging in your LLM")
- Voice / phone integration
- Live chat widget (we model the ticket; the widget is a fork)
- Customer satisfaction surveys (modeled as `csat_score` field; delivery is platform)
- Vector-embedding KB recall (tag-based for now)

## Constraints
- 6 objects (one above the typical 4-object CHARTER — justified: tickets / messages / customers / KB / teams / SLA is the minimum credible support model)
- 5 flows (capped for readability)
- 2 dashboards (agent + manager)
- 2 locales out of box (en, zh-CN); structure supports ja/ko trivially
- All AI integrations are *replaceable*: schema is the contract.

## Source-of-truth fields (do NOT rename without ADR)
- `helpdesk_ticket.name` — subject; also lookup display
- `helpdesk_ticket.ai_*` — AI-populated; shape is the LLM-vendor contract
- `helpdesk_customer.email` — unique external id; used for ticket → customer matching

## Open questions
- Should `ai_suggested_kb_ids` move to a junction object once we add usage scoring?
- Where do we draw the line between `helpdesk_message` and platform `comments`?
- Customer portal: same app + sharing rule, or separate `apps/helpdesk_portal.app.ts`?

## Definition of "good enough" to ship v0.1
- [x] All 6 objects + state machines compile
- [x] Seed data exercises every dashboard widget
- [x] Typecheck clean
- [x] Build clean (`objectstack build`)
- [ ] Dev server boots on :4006
- [x] Agent Workbench renders metrics + tables with real data
- [x] Ticket detail page renders AI fields visibly (set by the insert hook on every ticket)

## Runtime triage model (v0.1)
The `ai_*` baseline is populated **synchronously by `helpdesk_ticket.hook.ts`**
on insert — every ticket is numbered, SLA-dated, and AI-triaged (deterministic
stub) even with no LLM wired. `ai_triage_on_create.flow.ts` is the seam to
enrich that baseline with a real provider. (Earlier drafts referenced a
`helpdesk.aiTriageStub` function that was never defined; the hook replaces it.)
