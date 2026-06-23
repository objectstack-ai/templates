# Changelog

All notable changes to this repository are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Upgraded all templates to `@objectstack/* ^10.2.0` (from `^10.0.0`).** Bumped
  every package's deps and the workspace `minimumReleaseAgeExclude` pins. 10.2 is a
  non-breaking minor — a full sweep of every `@objectstack/*@10.2.0` release found
  **zero** Major/BREAKING changesets. The two additive features need no template
  change: `@objectstack/lint` is extracted into its own public package (ADR-0019 P3
  — the build-time `validateStackExpressions`/`validateWidgetBindings` validators
  now ship as `(stack) => Finding[]` for reuse by `os validate`/`compile` and AI
  authoring; pure move, no behavior change), and `responsiveStyles` is added to the
  UI page-component envelope (ADR-0065 SDUI scoped styling). Verified end-to-end
  against the composed `all` env (9 apps, 41 objects, 30 flows): `pnpm -r
  typecheck`/`build`/`format:check`/`test` green, clean boot with `seeded on empty
  DB` and **zero** server `ERROR` lines; the console (home with 11 apps, the
  `content_topic` list with grouped seed rows, ROI dashboard KPIs 14040/708/87/21150
  + bar chart + 90-day signup time-series) renders with no client console errors.
- **Upgraded all templates to `@objectstack/* ^10.0.0` (from `^9.11.0`).** Bumped
  every package's deps and the workspace `minimumReleaseAgeExclude` pins. The 10.0
  major lands ADR-0057 (ERP authorization core: renames the system object
  `sys_department` → `sys_business_unit` with **no compatibility alias**, adds
  permission-grant access depth, and seeds stack-declared `roles`/`sharingRules`
  into `sys_role`/`sys_sharing_rule` at boot) and ADR-0058 (unified CEL→filter
  predicate surface). No template referenced `sys_department` or used
  hierarchy-relative access-depth scopes, so the rename needed no migration. **One
  adjustment:** ADR-0058 routes criteria sharing-rule conditions through the same
  CEL compiler as formula/validation predicates, which binds the record under the
  `record` namespace — `packages/content`'s `topic_team_scope` rule was rewritten
  from `visibility == "team"` to `record.visibility == "team"` (a bare reference is
  now a build error). Verified end-to-end against the composed `all` env (9 apps,
  41 objects, 30 flows): `pnpm -r typecheck`/`build`/`format:check`/`test` green,
  clean boot with `seeded on empty DB` and **zero** server `ERROR` lines; the
  console (home, the `content_topic` list, ROI dashboard KPIs + time-series chart)
  renders with no client console errors; and the new authorization core is live —
  `sys_business_unit` resolves, `sys_department` 404s, and the stack-declared roles
  (21) + sharing rules (2) seeded into `sys_role`/`sys_sharing_rule`.
- **Upgraded all templates to `@objectstack/* ^9.11.0` (from `^9.9.1`).** Bumped
  every package's deps and the workspace `minimumReleaseAgeExclude` pins. No
  metadata changes were required — 9.10.0/9.11.0 add only non-breaking surface for
  features the templates don't use (canonical `sharingModel` OWD vocab,
  `role_and_subordinates` sharing recipient, `isDefault` permission sets,
  autonumber tokens + build lint). Verified end-to-end against the composed `all`
  env (9 apps, 41 objects, 30 flows): `pnpm -r typecheck`/`build` green, clean
  boot with `seeded on empty DB` and **zero** server `ERROR` lines, all apps' seed
  data loads, and the console (home, list views, dashboard KPIs + time-series
  chart) renders with no client console errors.
