# ObjectStack Templates Roadmap

> Development plan for the ObjectStack application templates collection.
> Protocol: @objectstack/spec v3.0.8 | Last Updated: February 2026

## Strategic Direction

This repository provides small, focused application templates for the ObjectStack cloud marketplace. Each template demonstrates a common business use case and serves as a starting point for developers building on @objectstack/spec.

## Current State

| Metric | Value |
|--------|-------|
| Protocol Version | @objectstack/spec v3.0.8 |
| Available Templates | 2 |
| Total Business Objects | 3 |

## Templates

### Phase 1: Foundation Templates ✅ COMPLETE

- [x] **Project initialization** — monorepo structure, tooling, documentation
- [x] **Todo App** (`apps/todo`) — simple task management with status, priority, due date
- [x] **Blog App** (`apps/blog`) — blog/CMS with posts and categories

### Phase 2: Productivity Templates 🔄 PLANNED

- [ ] **Expense Tracker** (`apps/expense`) — personal and team expense tracking
  - Objects: `expense`, `expense_category`, `expense_report`
- [ ] **Contact Book** (`apps/contacts`) — simple contact management
  - Objects: `contact`, `contact_group`
- [ ] **Event Manager** (`apps/events`) — event scheduling and management
  - Objects: `event`, `attendee`, `venue`

### Phase 3: Business Templates 🔄 PLANNED

- [ ] **Inventory Manager** (`apps/inventory`) — simple stock tracking
  - Objects: `product`, `stock_item`, `stock_movement`
- [ ] **Help Desk** (`apps/helpdesk`) — basic support ticket system
  - Objects: `ticket`, `ticket_comment`, `kb_article`
- [ ] **Project Tracker** (`apps/projects`) — lightweight project management
  - Objects: `project`, `milestone`, `task`

### Phase 4: Advanced Templates 🔄 PLANNED

- [ ] **Survey & Forms** (`apps/survey`) — form builder and data collection
  - Objects: `survey`, `question`, `response`
- [ ] **Booking System** (`apps/booking`) — appointment and reservation management
  - Objects: `service`, `booking`, `time_slot`
- [ ] **Newsletter** (`apps/newsletter`) — subscriber and campaign management
  - Objects: `subscriber`, `campaign`, `send_log`

## Template Guidelines

Every template must:
- Have at most 5 business objects
- Include unit tests for all objects
- Have zero dependencies beyond `@objectstack/spec`
- Include a `README.md` explaining the use case
- Follow snake_case naming conventions for object names and field names

## Version History

| Date | Change |
|------|--------|
| 2026-02-24 | Phase 1 complete: project initialized, todo and blog templates added |
