// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Assessment lifecycle: a control test result.
 *   planned     → in_progress    (BEGIN — auditor starts work)
 *   in_progress → passed         (PASS — control operating effectively)
 *   in_progress → failed         (FAIL — gaps found)
 *   in_progress → partial        (PARTIAL — some gaps, mitigations in place)
 *   passed      → in_progress    (REOPEN — re-test triggered)
 *   failed      → in_progress    (REMEDIATE — fix in flight)
 *   partial     → in_progress    (REOPEN)
 */
export const AssessmentStateMachine: StateMachineConfig = {
  id: 'assessment_lifecycle',
  initial: 'planned',
  states: {
    planned:     { on: { BEGIN: { target: 'in_progress' } } },
    in_progress: {
      on: {
        PASS:    { target: 'passed' },
        FAIL:    { target: 'failed' },
        PARTIAL: { target: 'partial' },
      },
    },
    passed:  { on: { REOPEN: { target: 'in_progress' } } },
    failed:  { on: { REMEDIATE: { target: 'in_progress' } } },
    partial: { on: { REOPEN: { target: 'in_progress' } } },
  },
};
