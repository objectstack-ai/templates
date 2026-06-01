// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Project status state machine.
 * Drives the lifecycle: planning → active → (at_risk / on_hold) → completed/cancelled
 */
export const ProjectStateMachine: StateMachineConfig = {
  id: 'project_lifecycle',
  initial: 'planning',
  states: {
    planning: {
      on: {
        START: { target: 'active', description: 'Scope approved — kick the project off.' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Project is being scoped. Confirm dates and a project manager before transitioning to active.',
      },
    },
    active: {
      on: {
        FLAG_RISK: { target: 'at_risk', description: 'Risks or delays identified.' },
        PAUSE: { target: 'on_hold', description: 'Paused by an external blocker.' },
        COMPLETE: { target: 'completed', description: 'All milestones delivered.' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Project is underway. Move to at_risk if AI risk score is high or a milestone slips.',
      },
    },
    at_risk: {
      on: {
        MITIGATE: { target: 'active', description: 'Risks mitigated — back on track.' },
        PAUSE: { target: 'on_hold', description: 'Paused by an external blocker.' },
        COMPLETE: { target: 'completed', description: 'Delivered despite risks.' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions:
          'Project has identified risks. Recommend mitigation actions before resuming or completing.',
      },
    },
    on_hold: {
      on: {
        RESUME: { target: 'active', description: 'Blocker cleared — resume work.' },
        CANCEL: { target: 'cancelled' },
      },
      meta: {
        aiInstructions: 'Project paused. Surface the blocker and an expected resume date.',
      },
    },
    completed: {
      type: 'final',
      meta: {
        aiInstructions: 'Project delivered and terminal. Do not change status.',
      },
    },
    cancelled: {
      type: 'final',
      meta: {
        aiInstructions: 'Project cancelled and terminal. Do not change status.',
      },
    },
  },
};
