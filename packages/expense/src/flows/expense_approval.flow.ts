// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Expense Approval — the 7.4.x approval model (ADR-0019): an `approval` node on
 * a record-change flow replaces the old standalone ApprovalProcess. The node
 * opens an approval request when a report reaches `submitted`, locks the record,
 * and suspends the run until the expense-manager decides. It then resumes down
 * its `approve` or `reject` out-edge.
 *
 *   approve → status = approved, notify the employee
 *   reject  → status = rejected, notify the employee to fix and resubmit
 *
 * Entry criteria (status == submitted) lives on the start node; on-decision side
 * effects live on the nodes wired to the approve/reject edges.
 */
export const ExpenseApprovalFlow: Flow = {
  name: 'expense_report_approval',
  label: 'Expense Approval',
  description:
    'Manager sign-off gates submitted → approved. Rejection sends the report back to the employee.',
  type: 'record_change',

  variables: [{ name: 'reportId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'expense_report',
        triggerType: 'record-after-update',
        condition: 'status == "submitted"',
      },
    },
    {
      id: 'manager_signoff',
      type: 'approval',
      label: 'Manager Sign-off',
      config: {
        approvers: [{ type: 'role', value: 'expense_manager' }],
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
        objectName: 'expense_report',
        filter: { id: '{record.id}' },
        fields: { status: 'approved' },
      },
    },
    {
      id: 'notify_approved',
      type: 'notify',
      label: 'Notify Employee — Approved',
      config: {
        recipients: ['{record.requester}'],
        title: 'Approved: {record.title}',
        body: 'Your expense report is approved and queued for reimbursement.',
        actionUrl: '/objects/expense_report/{record.id}',
      },
    },
    {
      id: 'set_rejected',
      type: 'update_record',
      label: 'Mark Rejected',
      config: {
        objectName: 'expense_report',
        filter: { id: '{record.id}' },
        fields: { status: 'rejected' },
      },
    },
    {
      id: 'notify_rejected',
      type: 'notify',
      label: 'Notify Employee — Changes Requested',
      config: {
        recipients: ['{record.requester}'],
        title: 'Changes requested: {record.title}',
        body: 'Your expense report was sent back. Review the notes, fix it, and resubmit.',
        actionUrl: '/objects/expense_report/{record.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'manager_signoff', type: 'default' },
    {
      id: 'e2',
      source: 'manager_signoff',
      target: 'set_approved',
      type: 'conditional',
      label: 'approve',
    },
    { id: 'e3', source: 'set_approved', target: 'notify_approved', type: 'default' },
    { id: 'e4', source: 'notify_approved', target: 'end', type: 'default' },
    {
      id: 'e5',
      source: 'manager_signoff',
      target: 'set_rejected',
      type: 'conditional',
      label: 'reject',
    },
    { id: 'e6', source: 'set_rejected', target: 'notify_rejected', type: 'default' },
    { id: 'e7', source: 'notify_rejected', target: 'end', type: 'default' },
  ],
};
