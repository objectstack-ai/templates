// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Object barrel — re-exports schemas only. Hooks and state machines are
 * wired separately (see `../hooks/index.ts` and `*.state.ts`).
 */
export { Project } from './project.object';
export { Task } from './task.object';
export { Label } from './label.object';
export { TaskLabel } from './task_label.object';
