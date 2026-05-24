// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Evidence Auto-Expire — flips approved evidence to "expired" the day
 * after its expires_on date. Daily scheduler re-evaluates the criteria.
 */
export const EvidenceAutoExpireFlow: Flow = {
  name: 'compliance_evidence_auto_expire',
  label: 'Auto-Expire Stale Evidence',
  description: 'Flips approved evidence to expired status once expires_on has passed.',
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
          'status == "approved" && expires_on != null && expires_on == daysAgo(0)',
        criteriaDialect: 'cel',
      },
    },
    {
      id: 'mark_expired',
      type: 'update_record',
      label: 'Mark Expired',
      config: {
        objectName: 'compliance_evidence',
        recordId: '{evidenceId}',
        values: { status: 'expired' },
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'mark_expired', type: 'default' },
    { id: 'e2', source: 'mark_expired', target: 'end', type: 'default' },
  ],
};
