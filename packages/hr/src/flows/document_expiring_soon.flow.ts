// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Document expiry reminder — fires when a document's `expires_at` falls
 * within 30 days. Notifies HR (role:hr_admin) plus the owning employee's
 * login user.
 *
 * In a real deployment you'd run this as a scheduled scan; this template
 * keeps it as a `record_change` flow that re-checks on every document
 * touch so the seed data demonstrates it without extra cron infra.
 */
export const DocumentExpiringSoonFlow: Flow = {
  name: 'hr_document_expiring_soon',
  label: 'Alert When Document Expires Within 30 Days',
  description: 'When an employee document is due to expire within 30 days, notify HR.',
  type: 'record_change',

  variables: [{ name: 'docId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'hr_document',
        criteria:
          'expires_at != NULL AND expires_at >= TODAY() AND expires_at <= TODAY() + 30',
      },
    },
    {
      id: 'get_doc',
      type: 'get_record',
      label: 'Load Document',
      config: {
        objectName: 'hr_document',
        filter: { id: '{docId}' },
        outputVariable: 'doc',
      },
    },
    {
      id: 'get_employee',
      type: 'get_record',
      label: 'Load Employee',
      config: {
        objectName: 'hr_employee',
        filter: { id: '{doc.employee}' },
        outputVariable: 'emp',
      },
    },
    {
      id: 'notify_hr',
      type: 'script',
      label: 'Notify HR',
      config: {
        actionType: 'notification',
        recipients: ['role:hr_admin', '{emp.user}'],
        title: 'Document expiring: {doc.name}',
        body:
          '{doc.name} ({doc.doc_type}) for {emp.full_name} expires {doc.expires_at}.',
        link: '/objects/hr_document/{doc.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_doc', type: 'default' },
    { id: 'e2', source: 'get_doc', target: 'get_employee', type: 'default' },
    { id: 'e3', source: 'get_employee', target: 'notify_hr', type: 'default' },
    { id: 'e4', source: 'notify_hr', target: 'end', type: 'default' },
  ],
};