- **Upgraded all templates to `@objectstack/* ^7.7.0` (from `^7.4.1`).** 7.6 shipped
  ADR-0032 phase 1 (build-time + runtime expression validation); 7.7 extended the
  build to **reject unknown `ObjectSchema` keys** (located, with a "move the logic
  to a supported mechanism" hint). All nine templates + the `all` aggregate build
  green and typecheck clean.
- **`packages/hr` — moved the "employee cannot be their own manager" guard from a
  validation rule into a lifecycle hook (`hr_employee.hook.ts`).** The rule
  compared `record.manager == record.id`, but the implicit primary key `id` is not
  a declared field, so the ADR-0032 build-time validator rejected it
  (`unknown field \`id\``). The hook (`beforeInsert`/`beforeUpdate`) enforces the
  same invariant using the record id from the hook context, where it is available.
- **Migrated object-level `workflows: [...]` to lifecycle hooks.** `workflows` is
  not a supported `ObjectSchema` field — it was silently stripped at build (never
  ran). All 15 on-update field-stamping / status-transition rules across 8 objects
  (content, contracts, helpdesk, procurement, hr, todo) now live in
  `beforeInsert`/`beforeUpdate` hooks, with date comparisons done in JS (which also
  sidesteps the CEL date↔timestamp gap). 7.7's stricter build now flags the old
  shape loudly.
- **Migrated object-level `stateMachines: {...}` to `state_machine` validation
  rules (ADR-0020).** `stateMachines` is likewise not an `ObjectSchema` field and
  was silently dropped — the 14 lifecycle machines were never enforced. They are
  now `type: 'state_machine'` validations (`{ OldState: [AllowedNewStates] }`) and
  are enforced at runtime; the orphaned `*.state.ts` files are no longer imported.
- **Removed dead cross-object rollup hooks.** `procurement_receipt`,
  `content_metric`/`content_publication`, and `compliance_assessment` rolled up via
  `ctx.services.data`, which is undefined inside the hook sandbox (a *nested* engine
  write would crash the QuickJS runtime — see `packages/expense/CHARTER.md`). Those
  rollups silently no-op'd. The target fields (`received_amount`, content `total_*`,
  `last_status`/`last_assessed_at`) are now documented as stored header fields,
  matching the expense package's existing pattern.
- **Fixed dangling user lookups: `Field.lookup('user')` → `Field.lookup('sys_user')`
  (27 fields + view refs).** The platform user object is `sys_user`; `'user'` is not
  a registered object, so resolving these lookups (and the seed's name-based
  `assignee: 'admin'`) flooded `no such table: user` SQL errors at runtime.
- Upgraded all templates to `@objectstack/* ^7.4.1` (from `^7.3.0`).
- **Approvals migrated to the 7.4.x flow-node model (ADR-0019).** The standalone
  `ApprovalProcess` export and the stack-level `approvals:` key were removed in
  7.4.x; approvals are now an `approval` node on a `record_change` flow whose
  `approve` / `reject` out-edges carry the decision branches. Reworked
  `packages/expense` (`expense_approval.flow.ts`) and `packages/content`
  (`publish_approval.flow.ts`) accordingly and deleted their `src/approvals/`
  directories.
- **Repaired `packages/project`** (previously did not typecheck): rewrote both
  state machines to the canonical `StateMachineConfig` (XState) shape and
  `stateMachines: { lifecycle }` wiring; fixed flow `type: 'scheduled'` →
  `'schedule'` and converted condition-node out-edges to
  `type: 'conditional'` + `condition` / `isDefault`; moved view `filter` out of
  the `data` provider to the view-level array form; normalised ESM relative
  imports to `.js`; and wired the three flows back into the stack.

- **Flow capability re-evaluation against the 7.4.x node registry.**
  - Notifications now use the real builtin **`notify`** node (delivers via the
    messaging service — inbox/email/push) instead of `script` +
    `actionType: 'notification'`, which the 7.4.x script executor treats as a
    **no-op** (log only). Migrated all 21 notification nodes + 2 templated-email
    nodes (`actionType: 'email'`, also a log-only stub → `notify` with
    `channels: ['email']`) across todo, expense, content, contracts, helpdesk,
    hr, procurement, compliance, project. `link:` → `actionUrl:` to match the
    `notify` config.
  - `packages/project` flows used node types with **no runtime executor**
    (`query`, `foreach`, `condition`) — they built but could never run. Rewrote
    to the registered builtins (`get_record`, `loop`, `decision`) with
    object-form filters, and wired the three flows into the stack. (The AI /
    scheduled-scan logic in these flows remains a documented v0 stub:
    `invoke_function` targets and per-item iteration depend on engine features
    not yet wired.)

- **QA scenario fixtures rewritten + runnable.** `packages/todo` and
  `packages/hr` shipped obsolete `qa/*.test.json` (both were copies of an old
  todo suite targeting removed objects `project`/`task`/`task_label`). Rewrote
  them against the real schemas (todo: `todo_task`/`todo_label` lifecycle,
  labels, due-date round-trip; hr: `hr_employee` onboarding, `hr_time_off_request`
  draft→submitted→approved, `hr_document`). Added `scripts/run-qa.mjs`, a small
  runner that authenticates (better-auth sign-up) and executes the scenarios
  against the versioned data API — needed because the `objectstack test` adapter
  bundled in `@objectstack/core` 7.4.x targets `/api/data/<object>` while the
  7.4.x REST plugin serves `/api/v1/data/<object>` (so the bundled runner 404s).
  Both suites pass green (`pnpm --filter @objectlab/<todo|hr> test:qa` against a
  running `objectstack dev`). Each template's `test` script now runs
  `objectstack build` (the schema/protocol validation gate).

