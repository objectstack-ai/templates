// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * After an assessment moves into a terminal result (passed / failed /
 * partial), roll that status (plus assessed_at) up onto its Control so
 * the dashboard reflects the freshest view without joining at query time.
 */
const assessmentHook: Hook = {
  name: 'compliance_assessment_rollup',
  object: 'compliance_assessment',
  events: ['afterInsert', 'afterUpdate'],
  priority: 100,
  description: 'Roll assessment outcome onto Control.last_status / last_assessed_at.',
  handler: async (ctx: HookContext) => {
    const { input, services } = ctx as HookContext & {
      input: Record<string, unknown>;
      services?: {
        data?: {
          update(object: string, id: string, values: Record<string, unknown>): Promise<void>;
        };
      };
    };

    const controlId = input.control as string | undefined;
    const status = input.status as string | undefined;
    if (!controlId || !services?.data) return;
    if (status !== 'passed' && status !== 'failed' && status !== 'partial') return;

    await services.data.update('compliance_control', controlId, {
      last_status: status,
      last_assessed_at: (input.assessed_at as string | undefined) ?? new Date().toISOString(),
    });
  },
};

export default assessmentHook;
export { assessmentHook };
