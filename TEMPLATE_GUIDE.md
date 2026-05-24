# Template Author Guide

A practical reference for **building or extending a template**. Read this before opening a "new template" proposal.

## What a template is (and isn't)

A template is **a starter**, not a product.

| ✅ A template should be | ❌ A template should NOT be |
|---|---|
| Bootable with `pnpm dev` in < 30s | A reference implementation of every framework feature |
| Understandable in one sitting (< 2500 LOC) | A multi-app monorepo |
| Opinionated about one domain (tasks, tickets, POs) | Domain-agnostic / generic |
| Production-shaped (state machines, permissions, i18n) | Sample-only / throwaway |
| Easy to delete what you don't want | Tightly coupled across files |

If users have to **read** more than they **delete**, the template is too big.

## Hard limits (charter)

Every template ships a `CHARTER.md` declaring its budget. Defaults:

| Dimension | Default cap | Notes |
|---|---|---|
| Objects | ≤ 6 | Including junctions |
| LOC (`src/`) | ≤ 2500 | Excluding generated artifacts |
| Locales at v0 | 1 (`en`) | More can be added in user fork |
| Apps | 1 | Single navigation tree |
| Pages | ≤ 3 | Detail layouts |
| Views | ≤ 4 | Lists + 1 kanban / table |
| Dashboards | 1 | "My Work" style |
| Reports | ≤ 3 | |
| Flows | ≤ 3 | Includes overdue / assignment / SLA |
| Approvals | ≤ 1 | |
| Sharing rules | ≤ 2 | |
| Profiles | 2 | Contributor + Lead, typically |
| Custom hooks | ≤ 4 | Prefer state-machine actions / declarative |

PRs may raise a cap with justification, but the bar is **"this is impossible without it"**, not **"this is nicer"**.

## File suffix protocol

| Suffix | Purpose | Validates against |
|---|---|---|
| `*.object.ts` | Data model | `ObjectSchema` (`@objectstack/spec/data`) |
| `*.state.ts` | State machine config (separate file when reused) | `StateMachineSchema` (`@objectstack/spec/automation`) |
| `*.hook.ts` | Server-side before/after triggers | `HookSchema` |
| `*.action.ts` | API endpoint / AI tool | `ActionSchema` |
| `*.view.ts` | List / kanban / table config | `ViewSchema` (`@objectstack/spec/ui`) |
| `*.page.ts` | Detail page layout | `PageSchema` (`@objectstack/spec/ui`) |
| `*.form.ts` | Form view | `FormViewSchema` |
| `*.dashboard.ts` | Dashboard | `DashboardSchema` |
| `*.report.ts` | Report definition | `ReportSchema` |
| `*.flow.ts` | Automation flow | `FlowSchema` (`@objectstack/spec/automation`) |
| `*.approval.ts` | Approval process | `ApprovalProcessSchema` |
| `*.sharing.ts` | Sharing rule | `SharingRuleSchema` (`@objectstack/spec/security`) |
| `*.profile.ts` | Permission set | `PermissionSetSchema` |
| `*.app.ts` | App / navigation | `AppSchema` |

All names are `snake_case`. No prefix injection: the name in the file = the name at runtime = the name in the DB = the name in the URL.

## Authoring sequence

Always build in this order — earlier layers are dependencies of later layers:

1. **Charter** (`CHARTER.md`) — decide scope first, write it down.
2. **Objects** (`*.object.ts`) — schema is the source of truth. Use the most specific `Field.*` available; rely on platform `enable: { feeds, files, activities, trackHistory }` instead of rolling your own.
3. **State machines** (`*.state.ts`) — if any object has lifecycle, wire it here. Stamp `started_at` / `completed_at` via flow on transition.
4. **Hooks** (`*.hook.ts`) — only when state machines / declarative options can't express it.
5. **Views & pages** (`*.view.ts`, `*.page.ts`) — at least one kanban if there's a state machine.
6. **Reports + dashboard** — one "My Work" landing page minimum.
7. **Flows** — overdue, assignment notification, SLA.
8. **Approvals** — only if the domain genuinely needs one.
9. **Sharing rules + profiles** — at least Contributor and Lead.
10. **Translations** — `en` mandatory; cover every object label, field label, picklist option, view label, navigation label.
11. **Seed data** (`src/data/index.ts`) — one project / customer / ticket etc. so a fresh checkout has something to look at. Use `defineDataset(Schema, { mode: 'upsert', externalId, records })`.
12. **App** (`*.app.ts`) — wire navigation groups (Work / Admin / Reports / Approvals).
13. **README** — for the **end user**, not the contributor. What is it? How do I run it? What can I change?

## Platform polymorphic services (use, don't reinvent)

| You want | Platform answer | How to enable |
|---|---|---|
| Comments on records | `sys_comment` | `enable: { feeds: true }` on object |
| File attachments | `sys_attachment` | `enable: { files: true }` |
| Activity timeline | `sys_activity` | `enable: { activities: true }` |
| Field-level audit | `sys_audit_log` | `enable: { trackHistory: true }` |
| Trash / undelete | `sys_trash` | `enable: { trash: true }` (default on) |
| Recently viewed | `sys_mru` | `enable: { mru: true }` (default on) |
| Email send | `sys_email` service | call from flow `script` node |
| In-app notifications | `sys_notification` | call from flow `script` node |
| User picklist | `Field.lookup('user')` | platform `user` object |
| Org / tenant scoping | automatic | every record gets `organization_id` |

If you find yourself defining a `comment` object: stop, use `feeds: true`.

## Schema validation gotchas

These bit us in the `todo` template — avoid them:

1. `translations` on the stack expects `TranslationBundle[]` — an array of `{ [locale]: TranslationData }`. Not `Object.values(...)`.
2. `data` field expects an array of `defineDataset(...)` results, not a record/dict.
3. Approval `rejectionBehavior` enum: `'reject_process' | 'back_to_previous'` only.
4. Dashboard widgets: use `'table'` (not `'list'`); table widgets require `aggregate`.
5. `Field.text` uses `description`, not `help`.
6. `Field.summary` shape: `{ summaryOperations: { object, field, function } }`.
7. Kanban view: key is `groupByField` (not `groupBy`); subfields are `{ groupByField, columns }`.
8. Report `filter` is MongoDB-style: `{ field: value }` or `{ field: { $op: value } }`.
9. `owner` and similar user-lookup fields should be **optional** — the platform fills via `created_by` and ownership rules. Marking them `required` forces the UI to expose a picker the user shouldn't need.
10. Seed records that lookup parents via external key require the parent's `externalId` field to be `unique: true`.

## Ports

| Range | Owner |
|---|---|
| 3000–3002 | `framework/` engine + studio |
| 4001 | `hotcrm/` production reference |
| 4002+ | templates (one port per template) |

Allocate the next free port and document it in the template's `README.md`.

## Definition of done

Before opening a PR adding a new template:

- [ ] `pnpm typecheck` passes
- [ ] `pnpm --filter @template/<name> dev` boots without errors
- [ ] First-run flow works (`_account/setup` → console → app launcher → list view → create record)
- [ ] Seed data visible in at least one list
- [ ] Studio (`/_studio/<namespace>`) shows all metadata categories
- [ ] CHARTER.md committed
- [ ] README.md targets end users
- [ ] Entry added to root README template table
- [ ] CHANGELOG.md entry
