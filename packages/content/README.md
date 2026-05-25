# @template/content

**Content marketing engine on ObjectStack.**

> Capture a competitor signal → promote it into a topic → draft a piece →
> route through review and approval → schedule → publish → record metrics →
> roll up channel ROI. One template, 9 objects, two state machines, and a
> dashboard for each role (today / lead / exec).

[![Status: v0](https://img.shields.io/badge/status-v0-blue.svg)](./CHARTER.md)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](../../LICENSE)

---

## Why this exists

If your content team currently runs on Notion + Airtable + a half-dozen
spreadsheets, this template gives you the **80% that actually matters**:

- A single editorial calendar that knows what's scheduled, in review, and overdue
- A signal inbox that captures competitor moves / customer quotes / search
  trends before they're lost in Slack
- A piece object with an 8-state lifecycle (`idea → drafting → in_review →
  approved → scheduled → published → archived`, plus `blocked`) and an
  approval gate at `in_review → approved`
- Channel-level ROI rollups (views / clicks / signups / revenue) so you can
  finally answer "is the newsletter worth it?"
- An AI-action skeleton for the three things people most want LLMs to do
  here: summarise a signal, draft an outline from a topic, suggest a CTA

It is deliberately opinionated. Fork it.

---

## Quick start

```bash
pnpm install
pnpm --filter @template/content dev   # http://localhost:4008
```

Open the URL, finish `_account/setup` (create the first owner), then click
**Content Ops (内容运营)** on the home screen. The landing dashboard is
**Today's Workbench**; switch via the sidebar to **Editorial Calendar** or
**Channel ROI**.

Reset the local DB:

```bash
rm -rf packages/content/.objectstack
```

---

## What's in the box

| | Count |
|---|---|
| Business objects | 9 (`piece`, `topic`, `signal`, `competitor`, `channel`, `publication`, `metric`, `cta`, `template`) |
| State machines | 2 (`piece.status` 8-state, `signal.status` 3-state) |
| Approvals | 1 (`publish_approval`: gates `in_review → approved`) |
| Flows | 4 (signal → topic, default CTA, publication rollup placeholder, lifecycle timestamps) |
| Dashboards | 3 (Today's Workbench / Editorial Calendar / Channel ROI) |
| App | 1 (Content Ops, 7 nav items) |
| Views | 7 (incl. kanban on `piece.status`, calendar by `publish_at`) |
| Profiles | 3 (`viewer` / `contributor` / `lead`) |
| Sharing rules | 1 (criteria-based on `topic.visibility == "team"`) |
| AI actions | 3 stubs (`summarize_competitor_signal`, `draft_outline_from_topic`, `suggest_cta`) |
| Manual actions | 2 (`publish_now`, `record_metric_snapshot`) |
| Locales | 2 (`en`, `zh-CN`) |
| Seed | 6 competitors · 5 channels · 3 templates · 12 signals · 8 topics · 14 pieces (all states) · 4 publications · ~21 metrics · 14 CTAs |

Total: ~5,500 LOC. Read the CHARTER + SPEC for the design rationale.

---

## The five common changes (and where to make them)

| You want to… | Edit |
|---|---|
| Add a custom field on a piece (e.g. `seo_keywords`) | `src/objects/content_piece.object.ts` |
| Add a new piece state | `src/objects/content_piece.state.ts` (state machine) + translation files |
| Change who approves publishing | `src/approvals/publish_approval.approval.ts` → `signoffs[].role` |
| Add a new channel kind (e.g. `discord`) | `src/objects/content_channel.object.ts` → `kind` select + translations |
| Wire your own LLM for AI actions | `src/actions/summarize_competitor_signal.action.ts` (et al.) |

---

## The AI action stubs

Three files under `src/actions/` follow the same pattern as
`@template/contracts/src/actions/extract_terms.action.ts`:

- `summarize_competitor_signal` — given a captured signal, produces a
  one-paragraph TL;DR and suggests a topic angle.
- `draft_outline_from_topic` — given a topic + reference templates,
  produces a piece outline (H2/H3 + bullets).
- `suggest_cta` — given a piece, recommends 1–3 CTAs from the catalogue
  matched to the piece's funnel stage.

Each ships as a function with a typed `input` / `output` contract. The
prompt and model selection live in the file — edit them. At v0 the
actions are **not** registered with `defineStack({ actions: [...] })`
(the binding API stabilises in `@objectstack/spec 5.3`); for now, invoke
them from a flow `script` node, a custom REST handler, or an MCP tool
definition.

---

## What this template is NOT

See [CHARTER.md](./CHARTER.md) for the full non-goals list. Headlines:

- ❌ No WYSIWYG editor or block editor (write in your CMS of choice; link the
  draft URL on `piece.draft_url`)
- ❌ No publishing pipeline (no Ghost / Webflow / Hubspot push — the
  `publish_now` action is a stub that flips status and stamps `published_at`)
- ❌ No analytics ingestion (GA / Plausible / Fathom) — the `record_metric_snapshot`
  action accepts the numbers; the integration that *fills* them is yours
- ❌ No social distribution (no LinkedIn / Twitter API calls; record the
  publication URL after you post)
- ❌ No content-brief AI (the action stubs are slim on purpose)

If you need any of those at production grade, see "Template vs Product" in
the charter.

---

## Known v0 caveats

- The `publication_rollup` flow uses a `script` node placeholder; until the
  spec adds an `aggregate` flow node, the seed pre-populates
  `publication.total_views` etc. directly. Editing a metric will *not*
  automatically refresh the parent publication's totals.
- Today's Workbench KPI tiles filter on `assignee == {current_user_id}`; the
  seed does not assign pieces to any specific user, so the tiles show `0`
  on a fresh install. Assign yourself to a piece to see them populate.
- The chart x-axis on the Channel ROI signups trend renders raw timestamps;
  format with `chartConfig.xAxisFormat` once your dataset is real.

---

## License

Apache-2.0
