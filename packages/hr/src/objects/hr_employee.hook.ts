// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * Employee integrity hook — enforces invariants that can't be expressed as a
 * build-validated CEL predicate.
 *
 * The self-manager guard ("an employee cannot be their own manager") needs the
 * record's own primary key. Under ADR-0032, `objectstack build` validates
 * validation-rule predicates against the *declared* field set, and the implicit
 * `id` is not a declared field — so `record.manager == record.id` fails the
 * build. We enforce it here instead, where the record id is available on the
 * hook context (`input.id` on update, `previous.id` for the prior state).
 */
const employeeHook: Hook = {
  name: 'hr_employee_integrity',
  object: 'hr_employee',
  events: ['beforeInsert', 'beforeUpdate'],
  priority: 100,
  description: 'Enforce employee invariants that the expression layer cannot.',
  handler: async (ctx: HookContext) => {
    const { input, previous } = ctx as HookContext & {
      input: Record<string, unknown>;
      previous?: Record<string, unknown>;
    };

    // An employee cannot be their own manager. `manager` is a lookup that
    // stores the related employee's id, so compare it to this record's id.
    const manager = input.manager ?? previous?.manager ?? null;
    const recordId = input.id ?? previous?.id ?? null;
    if (manager != null && recordId != null && manager === recordId) {
      throw new Error('An employee cannot be their own manager.');
    }
  },
};

export default employeeHook;
export { employeeHook };
