// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Evidence Expiring — alerts at T-30 and T-7 days before evidence
 * expires_on, so collectors have time to re-pull. Same equality pattern
 * as the contracts renewal alert.
 */
export const EvidenceExpiringFlow: Flow = {
  name: 'compliance_evidence_expiring',
  label: 'Alert When Evidence Expiring',
  description: 'Notifies evidence collector at T-30 and T-7 days before expires_on.',
  type: 'record_change',

  variables: [{ name: 'evidenceId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'compliance_evidence',
        criteria:
          'status == "approved" && expires_on != null && (expires_on == daysFromNow(30) || expires_on == daysFromNow(7))',
        criteriaDialect: 'cel',
      },
    },
    {
      id: 'get_evidence',
      type: 'get_record',
      label: 'Load Evidence',
      config: {
        objectName: 'compliance_evidence',
        filter: { id: '{evidenceId}' },
        outputVariable: 'ev',
      },
    },
    {
      id: 'notify',
      type: 'notify',
      label: 'Notify Collector',
      config: {
        recipients: ['{ev.collected_by}'],
        title: 'Evidence expiring soon: {ev.title}',
        body: 'Evidence "{ev.title}" expires on {ev.expires_on}. Collect a fresh copy and resubmit.',
        actionUrl: '/objects/compliance_evidence/{ev.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_evidence', type: 'default' },
    { id: 'e2', source: 'get_evidence', target: 'notify', type: 'default' },
    { id: 'e3', source: 'notify', target: 'end', type: 'default' },
  ],
};
