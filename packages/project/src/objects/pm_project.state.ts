// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { StateMachineSchema } from '@objectstack/spec/automation';

/**
 * Project status state machine.
 * Drives the lifecycle: planning → active → (at_risk) → completed/cancelled
 */
export const ProjectStateMachine: StateMachineSchema = {
  field: 'status',
  initial: 'planning',

  states: [
    {
      value: 'planning',
      label: 'Planning',
      description: 'Project is being scoped and planned.',
      actions: [],
    },
    {
      value: 'active',
      label: 'Active',
      description: 'Project is underway.',
      actions: [],
    },
    {
      value: 'at_risk',
      label: 'At Risk',
      description: 'Project has identified risks or delays.',
      actions: [],
    },
    {
      value: 'on_hold',
      label: 'On Hold',
      description: 'Project paused due to external blockers.',
      actions: [],
    },
    {
      value: 'completed',
      label: 'Completed',
      description: 'Project successfully delivered.',
      terminal: true,
      actions: [],
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      description: 'Project terminated before completion.',
      terminal: true,
      actions: [],
    },
  ],

  transitions: [
    { from: 'planning', to: 'active', label: 'Start Project' },
    { from: 'planning', to: 'cancelled', label: 'Cancel' },
    { from: 'active', to: 'at_risk', label: 'Flag Risk' },
    { from: 'active', to: 'on_hold', label: 'Pause' },
    { from: 'active', to: 'completed', label: 'Complete' },
    { from: 'active', to: 'cancelled', label: 'Cancel' },
    { from: 'at_risk', to: 'active', label: 'Risks Mitigated' },
    { from: 'at_risk', to: 'on_hold', label: 'Pause' },
    { from: 'at_risk', to: 'completed', label: 'Complete Despite Risks' },
    { from: 'at_risk', to: 'cancelled', label: 'Cancel' },
    { from: 'on_hold', to: 'active', label: 'Resume' },
    { from: 'on_hold', to: 'cancelled', label: 'Cancel' },
  ],
};
