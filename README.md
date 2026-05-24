# ObjectStack Templates

[![CI](https://github.com/objectstack-ai/templates/actions/workflows/ci.yml/badge.svg)](https://github.com/objectstack-ai/templates/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![Node >=20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](./.nvmrc)

Official starter templates for [ObjectStack](https://github.com/objectstack-ai/framework) — production-shaped scaffolds users adopt via the CLI.

```bash
pnpm dlx @objectstack/cli create my-app --template todo
```

## Available templates

| Template | Domain | Status | Port |
|---|---|---|---|
| [`packages/todo/`](./packages/todo) | Task & project management — the universal starter | ✅ ready | 4002 |
| `packages/helpdesk/` | Ticketing, SLA, knowledge base | 🚧 planned | 4003 |
| `packages/procurement/` | Vendors, POs, approval chains | 🚧 planned | 4004 |
| `packages/sales-pipeline/` | Lite CRM (leads, opportunities, accounts) | 🚧 planned | 4005 |

> Looking for a full reference app? See [hotcrm](https://github.com/objectstack-ai/hotcrm) — the production-grade CRM built on the same engine.

## What a template is

| ✅ Yes | ❌ No |
|---|---|
| One opinionated capability | A generic framework demo |
| < 2500 LOC, readable in one sitting | A reference of every feature |
| Production-shaped (state machines, permissions, i18n, audit) | Throwaway / sample-only |
| Easy to delete what you don't need | Tightly coupled |

Every template:

- depends on **published** `@objectstack/*` packages (no workspace links to the framework)
- ships its own `README.md`, `CHARTER.md`, and i18n
- boots standalone with `pnpm install && pnpm dev` in under a minute

## Repo layout

```
templates/
├── packages/
│   └── <name>/                # one template = one package = @template/<name>
│       ├── src/
│       ├── CHARTER.md         # scope + hard limits (required)
│       ├── README.md          # for the end user
│       ├── objectstack.config.ts
│       └── package.json
├── .github/
│   ├── workflows/ci.yml       # typecheck, build, format, smoke
│   ├── ISSUE_TEMPLATE/        # bug, new template
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml
├── CONTRIBUTING.md            # how to contribute
├── TEMPLATE_GUIDE.md          # how to author a template
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CHANGELOG.md
├── pnpm-workspace.yaml
└── README.md
```

## Quick start (contributors)

Requires **Node ≥ 20** and **pnpm ≥ 10**.

```bash
pnpm install

pnpm --filter @template/todo dev   # http://localhost:4002
pnpm typecheck
pnpm format
```

Reset a template's local SQLite database:

```bash
rm -rf packages/todo/.objectstack
```

## Contributing

1. Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for workflow, commit style, and the PR checklist.
2. Read [`TEMPLATE_GUIDE.md`](./TEMPLATE_GUIDE.md) before proposing a new template — it documents file suffixes, hard limits, schema gotchas, and the build-order playbook.
3. Open a **New template proposal** issue before writing code for a new template.
4. Bug reports use the **Bug report** issue template.

PRs against `main`. CI must be green. Keep them focused.

## Adding a new template (TL;DR)

```bash
cp -r packages/todo packages/<your-template>
# edit package.json: name → @template/<your-template>, port → next free
# edit package.json: objectstack.marketplace.{manifestId,displayName,description,iconUrl,…}
# edit objectstack.config.ts: namespace, port
# rewrite CHARTER.md with your scope
# build out src/ following the order in TEMPLATE_GUIDE.md
# add row to the table above
pnpm install
pnpm --filter @template/<your-template> dev
```

## Publishing to the marketplace

Push to `main` → `.github/workflows/publish.yml` rebuilds every template
and POSTs each one to the cloud control plane (`POST /api/v1/cloud/packages`
+ `POST /api/v1/cloud/packages/:id/versions`). Re-running is idempotent —
the version endpoint returns 409 when the `(package, version)` pair
already exists and the script reports `skipped`.

See [`docs/PUBLISHING.md`](./docs/PUBLISHING.md) for the full contract,
required GitHub Secrets (`OS_CLOUD_API_KEY`) / Variables (`OS_CLOUD_URL`),
local dry-run, and failure modes.

## Ports

| Range | Owner |
|---|---|
| 3000–3002 | [`framework/`](https://github.com/objectstack-ai/framework) engine + studio |
| 4001 | [`hotcrm/`](https://github.com/objectstack-ai/hotcrm) production reference |
| 4002+ | templates (one port per template) |

## Related repos

- [`framework`](https://github.com/objectstack-ai/framework) — runtime, spec, CLI, studio
- [`hotcrm`](https://github.com/objectstack-ai/hotcrm) — production CRM reference app
- [`docs`](https://docs.objectstack.ai) — platform documentation

## License

[Apache-2.0](./LICENSE)
