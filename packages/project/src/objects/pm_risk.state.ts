// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { StateMachineSchema } from '@objectstack/spec/automation';

/**
 * Risk status state machine.
 * Lifecycle: identified → assessed → mitigating → monitoring → closed/realized
 */
export const RiskStateMachine: StateMachineSchema = {
  field: 'status',
  initial: 'identified',

  states: [
    {
      value: 'identified',
      label: 'Identified',
      description: 'Risk has been logged.',
      actions: [],
    },
    {
      value: 'assessing',
      label: 'Assessing',
      description: 'Impact and likelihood being evaluated.',
      actions: [],
    },
    {
      value: 'mitigating',
      label: 'Mitigating',
      description: 'Actively working to reduce risk.',
      actions: [],
    },
    {
      value: 'monitoring',
      label: 'Monitoring',
      description: 'Mitigation in place, watching for triggers.',
      actions: [],
    },
    {
      value: 'closed',
      label: 'Closed',
      description: 'Risk no longer relevant.',
      terminal: true,
      actions: [],
    },
    {
      value: 'realized',
      label: 'Realized',
      description: 'Risk has occurred, now an issue.',
      terminal: true,
      actions: [],
    },
  ],

  transitions: [
    { from: 'identified', to: 'assessing', label: 'Start Assessment' },
    { from: 'identified', to: 'closed', label: 'Close (Not Relevant)' },
    { from: 'assessing', to: 'mitigating', label: 'Begin Mitigation' },
    { from: 'assessing', to: 'monitoring', label: 'Accept & Monitor' },
    { from: 'assessing', to: 'closed', label: 'Close' },
    { from: 'mitigating', to: 'monitoring', label: 'Mitigation Complete' },
    { from: 'mitigating', to: 'realized', label: 'Risk Realized' },
    { from: 'monitoring', to: 'mitigating', label: 'Re-Activate Mitigation' },
    { from: 'monitoring', to: 'closed', label: 'Close' },
    { from: 'monitoring', to: 'realized', label: 'Risk Realized' },
  ],
};
