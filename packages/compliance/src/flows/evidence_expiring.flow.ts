// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
type Flow = Automation.Flow;

/**
 * Evidence Expiring — alerts the collector at T-30 and T-7 days before an
 * approved evidence record's `expires_on`, so they have time to re-pull.
 *
 * Why a SCHEDULED flow, not record-change (#1874): the alert days are time-
 * relative. A record-change trigger only fires on row mutation, so it would
 * almost never fire on the right day. The daily schedule selects the records
 * landing on an alert day instead.
 *
 * Each tier is a one-day window `[daysFromNow(N), daysFromNow(N+1))` rather than
 * an exact `== daysFromNow(N)`: `expires_on` carries a time component, so two
 * independently-computed timestamps never compare equal, whereas the abutting
 * 24h windows tile the timeline so a record falls in exactly one — fires once
 * per tier, idempotent by construction (no guard field).
 */
export const EvidenceExpiringFlow: Flow = {
  name: 'compliance_evidence_expiring',
  label: 'Alert When Evidence Expiring',
  description:
    'Daily scheduled job: notifies the evidence collector at T-30 and T-7 days before expires_on.',
  type: 'schedule',

  variables: [],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start (Scheduled)',
      config: {
        schedule: 'cron:0 9 * * *', // Daily at 9am
      },
    },
    {
      id: 'query_expiring',
      type: 'get_record',
      label: 'Find Evidence Hitting an Alert Day',
      config: {
        objectName: 'compliance_evidence',
        filter: {
          status: 'approved',
          $or: [
            { expires_on: { $gte: cel`daysFromNow(7)`, $lt: cel`daysFromNow(8)` } },
            { expires_on: { $gte: cel`daysFromNow(30)`, $lt: cel`daysFromNow(31)` } },
          ],
        },
        limit: 500,
        outputVariable: 'expiringEvidence',
      },
    },
    {
      id: 'foreach_evidence',
      type: 'loop',
      label: 'For Each Expiring Evidence',
      config: {
        collection: '{expiringEvidence.records}',
        iteratorVar: 'evidence',
      },
    },
    {
      id: 'notify',
      type: 'notify',
      label: 'Notify Collector',
      config: {
        recipients: ['{evidence.collected_by}'],
        title: 'Evidence expiring soon: {evidence.title}',
        body: 'Evidence "{evidence.title}" expires on {evidence.expires_on}. Collect a fresh copy and resubmit.',
        actionUrl: '/objects/compliance_evidence/{evidence.id}',
      },
    },
    { id: 'end_loop', type: 'end', label: 'End Loop Iteration' },
    { id: 'end', type: 'end', label: 'End Flow' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_expiring', type: 'default' },
    { id: 'e2', source: 'query_expiring', target: 'foreach_evidence', type: 'default' },
    { id: 'e3', source: 'foreach_evidence', target: 'notify', type: 'default' },
    { id: 'e4', source: 'notify', target: 'end_loop', type: 'default' },
    { id: 'e5', source: 'end_loop', target: 'end', type: 'default' },
  ],
};