All nine templates pass `tsc --noEmit` and `objectstack build` on 7.4.1.

### Added
- `packages/expense` — employee expense & reimbursement template (v0). 3
  objects (`report`, `line`, `category`), report lifecycle state machine
  (`draft → submitted → approved → reimbursed`, with reject/kickback/reopen),
  1 approval process (`expense_approval`, manager sign-off gating
  submit→approved), 3 flows (notify on submit, notify on reimburse, escalate
  approvals stale 3 days), 1 dashboard (Expenses Overview), 2 profiles
  (`expense_employee` / `expense_admin`) over a 3-tier role hierarchy. A line
  rollup hook keeps `report.total_amount` in sync with its lines; a report
  hook stamps `submitted_at` / `approved_at` / `reimbursed_at` on transition
  and auto-numbers reports. Receipt-required policy at $75; approval threshold
  at $1,000. 6 categories + 5 reports (every state) + 13 lines of seed data,
  en + zh-CN locales. Port 4011.
- Repo scaffolding: CI (Node 20 + 22 matrix, smoke boot), `CONTRIBUTING.md`, `TEMPLATE_GUIDE.md`, EditorConfig, Prettier config, Dependabot.
- Restored marketplace publish workflow (`.github/workflows/publish.yml`, `scripts/publish-template.mjs`, `docs/PUBLISHING.md`).
- `packages/todo` — first template: task & project management. 4 objects, state machine, 2 flows, 1 approval, 1 sharing rule, 2 profiles, 2 reports, 1 dashboard, English locale, seeded with one project + two labels.
- `packages/contracts` — post-signature CLM template (v0). 3 business objects
  (`party`, `contract`, `obligation`), 7-state contract lifecycle machine, 2
  flows (renewal alert at T-60/30/7, obligation overdue), 1 dashboard
  (Renewals at Risk), 1 AI action (`extract_terms` — LLM-driven metadata
  extraction from attached PDFs), 2 profiles (`contract_owner` / `legal_admin`),
  4 parties + 6 contracts + 6 obligations of realistic seed data, English
  locale. Charter declares post-signature scope (no drafting / redlining /
  e-sig — keep using Word + DocuSign) and graduation criteria for a future
  standalone product repo. Port 4003.
- `docs/products/contracts-gtm-draft.md` — go-to-market draft for the
  contracts template, parked until graduation criteria fire.
- `packages/procurement` — purchase-to-pay template (v0). 4 objects
  (`vendor`, `request`, `order`, `receipt`), PR + PO state machines,
  3 flows (PR approval ≥ $5k threshold, PR→PO conversion, overdue PO
  alert), 1 dashboard (Spend at a Glance), 2 profiles
  (`buyer` / `procurement_admin`), 4 vendors + 5 PRs + 4 POs + 3
  receipts of seed data exercising every state, en + zh-CN locales.
  3-way-match is implemented as a receipt afterInsert hook that
  rolls `received_value` into PO.received_amount. Port 4004.
- `packages/compliance` — controls & evidence template (v0). 4 objects
  (`framework`, `control`, `evidence`, `assessment`), evidence +
  assessment state machines, 3 flows (evidence expiring T-30/T-7,
  evidence auto-expire, failed control escalation), 1 dashboard
  (Compliance Posture), 2 profiles
  (`auditor` / `compliance_admin`), 3 frameworks (SOC 2, ISO 27001,
  GDPR) + 6 controls + 7 evidence (one already expired) + 5
  assessments of seed data, en + zh-CN locales. Assessment
  afterInsert hook rolls `last_status` + `last_assessed_at` onto the
  parent control. Port 4005.

### Changed
- Root README template table updated with the contracts, procurement,
  and compliance rows; subsequent planned templates renumbered.
- `procurement_vendor.legal_name` → `name` so the bundled
  `LookupCellRenderer` picks up the display name in dashboard/list
  cells (`legal_name` was not in its hard-coded candidate list).

### Fixed
- `todo`: `project.owner` no longer marked `required` — platform fills via `created_by` and ownership rules.
