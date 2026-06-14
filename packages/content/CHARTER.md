# @objectlab/content — Charter

> A template's purpose, scope, and self-imposed limits.

## What this template is

A **content marketing engine** for a small marketing or growth team that has to
ship blog posts, social threads, newsletter issues, and the odd landing-page
update on a regular cadence — and wants the workflow, the analytics, and the
competitive signal capture in one place instead of glued across Notion +
Airtable + Google Sheets + Buffer.

It is the second canonical ObjectStack template after `todo` and the first one
that exercises ObjectStack on a non-trivial domain (≈ 9 objects, multi-state,
multi-dashboard).

## Who it's for

- A 1–5 person marketing / growth / DevRel team that owns the editorial calendar
- Solo creators who want pipeline → publish → measure in one place
- ObjectStack users who outgrew `todo` and want a richer reference for state
  machines, multi-tab views, dashboards with KPI cards, and seed data that
  actually tells a story

## What it demonstrates

| Capability | How |
|---|---|
| Mid-size schema (9 business objects) | topic → piece → publication → metric, plus competitor → signal → topic |
| Two state machines | `piece.status` (8 states), `signal.status` (3 states) |
| Multi-tab list views | content_piece: My Drafts / In Review / Scheduled / Published / Top Performers |
| Kanban auto-derived | piece.status select with colors → board view free |
| Polymorphic platform reuse | sys_comment / sys_attachment / sys_activity on piece, signal, topic |
| Approval process | piece → publication transition requires lead approval |
| Sharing rule | topic-level row sharing across the team |
| Cubes + reports | publication ROI, channel mix, weekly throughput |
| Three dashboards | Today Workbench, Editorial Calendar, ROI by channel |
| AI actions | summarize_competitor_signal, draft_outline_from_topic, suggest_cta |
| i18n | English + Simplified Chinese (zh-CN) — first multi-locale template |
| Seed data | 6 competitors, 8 topics, 12 signals, 14 pieces across all states, 10 publications with metrics |

## What it deliberately does NOT do

- **No CMS rendering.** This template manages the workflow and metadata of
  content. Where the rendered HTML lives (Webflow, Ghost, Sanity, MDX in a
  Next repo) is out of scope. Publications carry a `public_url` and that is
  the integration seam.
- **No social-network OAuth.** "Posted to LinkedIn" is recorded as a publication
  row; we don't ship platform SDK glue.
- **No re-implementation of platform objects.** Comments, attachments, activity
  feed, users, teams, roles, audit logs, notifications come from `sys_*`.
- **No AI assistant shell.** AI shows up only where it speeds a real step:
  summarizing a competitor signal, drafting an outline from a topic brief,
  suggesting a CTA variant. Three actions, no chatbot.
- **No second editorial workflow.** One state machine for `piece`. If your team
  needs a different one, fork.

## Hard limits

These exist so the template stays a **template**, not a half-finished product:

| Metric | Cap | Rationale |
|---|---|---|
| Business objects | ≤ 9 | Above this it is a domain app, not a starter |
| Total `.ts` LOC under `src/` | ≤ 6,000 | Readable in a half-day sitting |
| Locales | 2 (`en`, `zh-CN`) | Proves multi-locale without becoming a translation project |
| Dashboards | 3 | Today / Calendar / ROI — each shows a distinct widget class |
| Flows | ≤ 5 | Event-driven only (no cron in spec v6); time-based work ships as record actions. Cap raised 4→5 (2026-06): the package already ships five distinct event-driven flows — signal→topic promotion, CTA default, publish approval, publication rollup, and lifecycle notifications (the latter was renamed from `stamp_lifecycle_timestamps` once timestamp-stamping moved into the piece hook). |
| State machines | 2 | piece + signal |
| Approval processes | 1 | publish gate |
| Sharing rules | 1 | topic-scoped |
| Permission sets | 3 | viewer / contributor / lead |
| AI actions | 3 | summarize / outline / cta |

If a feature would push past a cap, fork into a new template (e.g.
`@objectlab/newsroom` for editorial-heavy, or `@objectlab/devrel` for
developer-relations specifics) rather than bloat this one.

## Relationship to other repos

- **Upstream of nothing yet** — this template is the seed.
- **Sibling to `todo`** — same architectural conventions; `content` is what
  `todo` looks like at 2.5× scale.

## Versioning

Semver. Schema-breaking changes bump the major. Tracks the latest stable
`@objectstack/*` minor.
