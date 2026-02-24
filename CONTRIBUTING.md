# Contributing to @objectstack/templates

Thank you for contributing! This guide covers how to add new templates and improve existing ones.

## Prerequisites

- Node.js >= 20.9.0
- pnpm >= 9.0.0
- TypeScript >= 5.3.0

## Development Setup

```bash
git clone https://github.com/objectstack-ai/templates.git
cd templates
pnpm install
```

## Adding a New Template

### 1. Create the directory structure

```bash
mkdir -p templates/my-app/src
```

### 2. Create `package.json`

```json
{
  "name": "@templates/my-app",
  "version": "1.0.0",
  "type": "module",
  "description": "Short description of your app",
  "license": "MIT",
  "scripts": {
    "build": "tsc && objectstack compile",
    "typecheck": "tsc --noEmit",
    "dev": "objectstack dev"
  },
  "dependencies": {
    "@objectstack/spec": "^3.0.8"
  },
  "devDependencies": {
    "@objectstack/cli": "^3.0.8",
    "typescript": "^5.9.3"
  }
}
```

### 3. Create `tsconfig.json`

```json
{
  "extends": "../../base.tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Define business objects

Create `src/my_entity.object.ts`:

```typescript
import { ObjectSchema, Field } from '@objectstack/spec/data';

export const MyEntity = ObjectSchema.create({
  name: 'my_entity',
  label: 'My Entity',
  pluralLabel: 'My Entities',
  icon: 'cube',

  fields: {
    name: Field.text({ label: 'Name', required: true }),
    description: Field.textarea({ label: 'Description' }),
  },

  enable: {
    searchable: true,
  },
});
```

### 5. Create the plugin

Create `src/plugin.ts` exporting a plugin object with `objects`, `apps`, `triggers`, and `actions`.

### 6. Create `objectstack.config.ts`

```typescript
import { defineStack } from '@objectstack/spec';
import { MyAppPlugin } from './src/plugin.js';

export default defineStack({
  manifest: {
    id: 'com.templates.my-app',
    namespace: 'my_app',
    version: '1.0.0',
    type: 'plugin',
    name: 'My App',
    description: 'Short description',
  },
  plugins: [MyAppPlugin],
});
```

### 7. Register in root `tsconfig.json` and `vitest.config.ts`

Add path aliases for the new template in both files.

### 8. Update `ROADMAP.md`

Add your template to the appropriate phase.

## Pre-submission Checklist

- [ ] `pnpm typecheck` — zero TypeScript errors
- [ ] `pnpm test` — all tests pass
- [ ] `pnpm lint` — no ESLint errors
- [ ] README added to the template directory
- [ ] Template listed in root `README.md`
- [ ] `ROADMAP.md` updated

## Code Style

- Use `ObjectSchema.create()` for all business objects
- Follow the `{entity}.object.ts` naming convention
- Use `Field.*` helpers from `@objectstack/spec/data`
- Prefer named exports
