// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
type Flow = Automation.Flow;

/**
 * Document expiry reminder — alerts HR (and the owning employee) when an
 * employee document reaches T-30 days before its `expires_at`.
 *
 * Why a SCHEDULED flow, not record-change (#1874): "expires within 30 days" is
 * time-relative. A record-change trigger only fires on document touch, so an
 * untouched document would sail past the threshold. The daily schedule selects
 * documents landing on the T-30 day instead.
 *
 * Fires once, on the day `expires_at` is exactly 30 days out — idempotent by
 * construction (no guard field). NOTE: `daysFromNow(30)` is a timestamp; if your
 * engine's date/timestamp equality is too strict, widen to a one-day range.
 */
export const DocumentExpiringSoonFlow: Flow = {
  name: 'hr_document_expiring_soon',
  label: 'Alert When Document Expires Within 30 Days',
  description:
    'Daily scheduled job: when an employee document reaches T-30 days before expiry, notify HR.',
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
      label: 'Find Documents Hitting T-30',
      config: {
        objectName: 'hr_document',
        filter: { expires_at: cel`daysFromNow(30)` },
        limit: 500,
        outputVariable: 'expiringDocs',
      },
    },
    {
      id: 'foreach_doc',
      type: 'loop',
      label: 'For Each Expiring Document',
      config: {
        collection: '{expiringDocs.records}',
        iteratorVar: 'doc',
      },
    },
    {
      id: 'notify_hr',
      type: 'notify',
      label: 'Notify HR',
      config: {
        recipients: ['role:hr_admin', '{doc.employee.user}'],
        title: 'Document expiring: {doc.name}',
        body: '{doc.name} ({doc.doc_type}) for {doc.employee.full_name} expires {doc.expires_at}.',
        actionUrl: '/objects/hr_document/{doc.id}',
      },
    },
    { id: 'end_loop', type: 'end', label: 'End Loop Iteration' },
    { id: 'end', type: 'end', label: 'End Flow' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_expiring', type: 'default' },
    { id: 'e2', source: 'query_expiring', target: 'foreach_doc', type: 'default' },
    { id: 'e3', source: 'foreach_doc', target: 'notify_hr', type: 'default' },
    { id: 'e4', source: 'notify_hr', target: 'end_loop', type: 'default' },
    { id: 'e5', source: 'end_loop', target: 'end', type: 'default' },
  ],
};
