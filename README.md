# ObjectStack Templates

[![CI](https://github.com/objectstack-ai/templates/actions/workflows/ci.yml/badge.svg)](https://github.com/objectstack-ai/templates/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![Node >=20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](./.nvmrc)

Official starter templates for [ObjectStack](https://github.com/objectstack-ai/framework) — production-shaped scaffolds users adopt via the CLI.

```bash
pnpm dlx @objectstack/cli create my-app --template todo
```

## Built for AI-native development

ObjectStack is designed from the ground up to be **authored, extended, and
operated by AI agents** alongside humans. Every primitive — objects, views,
flows, formulas, permissions, i18n — is a small, declarative TypeScript file
that an LLM can read, diff, and safely modify without breaking the runtime.

- **Skill bundle for agents.** The companion [`objectstack-ai/framework`](https://github.com/objectstack-ai/framework)
  ships a set of authoring skills (`objectstack-data`, `objectstack-query`,
  `objectstack-ui`, `objectstack-automation`, `objectstack-formula`,
  `objectstack-i18n`, `objectstack-api`, `objectstack-platform`, `objectstack-ai`)
  that teach Copilot CLI / Claude Code / Cursor / Codex exactly how to write
  `*.object.ts`, `*.view.ts`, `*.flow.ts`, etc. — install once and every
  ObjectStack project on your machine becomes agent-ready.
- **Deterministic, diff-friendly metadata.** Schema, UI, automation, and
  permissions all live in versioned source files — no opaque database state —
  so an agent's change is reviewable in a normal PR.
- **First-class AI runtime.** `@objectstack/ai` gives every object built-in
  embeddings, semantic search, RAG, agent tools, and MCP integration; flows can
  call LLMs as just another step.
- **100% AI-built templates.** Every template in this repo (todo, contracts,
  procurement, compliance, helpdesk, content, hr, project, …) was designed,
  scaffolded, and iterated end-to-end with AI agents driving the ObjectStack
  skill bundle — they are both useful starters **and** worked examples of what
  AI-driven product development on ObjectStack looks like in practice.

> Install the skills (see [below](#install-objectstack-skills-for-ai-agents))
> and your agent can extend any of these templates — add an object, wire a
> flow, ship a new view — using the same conventions we used to build them.

## Available templates

| Template | Domain | Status | Port | Try it |
|---|---|---|---|---|
| [`packages/todo/`](./packages/todo) | Task & project management — the universal starter | ✅ ready | 4002 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/todo) |
| [`packages/contracts/`](./packages/contracts) | Post-signature contract lifecycle (CLM) — AI-extracted metadata, approvals, renewal alerts | ✅ v0 | 4003 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/contracts) |
| [`packages/procurement/`](./packages/procurement) | Vendors, purchase requests, POs, goods receipt, 3-way-match rollup | ✅ v0 | 4004 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/procurement) |
| [`packages/compliance/`](./packages/compliance) | SOC 2 / ISO 27001 controls, evidence with expiry, assessments | ✅ v0 | 4005 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/compliance) |
| [`packages/helpdesk/`](./packages/helpdesk) | AI-first customer support — auto-triage, suggested replies, KB recall, sentiment escalation | ✅ v0 | 4006 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/helpdesk) |
| [`packages/content/`](./packages/content) | Content marketing engine — editorial calendar, competitive signals, channel ROI, 8-state piece lifecycle | ✅ v0 | 4008 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/content) |
| [`packages/hr/`](./packages/hr) | People Ops — employee directory, org chart, time-off approvals, document expiry alerts | ✅ v0 | 4009 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/hr) |
| [`packages/project/`](./packages/project) | AI Project Management — portfolio tracking with AI risk prediction, delay forecasting, resource conflict detection | 🚧 v0.1-wip | 4010 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/project) |
| `packages/sales-pipeline/` | Lite CRM (leads, opportunities, accounts) | 🚧 planned | 4007 | — |

> **StackBlitz tip:** every template runs in the browser via `@objectstack/driver-sqlite-wasm` (sql.js). Local dev still uses `better-sqlite3` (listed as an optional dependency) for full native speed.

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
│   └── <name>/                # one template = one package = @objectlab/<name>
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

pnpm --filter @objectlab/todo dev   # http://localhost:4002
pnpm typecheck
pnpm format
```

Reset a template's local SQLite database:

```bash
rm -rf packages/todo/.objectstack
```

## Install ObjectStack skills (for AI agents)

If you're working on this repo with an AI coding agent (Copilot CLI, Claude
Code, Cursor, etc.), install the ObjectStack authoring skills globally so the
agent picks up the framework conventions automatically:

```bash
npx skills add objectstack-ai/framework
```

This installs the `objectstack-*` skill bundle (data, query, ui, automation,
formula, i18n, api, platform, ai) into your user-level skills directory and
makes them available across every project on your machine.

## Contributing

1. Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the workflow.
2. Read [`TEMPLATE_GUIDE.md`](./TEMPLATE_GUIDE.md) before adding a new template — it documents file suffixes, hard limits, schema gotchas, and the build-order playbook.

Push to `main`. CI must be green.

## Adding a new template (TL;DR)

```bash
cp -r packages/todo packages/<your-template>
# edit package.json: name → @objectlab/<your-template>, port → next free
# edit package.json: objectstack.marketplace.{manifestId,displayName,description,iconUrl,…}
# edit objectstack.config.ts: namespace, port
# rewrite CHARTER.md with your scope
# build out src/ following the order in TEMPLATE_GUIDE.md
# add row to the table above
pnpm install
pnpm --filter @objectlab/<your-template> dev
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
