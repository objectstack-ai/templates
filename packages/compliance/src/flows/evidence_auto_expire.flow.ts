// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
type Flow = Automation.Flow;

/**
 * Evidence Auto-Expire — flips approved evidence to `expired` once its
 * `expires_on` date has passed.
 *
 * Why a SCHEDULED flow, not record-change (#1874): expiry is time-relative.
 * A record-change trigger only fires on row mutation, so untouched evidence
 * would never expire. A daily schedule re-evaluates against `today()`.
 *
 * Idempotency is the status transition: the bulk update only matches
 * `status == 'approved'`, and expiring flips it to `expired`. No guard field.
 */
export const EvidenceAutoExpireFlow: Flow = {
  name: 'compliance_evidence_auto_expire',
  label: 'Auto-Expire Stale Evidence',
  description: 'Flips approved evidence to expired status once expires_on has passed.',
  type: 'schedule',

  variables: [],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start (Scheduled)',
      config: {
        schedule: 'cron:0 1 * * *', // Daily at 1am
      },
    },
    {
      id: 'mark_expired',
      type: 'update_record',
      label: 'Expire Past-Due Evidence',
      config: {
        objectName: 'compliance_evidence',
        // Bulk update: every approved evidence row whose expiry has passed.
        // The status flip is the idempotency guard.
        filter: {
          status: 'approved',
          expires_on: { $lt: cel`today()` },
        },
        fields: { status: 'expired' },
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'mark_expired', type: 'default' },
    { id: 'e2', source: 'mark_expired', target: 'end', type: 'default' },
  ],
};
