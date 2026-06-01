// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Publish Approval — the 7.4.x approval model (ADR-0019): an `approval` node on
 * a record-change flow replaces the old standalone ApprovalProcess. The node
 * opens an approval request when a piece reaches `in_review`, locks the record,
 * and suspends the run until the editorial lead decides. It then resumes down
 * its `approve` or `reject` out-edge.
 *
 *   approve → status = approved, notify the writer
 *   reject  → status = drafting (bounce back), notify the writer to revise
 *
 * Entry criteria (status == in_review) lives on the start node; on-decision
 * side effects live on the nodes wired to the approve/reject edges.
 */
export const PublishApprovalFlow: Flow = {
  name: 'content_publish_approval',
  label: 'Publish Approval',
  description:
    'Editorial-lead sign-off gates in_review → approved. Rejection bounces the piece back to drafting.',
  type: 'record_change',

  variables: [{ name: 'pieceId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'content_piece',
        criteria: 'status == "in_review"',
        criteriaDialect: 'cel',
      },
    },
    {
      id: 'lead_signoff',
      type: 'approval',
      label: 'Editorial Lead Sign-off',
      config: {
        approvers: [{ type: 'role', value: 'lead' }],
        behavior: 'first_response',
        lockRecord: true,
        escalation: {
          enabled: true,
          timeoutHours: 72,
          action: 'notify',
          notifySubmitter: true,
        },
      },
    },
    {
      id: 'set_approved',
      type: 'update_record',
      label: 'Mark Approved',
      config: {
        objectName: 'content_piece',
        recordId: '{pieceId}',
        values: { status: 'approved' },
      },
    },
    {
      id: 'notify_approved',
      type: 'notify',
      label: 'Notify Writer — Approved',
      config: {
        recipients: ['{record.assignee}'],
        title: 'Approved: {record.title}',
        body: 'Your piece is approved. Schedule it whenever ready.',
        actionUrl: '/objects/content_piece/{record.id}',
      },
    },
    {
      id: 'set_drafting',
      type: 'update_record',
      label: 'Send Back to Drafting',
      config: {
        objectName: 'content_piece',
        recordId: '{pieceId}',
        values: { status: 'drafting' },
      },
    },
    {
      id: 'notify_writer',
      type: 'notify',
      label: 'Notify Writer — Changes Requested',
      config: {
        recipients: ['{record.assignee}'],
        title: 'Changes requested: {record.title}',
        body: 'Your piece needs revisions before it can be approved.',
        actionUrl: '/objects/content_piece/{record.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'lead_signoff', type: 'default' },
    {
      id: 'e2',
      source: 'lead_signoff',
      target: 'set_approved',
      type: 'conditional',
      label: 'approve',
    },
    { id: 'e3', source: 'set_approved', target: 'notify_approved', type: 'default' },
    { id: 'e4', source: 'notify_approved', target: 'end', type: 'default' },
    {
      id: 'e5',
      source: 'lead_signoff',
      target: 'set_drafting',
      type: 'conditional',
      label: 'reject',
    },
    { id: 'e6', source: 'set_drafting', target: 'notify_writer', type: 'default' },
    { id: 'e7', source: 'notify_writer', target: 'end', type: 'default' },
  ],
};
