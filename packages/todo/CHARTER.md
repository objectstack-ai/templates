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
| Multi-object schema with relationships | `project` → `task`, `task` ↔ `label` (junction) |
| State machine | `task.status`: `todo → doing → done` (+ `cancelled`) |
| Validation rules | due-date sanity, sub-task ownership |
| Workflow / flow | overdue notification, status-change side effects |
| Approval | high-priority tasks require lead approval |
| Sharing rule | project-level row sharing |
| Cube + Report | task throughput, overdue tasks |
| Dashboard | "My work" landing page |
| Pages & Views | list, kanban, record page with related lists |
| Permission set | `contributor` vs `lead` |
| i18n | English (single locale; this is a starter, fork to add) |
| Seed data | one demo project, a few tasks, two labels |

## What it deliberately does NOT do

- **No re-implementation of platform objects.** Comments, attachments, activity feed, users, teams, roles, audit logs, notifications, emails — all come from `sys_*` objects shipped by the platform. The template *uses* them via the polymorphic pattern (`parent_object` / `parent_id` or `thread_id = "{object}:{id}"`).
- **No tutorials.** The template assumes you already read the docs. Comments in code stay short.
- **No fictional "advanced" features** that aren't in `@objectstack/spec@5.2`. If the spec doesn't validate it, it doesn't ship.
- **No second locale.** Users fork-and-localize; multi-locale is demonstrated by `hotcrm`.
- **No fake AI flair.** Where AI helps a real workflow (e.g. summarise an overdue task), it appears as an `*.action.ts`. No "AI assistant" shells.

## Hard limits

These exist so the template stays a **template**, not a half-finished product:

| Metric | Cap | Rationale |
|---|---|---|
| Business objects | ≤ 4 (`project`, `task`, `label`, `task_label`) | Above this and it becomes a domain app |
| Total `.ts` LOC under `src/` | ≤ 2,500 | Readable in one sitting |
| Locales | 1 (`en`) | Forkable starting point |
| Dashboards | ≤ 2 | Demonstrates, doesn't overwhelm |
| Flows | ≤ 3 | Same |
| Approval processes | 1 | Same |
| Sharing rules | 1 | Same |
| Permission sets | 2 | `contributor` + `lead` |

If you find yourself exceeding any of these, the right move is to **fork into a new template** (e.g. `helpdesk`), not bloat `todo`.

## Relationship to other repos

- **`framework/examples/app-todo`** is downstream of this template: same code, copied in as the engine's CI fixture (with driver acceptance tests added). Updates flow: `templates/todo` → `framework/examples/app-todo`.
- **`hotcrm`** is the production reference (multi-cloud CRM, multi-locale, real domain) — not derived from this template.

## Versioning

Semver. Breaking changes to the schema bump the major. The template tracks the latest stable `@objectstack/*` minor.
