# Contributing to ObjectStack Templates

Thanks for helping make ObjectStack easier to start with! This repo houses **starter templates** — small, opinionated, production-quality scaffolds users adopt via the CLI. Everything below exists to keep templates **fast to read, fast to extend, and trustworthy**.

## TL;DR

```bash
pnpm install
pnpm --filter @template/todo dev   # http://localhost:4002
pnpm typecheck
pnpm format
```

Open a PR against `main`. Keep it small. Boot the template before requesting review.

## Repo layout

```
templates/
├── packages/<name>/         # one template = one package = @template/<name>
│   ├── src/
│   │   ├── objects/         # *.object.ts — data model (source of truth)
│   │   ├── views/           # *.view.ts — list / kanban / table
│   │   ├── pages/           # *.page.ts — detail layouts
│   │   ├── flows/           # *.flow.ts — automation
│   │   ├── approvals/       # *.approval.ts
│   │   ├── sharing/         # *.sharing.ts
│   │   ├── profiles/        # *.profile.ts (permission sets)
│   │   ├── reports/         # *.report.ts
│   │   ├── dashboards/      # *.dashboard.ts
│   │   ├── apps/            # *.app.ts (navigation)
│   │   ├── translations/    # i18n bundles
│   │   ├── data/            # defineDataset(...) seed data
│   │   └── hooks/           # *.hook.ts — before/after triggers
│   ├── CHARTER.md           # scope + hard limits (REQUIRED)
│   ├── README.md            # for the end user who scaffolds it
│   ├── objectstack.config.ts
│   ├── package.json         # name: @template/<name>
│   └── tsconfig.json
└── .github/
```

## Golden rules

1. **Metadata-first.** All schema lives in `*.object.ts` typed against `@objectstack/spec`. No raw SQL, no JSON/YAML metadata.
2. **One template = one capability.** A template is a starter, not a product. Hard limits live in `CHARTER.md` and are enforced in review.
3. **No workspace links to the framework.** Templates depend on **published** `@objectstack/*` packages only — that is what the user will actually consume.
4. **Strict file suffixes** (see [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)): `*.object.ts`, `*.view.ts`, `*.page.ts`, `*.flow.ts`, `*.approval.ts`, `*.sharing.ts`, `*.profile.ts`, `*.report.ts`, `*.dashboard.ts`, `*.app.ts`, `*.hook.ts`, `*.action.ts`, `*.state.ts`. Names are `snake_case`.
5. **No prefix injection.** Object names appear in source exactly as they appear in the DB / URL / docs. Use unprefixed names (`task`, `project`) for generic templates; reserve `crm_*` for HotCRM.
6. **Use platform polymorphic services.** Comments → `sys_comment`. Files → `sys_attachment`. Activities → `sys_activity`. Audit → `sys_audit_log`. Enable via `enable: { feeds, files, activities, trackHistory }` — don't reinvent.
7. **Every commit boots.** If `pnpm dev` doesn't start, the PR is not ready.

## Proposing a new template

Before writing code, open a **New template proposal** issue. We agree on:

- Scope (3–6 objects max)
- Primary state machine
- Charter limits (LOC, locales, flows, dashboards)
- Port allocation (4000+; check existing templates)

Then:

1. Copy `packages/todo/` as your starting point.
2. Rename package to `@template/<name>`, update `objectstack.config.ts` namespace.
3. Pick a unique port.
4. Write `CHARTER.md` first — limits enforced from day one.
5. Build out objects → hooks → views → pages → flows → seed data.
6. Add to the root `README.md` template table.

## Development workflow

```bash
# install
pnpm install

# run one template
pnpm --filter @template/todo dev

# typecheck everything
pnpm typecheck

# format
pnpm format          # write
pnpm format:check    # verify (CI)

# build (produces dist/objectstack.json artifact)
pnpm -r build

# reset a template's local SQLite DB
rm -rf packages/<name>/.objectstack
```

## Commit & PR style

- **Conventional Commits**: `feat(todo): add overdue dashboard widget`, `fix(todo): drop required on owner`, `docs: clarify charter limits`.
- Keep PRs focused (one template or one repo-level concern at a time).
- Co-author tag for AI-assisted commits is welcome.

## What CI checks

Every PR runs against Node 20 + 22:

1. `pnpm install --frozen-lockfile` (lockfile must be committed)
2. `pnpm format:check`
3. `pnpm typecheck`
4. `pnpm -r build`
5. `pnpm -r test --if-present`
6. **Smoke**: boots the todo template and curls `/_console/`

A red CI blocks merge.

## Reporting bugs / requesting templates

Use the issue templates — they capture the info we need (which template, versions, repro).

## License

By contributing, you agree your work is licensed under Apache-2.0 (see [LICENSE](./LICENSE)).
