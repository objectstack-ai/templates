# Agent instructions

Repo-specific rules for AI agents working in this repository. See
[`TEMPLATE_GUIDE.md`](TEMPLATE_GUIDE.md) for how the templates are authored.

## Workflow

- **When the code you changed passes tests, create a PR and merge it.**
  After the full CI gate set passes locally — `pnpm typecheck`, `pnpm build`,
  `pnpm format:check`, and `pnpm -r --if-present test` — commit on a branch,
  open a pull request, and merge it. Do not stop at "tests pass" and wait for a
  separate go-ahead.
  - 中文：你修改的代码测试通过后，创建 PR 并合并，无需再次等待确认。
- Never commit, push, or merge while any of those checks is failing.
- Work on a branch, not `main`; let the PR merge bring changes into `main`.

## Runtime gotchas (learned the hard way — build passing ≠ it works)

`objectstack build` validating clean does **NOT** mean the app boots, seeds, or
that hooks/flows actually run. Several bug classes only surface at runtime.
Before claiming a metadata change works, boot it (see "Running the `all` env")
and confirm `Server is ready` + `seeded on empty DB` + zero `ERROR` log lines.

- **Hooks run body-only in a QuickJS sandbox.** The handler ships as just its
  function body, so it can reference **only what is declared inside the handler**.
  A module-scope helper/const referenced from the handler throws
  `ReferenceError` at runtime (but passes build). Define every helper/constant
  *inside* the handler body. Also: a hook may mutate only its incoming `input`
  payload — a **nested cross-object write** (`ctx.api...update/create`) re-enters
  the sandbox and crashes the process (`memory access out of bounds`), and
  `ctx.services.data` is undefined in-sandbox. (Platform: framework#1867.)
- **Flow trigger conditions: use the supported idioms.** `previous.<field>` and
  plain comparisons / `!= null` work. `PRIOR(...)` and `isBlank(...)` are **not
  evaluated** — the flow is silently skipped with no error and a clean build.
  (Platform: framework#1877.)
- **Flow `create_record` date fields:** never pass a literal `'today()'` /
  `'now()'` string — the runtime rejects it as `invalid_date` and the whole flow
  aborts. Use a field ref (`'{rec.some_date}'`) or leave the field optional.
- **Flow action/`invoke_function` nodes** pointing at a function no template
  registers (or a `script` node with no real `actionType`, e.g. an `aggregations`
  node) build fine and silently **no-op** at runtime. Cross-object rollups are
  therefore seed/client-maintained, not live. (Platform: framework#1868/#1870.)
- **Multi-lookup (`multiple:true`) fields** aren't on the after-create record a
  record-change condition sees, so conditions like `record.x != null` are false
  for them. (Platform: framework#1872.)
- **Script validations** of `field == null` don't fire on insert when the field
  is *omitted entirely* from the payload (they do on update / explicit null).
  A field with a `defaultValue` is always present, so its rules fire on insert.
  (Platform: framework#1871.)
- **Dashboard time-series on a `datetime` field render empty.** The analytics
  dataset executor binds dashboard date tokens (`{12_months_ago}`, `{today}`,
  `{N_weeks_ago}`, …) as **ISO date strings** (`"2025-06-18"`). A `Field.date`
  column stores ISO text, so `col >= '2025-06-18'` matches; a `Field.datetime`
  column stores an **integer epoch** (e.g. `1780012800000`), and in SQLite an
  INTEGER always sorts *before* any TEXT, so `epoch >= 'YYYY-MM-DD'` is **always
  false** → the chart/KPI silently shows "No rows" even though the data exists
  and the un-filtered cube returns it. Use **`Field.date`** for any field a
  dashboard filters or groups by a date token (chart x-axes, "last N months"
  filters). Keep `datetime` only where sub-day precision is load-bearing (e.g.
  `helpdesk_ticket.resolved_at`, used by SLA-resolution timing) — those charts
  stay empty until the platform binds epoch for datetime columns. (Platform:
  framework — analytics date-token vs datetime-column type mismatch.)

## Running the `all` env locally (for runtime/UI testing)

- **Native driver:** `better-sqlite3`'s prebuilt ABI may not match the local
  Node (e.g. Node 25). If the dev server logs `NODE_MODULE_VERSION` mismatch,
  rebuild from source: in
  `node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3`, run
  `npm_config_build_from_source=true npx node-gyp rebuild`.
- **Compile + run:** `pnpm --filter @objectlab/all run compile` composes every
  template into `dist/objectstack.json`, then `pnpm --filter @objectlab/all start`
  (port 4000). The compile re-reads each template's freshly-built
  `dist/objectstack.json`, so run `pnpm -r build` first.
- **Seed data is org-scoped.** Log in as the seeded dev admin
  `admin@objectos.ai` / `admin123` to see seed data — a freshly *registered*
  user lands in an empty org and sees nothing. (READMEs document this.)
- **Console routes:** object list `/_console/apps/<app>/<object>`, dashboard
  `/_console/apps/<app>/dashboard/<name>`, create form
  `/_console/apps/<app>/<object>/new`. Home app cards are React-onClick divs and
  don't respond to scripted clicks — navigate by URL instead.
- **API:** `/api/v1/data/<object>` (list responses use `{records}`); login is
  `POST /api/v1/auth/sign-in/email` and **requires an `Origin` header** (403
  without it).

## Locales & charters

- `zh-CN` ships across **all** templates (PR #13) — it is intentional. Some older
  CHARTER "en only" lines are stale; reconcile the charter to reality, never
  delete translation files. When adding fields/options, update both `en` and
  `zh-CN` bundles.

## Where follow-up work is tracked

- Platform-level gaps surfaced by these templates: `objectstack-ai/framework`
  issues #1867–#1877.
- Template-side follow-ups (incl. cleanups blocked on those platform fixes):
  this repo's issues #45–#59 (umbrella tracker: #59).
