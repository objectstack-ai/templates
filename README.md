# @objectstack/templates

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Spec](https://img.shields.io/badge/%40objectstack%2Fspec-v3.0.8-blue)](https://github.com/objectstack-ai/hotcrm)

> A collection of small, ready-to-deploy application templates for the ObjectStack cloud application marketplace.

## Overview

This repository contains lightweight application templates built on [@objectstack/spec](https://github.com/objectstack-ai/hotcrm) v3.0.8. Each template is a self-contained, deployable application designed to be published to the ObjectStack cloud marketplace.

Unlike [HotCRM](https://github.com/objectstack-ai/hotcrm) — a large, complex enterprise CRM system — the templates in this repository are intentionally minimal and focused, serving as building blocks and starting points for common business use cases.

## Available Templates

| Template | Description | Objects |
|----------|-------------|---------|
| [todo](./templates/todo) | Task management app with lists, items, and priorities | 2 |
| [blog](./templates/blog) | Blog and content management with posts and categories | 3 |
| [inventory](./templates/inventory) | Inventory tracking with products, stock levels, and suppliers | 3 |

## Quick Start

```bash
# Prerequisites: Node.js >= 20.9.0, pnpm >= 9.0.0
git clone https://github.com/objectstack-ai/templates.git
cd templates
pnpm install

# Run a specific template in development mode
pnpm --filter @templates/todo dev

# Build all templates
pnpm build

# Run tests
pnpm test

# Typecheck
pnpm typecheck
```

## Repository Structure

```
templates/
├── .github/
│   └── workflows/
│       └── publish-marketplace.yml  # CI/CD for marketplace publishing
├── templates/               # Application templates (each is a standalone app)
│   ├── todo/               # Task management template
│   │   ├── src/            # Source files (objects, hooks, plugin)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── objectstack.config.ts
│   │   ├── README.md
│   │   └── CHANGELOG.md
│   ├── blog/               # Blog / CMS template
│   └── inventory/          # Inventory management template
├── package.json            # Monorepo root
├── pnpm-workspace.yaml     # Workspace config
├── tsconfig.json           # Root TypeScript config
├── base.tsconfig.json      # Shared TypeScript base
├── vitest.config.ts        # Test config
└── ROADMAP.md              # Development roadmap
```

## Creating a New Template

Each template follows the same structure as an ObjectStack plugin:

```
templates/my-app/
├── package.json            # Package manifest
├── tsconfig.json           # TypeScript config (extends base.tsconfig.json)
├── objectstack.config.ts   # Standalone run config
└── src/
    ├── plugin.ts           # Plugin definition (objects, hooks, actions, apps)
    ├── *.object.ts         # Business object definitions
    └── hooks/              # Event hooks (optional)
        └── *.hook.ts
```

### Step-by-step

1. Create the directory: `mkdir templates/my-app`
2. Add `package.json` with name `@templates/my-app`
3. Add `tsconfig.json` extending `../../base.tsconfig.json`
4. Define objects in `src/*.object.ts` using `ObjectSchema.create()`
5. Wire everything in `src/plugin.ts`
6. Add `objectstack.config.ts` for standalone execution
7. Update `tsconfig.json` and `vitest.config.ts` at the root to include the new template

## Publishing to Marketplace

Templates are published to the ObjectStack cloud marketplace via the `publish-marketplace.yml` GitHub Actions workflow. Publishing can be triggered automatically by pushing a version tag or manually via the GitHub UI.

### Prerequisites

Before publishing, configure the following in your repository settings (**Settings → Secrets and variables → Actions**):

| Type | Name | Description |
|------|------|-------------|
| Secret | `MARKETPLACE_API_KEY` | API key for the ObjectStack cloud marketplace |
| Variable | `MARKETPLACE_API_URL` | *(Optional)* API base URL. Defaults to `https://cloud.objectstack.io/api/marketplace` |

### Publishing via Tag (Automatic)

Push a version tag to trigger an automatic publish of **all** templates:

```bash
# 1. Ensure all checks pass locally
pnpm typecheck
pnpm test

# 2. Update version in each template's package.json and CHANGELOG.md
# e.g. templates/todo/package.json  →  "version": "1.1.0"
# Add a new section in CHANGELOG.md documenting Added/Changed/Fixed/Removed items

# 3. Commit the version bump
git add .
git commit -m "chore: bump templates to v1.1.0"

# 4. Create and push a version tag
git tag v1.1.0
git push origin main --tags
```

The workflow will automatically: typecheck → test → build each template → package as `.tar.gz` → publish to the marketplace.

### Publishing via Manual Dispatch

Go to **Actions → Publish Templates to Marketplace → Run workflow** and configure:

| Input | Description | Example |
|-------|-------------|---------|
| `dry_run` | When `true`, validates build & packaging without calling the marketplace API | `true` |
| `templates` | Comma-separated template names. Leave empty to publish all | `todo,blog` |

### Dry-Run Mode

Use dry-run to validate that templates build and package correctly without actually publishing:

```
# Via GitHub UI: set dry_run = true
# Or via GitHub CLI:
gh workflow run publish-marketplace.yml -f dry_run=true
```

Dry-run output shows each template's artifact filename, version, and SHA-256 checksum.

### Partial Publishing

Publish only specific templates by providing their names:

```
# Via GitHub CLI:
gh workflow run publish-marketplace.yml -f templates="todo,inventory"
```

### Publish Flow Details

The workflow runs three jobs in sequence:

```
resolve-matrix  ──→  validate  ──→  publish (per template, concurrent)
```

1. **resolve-matrix** — Discovers which templates to publish (all or from input)
2. **validate** — Runs `pnpm typecheck` and `pnpm test` across the monorepo
3. **publish** — For each template in parallel:
   - `pnpm --filter @templates/<name> build` — Compile TypeScript and ObjectStack artifacts
   - Package `dist/`, `package.json`, `README.md`, `CHANGELOG.md` into `<name>-<version>.tar.gz`
     > **Note**: `README.md` and `CHANGELOG.md` are required in each template directory. The packaging step will fail if they are missing.
   - Generate SHA-256 checksum
   - Call cloud API:
     - `POST /publish` — Initiate publish, receive `publishId` and `uploadUrl`
     - `PUT <uploadUrl>` — Upload the `.tar.gz` artifact
     - `POST /publish/<publishId>/confirm` — Finalize the release
   - **Rollback**: If upload or confirm fails, the workflow automatically calls `DELETE /publish/<publishId>` to clean up

### Marketplace Metadata

Each template's `package.json` includes an `objectstack` section required by the marketplace:

```json
{
  "objectstack": {
    "category": "app",
    "minVersion": "3.0.0",
    "permissions": ["data:read", "data:write"]
  }
}
```

| Field | Description |
|-------|-------------|
| `category` | Template type (`"app"`) |
| `minVersion` | Minimum ObjectStack runtime version required |
| `permissions` | Data access permissions the template needs |

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Workflow not triggered on tag push | Ensure the tag matches pattern `v*` (e.g. `v1.0.0`, `v2.1.0-beta`) |
| `MARKETPLACE_API_KEY` error | Verify the secret is set in **Settings → Secrets → Actions** |
| Build failure for a single template | Check the matrix job log for that template; other templates will continue (`fail-fast: false`) |
| Publish initiated but confirm failed | The workflow auto-rolls back. Check API logs and retry |
| Dry-run passes but real publish fails | Ensure `MARKETPLACE_API_KEY` and `MARKETPLACE_API_URL` are configured |

## Tech Stack

- **Runtime**: [@objectstack/spec](https://github.com/objectstack-ai/hotcrm) v3.0.8
- **Language**: TypeScript >= 5.3.0
- **Package Manager**: pnpm >= 9.0.0
- **Node.js**: >= 20.9.0
- **Testing**: Vitest

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT