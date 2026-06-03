// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Failed Control Escalation — when an assessment moves to "failed" on
 * a high-criticality control, page the owner AND the framework owner.
 * Partial failures notify control owner only.
 */
export const FailedControlEscalationFlow: Flow = {
  name: 'compliance_failed_control_escalation',
  label: 'Escalate Failed High-Criticality Controls',
  description:
    'When a failed assessment is logged on a high-criticality control, notify the control owner and compliance team.',
  type: 'record_change',

  variables: [{ name: 'assessmentId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'compliance_assessment',
        triggerType: 'record-after-update',
        condition: 'status == "failed"',
      },
    },
    {
      id: 'get_assessment',
      type: 'get_record',
      label: 'Load Assessment',
      config: {
        objectName: 'compliance_assessment',
        filter: { id: '{record.id}' },
        outputVariable: 'asmt',
      },
    },
    {
      id: 'get_control',
      type: 'get_record',
      label: 'Load Control',
      config: {
        objectName: 'compliance_control',
        filter: { id: '{asmt.control}' },
        outputVariable: 'ctrl',
      },
    },
    {
      id: 'notify_owner',
      type: 'notify',
      label: 'Notify Control Owner',
      config: {
        recipients: ['{ctrl.owner}', 'role:compliance_admin'],
        title: 'Failed control: {ctrl.code} {ctrl.title}',
        body: 'Assessment "{asmt.title}" on {ctrl.code} ({ctrl.criticality}) FAILED. Remediation due {asmt.remediation_due}.',
        actionUrl: '/objects/compliance_assessment/{asmt.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_assessment', type: 'default' },
    { id: 'e2', source: 'get_assessment', target: 'get_control', type: 'default' },
    { id: 'e3', source: 'get_control', target: 'notify_owner', type: 'default' },
    { id: 'e4', source: 'notify_owner', target: 'end', type: 'default' },
  ],
};
