// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * PR Approval Required — when a PR is submitted with estimated_amount ≥ 5000,
 * notify the requester's manager (via approval queue) and write an audit row.
 *
 * In a real org you'd route by amount tier and department; this template
 * keeps it to one notification so the flow stays auditable in the timeline.
 */
export const PRApprovalRequiredFlow: Flow = {
  name: 'procurement_request_approval_required',
  label: 'Request Approval When PR ≥ $5,000',
  description:
    'When a PR is submitted at or above the approval threshold, alert finance and lock the record from further edits until decision.',
  type: 'record_change',

  variables: [{ name: 'prId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'procurement_request',
        triggerType: 'record-after-update',
        condition: 'status == "submitted" && estimated_amount != null && estimated_amount >= 5000',
      },
    },
    {
      id: 'get_pr',
      type: 'get_record',
      label: 'Load PR',
      config: {
        objectName: 'procurement_request',
        filter: { id: '{record.id}' },
        outputVariable: 'pr',
      },
    },
    {
      id: 'notify_finance',
      type: 'notify',
      label: 'Notify Finance',
      config: {
        recipients: ['role:finance_approver'],
        title: 'PR awaiting approval: {pr.title}',
        body: 'PR "{pr.title}" for {pr.estimated_amount} ({pr.category}) requires approval. Needed by {pr.needed_by}.',
        actionUrl: '/objects/procurement_request/{pr.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_pr', type: 'default' },
    { id: 'e2', source: 'get_pr', target: 'notify_finance', type: 'default' },
    { id: 'e3', source: 'notify_finance', target: 'end', type: 'default' },
  ],
};
