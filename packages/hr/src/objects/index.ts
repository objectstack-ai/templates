// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Object barrel — re-exports schemas only. Hooks and state machines are
 * wired separately (see `../hooks/index.ts` and `*.state.ts`).
 */
export { Department } from './hr_department.object';
export { Employee } from './hr_employee.object';
export { TimeOffRequest } from './hr_time_off_request.object';
export { EmployeeDocument } from './hr_document.object';
