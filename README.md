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
| [`packages/contracts/`](./packages/contracts) | Post-signature contract lifecycle (CLM) — AI-extracted metadata, approvals, renewal alerts | ✅ v0 | 4003 |
| [`packages/procurement/`](./packages/procurement) | Vendors, purchase requests, POs, goods receipt, 3-way-match rollup | ✅ v0 | 4004 |
| [`packages/compliance/`](./packages/compliance) | SOC 2 / ISO 27001 controls, evidence with expiry, assessments | ✅ v0 | 4005 |
| [`packages/content/`](./packages/content) | Content marketing engine — editorial calendar, competitive signals, channel ROI, 8-state piece lifecycle | ✅ v0 | 4008 |
| `packages/helpdesk/` | Ticketing, SLA, knowledge base | 🚧 planned | 4006 |
| `packages/sales-pipeline/` | Lite CRM (leads, opportunities, accounts) | 🚧 planned | 4007 |

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
│   ├── workflows/             # ci.yml (verify + smoke), publish.yml (marketplace)
│   └── dependabot.yml
├── CONTRIBUTING.md            # conventions for contributors (incl. AI agents)
├── TEMPLATE_GUIDE.md          # how to author a template
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

1. Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the workflow.
2. Read [`TEMPLATE_GUIDE.md`](./TEMPLATE_GUIDE.md) before adding a new template — it documents file suffixes, hard limits, schema gotchas, and the build-order playbook.

Push to `main`. CI must be green.

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

Publishing is **explicit** — there's no auto-publish on push. Two ways
to trigger `.github/workflows/publish.yml`:

1. **Actions → Publish to marketplace → Run workflow** (with optional
   `dry_run` to inspect the payload first).
2. **Create a GitHub Release** with a tag like `todo-v0.2.0` — the
   workflow narrows the publish to that template via the tag pattern.

Re-running is idempotent — the version endpoint returns 409 for any
`(package, version)` pair that already exists, so unchanged templates are
reported as `skipped` rather than failing.

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
