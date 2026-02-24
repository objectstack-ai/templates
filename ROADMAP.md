# @objectstack/templates — Development Roadmap

> Application templates for the ObjectStack cloud marketplace.
> Protocol: @objectstack/spec v3.0.8 | Last Updated: February 2026

## Strategic Direction

This repository provides small, production-ready application templates that can be deployed directly to the ObjectStack cloud marketplace. Each template is a self-contained plugin built on `@objectstack/spec`.

```
2026 Q1  ████████████████  Phase 1: Project Initialization   ✅ COMPLETE
2026 Q1  ████████████████  Phase 2: Core Templates (Todo, Blog, Inventory)  🔄 IN PROGRESS
2026 Q2  ████████████████  Phase 3: Extended Templates (Scheduler, FAQ, Project)  ⬜ PLANNED
2026 Q3  ████████████████  Phase 4: Marketplace Integration & Polish  ⬜ PLANNED
```

## Current State

| Metric | Value |
|--------|-------|
| Protocol Version | @objectstack/spec v3.0.8 |
| Templates | 3 (todo, blog, inventory) |
| Total Objects | 8 |

---

## Phase 1: Project Initialization ✅ COMPLETE

- [x] Monorepo scaffold (pnpm workspaces, TypeScript, ESLint, Vitest)
- [x] Root configuration files (package.json, tsconfig.json, .eslintrc.json, .gitignore)
- [x] Base TypeScript config shared across all templates
- [x] README.md, ROADMAP.md, CONTRIBUTING.md

---

## Phase 2: Core Templates 🔄 IN PROGRESS

### Todo — Task Management
- [x] `todo_list.object.ts` — TodoList with title, description, color
- [x] `todo_item.object.ts` — TodoItem with title, priority, due date, status, list lookup
- [x] `plugin.ts` — Plugin definition with navigation
- [x] `objectstack.config.ts` — Standalone config

### Blog — Content Management
- [x] `category.object.ts` — Blog categories
- [x] `post.object.ts` — Blog posts with rich text, status workflow, category lookup
- [x] `comment.object.ts` — Post comments with moderation
- [x] `plugin.ts` — Plugin definition with navigation
- [x] `objectstack.config.ts` — Standalone config

### Inventory — Stock Management
- [x] `supplier.object.ts` — Supplier/vendor records
- [x] `product.object.ts` — Products with SKU, pricing, and stock levels
- [x] `stock_movement.object.ts` — Stock in/out transactions
- [x] `plugin.ts` — Plugin definition with navigation
- [x] `objectstack.config.ts` — Standalone config

---

## Phase 3: Extended Templates ⬜ PLANNED

- [ ] **scheduler** — Event/appointment scheduler with calendar view
- [ ] **faq** — FAQ and knowledge base management
- [ ] **project** — Lightweight project and task tracker
- [ ] **expense** — Expense reporting and approval workflow
- [ ] **survey** — Survey builder with question types and response tracking

---

## Phase 4: Marketplace Integration ⬜ PLANNED

- [ ] Marketplace metadata (icons, screenshots, pricing tiers)
- [ ] One-click deploy documentation
- [ ] Demo seed data for each template
- [ ] Template versioning and changelog conventions
- [ ] CI/CD pipeline for automated template validation

---

## Version History

| Date | Version | Notes |
|------|---------|-------|
| 2026-02-24 | v1.0.0 | Project initialization — monorepo scaffold + 3 core templates |
