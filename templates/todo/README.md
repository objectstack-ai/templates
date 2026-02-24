# @templates/todo

A minimal task management application template built on [@objectstack/spec](https://github.com/objectstack-ai/hotcrm) v3.0.8.

## Overview

This template provides the foundation for a todo / task management app with:

- **Todo Lists** — named collections with color labels and archiving
- **Todo Items** — tasks with priority, status, due dates, and assignments

## Business Objects

| Object | Description |
|--------|-------------|
| `todo_list` | Named list of tasks (title, color, owner) |
| `todo_item` | Individual task (title, priority, status, due date, list lookup) |

## Getting Started

```bash
# From the repository root
pnpm install

# Run in development mode
pnpm --filter @templates/todo dev

# Build
pnpm --filter @templates/todo build
```

## Customization Ideas

- Add tags or labels to todo items
- Add time tracking (estimated vs. actual hours)
- Add recurring task support
- Add team-level list sharing
