# ObjectStack Templates

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Spec](https://img.shields.io/badge/%40objectstack%2Fspec-v3.0.8-blue)

> A collection of small, focused application templates built on [@objectstack/spec](https://github.com/objectstack-ai/hotcrm) for the ObjectStack cloud app marketplace.

## Overview

This monorepo contains ready-to-use application templates that can be deployed to the ObjectStack cloud marketplace. Each template is a self-contained, minimal application demonstrating best practices with the `@objectstack/spec` protocol.

Unlike [HotCRM](https://github.com/objectstack-ai/hotcrm) — a large enterprise CRM with ~148 business objects — each template here is intentionally **small and focused**, serving as a starting point for specific use cases.

## Quick Start

```bash
# Prerequisites: Node.js >= 20, pnpm >= 9.0.0
git clone https://github.com/objectstack-ai/templates.git
cd templates
pnpm install

# Run tests
pnpm test
```

## Available Templates

| Template | Description | Objects |
|----------|-------------|---------|
| [todo](./apps/todo) | Simple task management | `todo` |
| [blog](./apps/blog) | Blog and content management | `post`, `category` |

## Repository Structure

```
templates/
├── apps/                   # Application Templates
│   ├── todo/              # Task management app
│   │   ├── src/           # Object definitions & plugin
│   │   ├── __tests__/     # Unit tests
│   │   ├── objectstack.config.ts
│   │   └── package.json
│   └── blog/              # Blog/CMS app
│       ├── src/           # Object definitions & plugin
│       ├── __tests__/     # Unit tests
│       ├── objectstack.config.ts
│       └── package.json
├── package.json           # Root monorepo config
├── pnpm-workspace.yaml
├── tsconfig.json
└── vitest.config.ts
```

## Creating a New Template

Each template lives in `apps/<name>/` and follows this structure:

```
apps/my-app/
├── src/
│   ├── my_object.object.ts   # Business object definition
│   ├── plugin.ts             # Plugin registration
│   └── index.ts              # Public exports
├── __tests__/
│   └── unit/objects/
│       └── my_object.object.test.ts
├── objectstack.config.ts     # App-level stack config
├── package.json
└── tsconfig.json
```

### Object Definition Example

```typescript
import { ObjectSchema, Field } from '@objectstack/spec/data';

export const MyObject = ObjectSchema.create({
  name: 'my_object',
  label: 'My Object',
  pluralLabel: 'My Objects',
  icon: 'star',
  description: 'Description of my object',

  fields: {
    name: Field.text({ label: 'Name', required: true }),
    status: Field.select({
      label: 'Status',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    }),
  },

  enable: {
    searchable: true,
    trackHistory: true,
  },
});
```

## Design Principles

1. **Small & Focused** — Each template covers a single, well-defined use case
2. **Metadata Driven** — All business objects defined in TypeScript (`.object.ts`)
3. **Plugin Architecture** — Each template is a self-contained plugin
4. **Zero Dependencies** — Templates only depend on `@objectstack/spec`
5. **Test Coverage** — Every object has accompanying unit tests

## Development

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Type check all templates
pnpm typecheck

# Lint
pnpm lint
```

## Contributing

To add a new template:

1. Create `apps/<template-name>/` following the structure above
2. Define your business objects in `src/*.object.ts`
3. Create a plugin in `src/plugin.ts`
4. Add an `objectstack.config.ts`
5. Write unit tests in `__tests__/unit/`
6. Update this README and `ROADMAP.md`

## License

MIT License — see [LICENSE](LICENSE) for details.