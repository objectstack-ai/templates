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
├── templates/               # Application templates (each is a standalone app)
│   ├── todo/               # Task management template
│   │   ├── src/            # Source files (objects, hooks, plugin)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── objectstack.config.ts
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