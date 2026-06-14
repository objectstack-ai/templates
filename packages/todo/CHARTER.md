# @objectlab/todo — Charter

> A template's purpose, scope, and self-imposed limits.

## What this template is

A **production-ready starter** for any team that needs to track work — tasks grouped by projects, optionally tagged with labels, optionally requiring approval, with audit trail, comments, attachments, and notifications.

It is the canonical *"hello world that isn't a toy"* for ObjectStack.

## Who it's for

- Engineering teams onboarding to ObjectStack who want a real-shaped app, not a single object
- Anyone scaffolding an internal tool that resembles "things to do, grouped somehow"

## What it demonstrates

| Capability | How |
|---|---|
| Object + lookup relationship | `task` with a multi-value `label` lookup |
| State machine | `task.status`: `todo → doing → done` (+ `cancelled`) |
| Validation rules | due-date sanity; urgent tasks require a due date |
| Workflow / flow | overdue notification (delta-guarded), assignment notification |
| Dashboard | "My work" landing page |
| Pages & Views | list, kanban, record page with related lists |
| Permission set | `contributor` vs `lead` |
| i18n | Multi-locale: English + 简体中文 + 日本語 + Español |
| Seed data | a set of demo tasks across states, plus labels |

> **Roadmap (not yet shipped):** a `project` grouping object, a `task_label`
> junction, an approval process for urgent tasks, and a project-scoped sharing
> rule. The schema and caps leave room for them; they are intentionally absent
> from the minimal starter. Earlier charter drafts described them as shipped —
> they are not.

## What it deliberately does NOT do

- **No re-implementation of platform objects.** Comments, attachments, activity feed, users, teams, roles, audit logs, notifications, emails — all come from `sys_*` objects shipped by the platform. The template *uses* them via the polymorphic pattern (`parent_object` / `parent_id` or `thread_id = "{object}:{id}"`).
- **No tutorials.** The template assumes you already read the docs. Comments in code stay short.
- **No fictional "advanced" features** that aren't in the spec. If the spec doesn't validate it, it doesn't ship.
- **No fake AI flair.** Where AI helps a real workflow (e.g. summarise an overdue task), it appears as an `*.action.ts`. No "AI assistant" shells.

## Hard limits

These exist so the template stays a **template**, not a half-finished product:

| Metric | Cap | Rationale |
|---|---|---|
| Business objects | ≤ 4 (`task`, `label` ship; `project` + `task_label` are roadmap, within cap) | Above this and it becomes a domain app |
| Total `.ts` LOC under `src/` | ≤ 2,500 | Readable in one sitting |
| Locales | 4 (`en`, `zh-CN`, `ja-JP`, `es-ES`) | Demonstrates the i18n bundle layout |
| Dashboards | ≤ 2 | Demonstrates, doesn't overwhelm |
| Flows | ≤ 3 | Same |
| Approval processes | ≤ 1 | Roadmap (none ship today) |
| Sharing rules | ≤ 1 | Roadmap (none ship today) |
| Permission sets | 2 | `contributor` + `lead` |

If you find yourself exceeding any of these, the right move is to **fork into a new template** (e.g. `helpdesk`), not bloat `todo`.

## Relationship to other repos

- **`framework/examples/app-todo`** is downstream of this template: same code, copied in as the engine's CI fixture (with driver acceptance tests added). Updates flow: `templates/todo` → `framework/examples/app-todo`.
- **`hotcrm`** is the production reference (multi-cloud CRM, multi-locale, real domain) — not derived from this template.

## Versioning

Semver. Breaking changes to the schema bump the major. The template tracks the latest stable `@objectstack/*` minor.
