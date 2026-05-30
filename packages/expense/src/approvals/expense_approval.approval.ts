// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { ApprovalProcess } from '@objectstack/spec/automation';

/**
 * expense_approval — gates the `submitted → approved` transition on an
 * expense report. One step: the expense-manager role approves; rejection
 * sends the report to `rejected` so the employee can reopen and fix it.
 *
 * Entry criteria: a report reaches `submitted`. The state-machine APPROVE
 * transition is wired to this process's onApprove side effect.
 */
export const ExpenseApprovalProcess: ApprovalProcess = {
  name: 'expense_approval',
  label: 'Expense Approval',
  object: 'expense_report',
  description:
    'Manager sign-off required before a report moves from submitted to approved. Rejection sends it back to the employee.',
  active: true,
  entryCriteria: { dialect: 'cel', source: 'status == "submitted"' },
  lockRecord: true,
  approvalStatusField: 'status',

  steps: [
    {
      name: 'manager_signoff',
      label: 'Manager Sign-off',
      description: 'The expense manager reviews the report and approves or rejects.',
      approvers: [{ type: 'role', value: 'expense_manager' }],
      behavior: 'first_response',
      rejectionBehavior: 'reject_process',
      onApprove: [
        {
          name: 'set_status_approved',
          type: 'field_update',
          config: { field: 'status', value: 'approved' },
        },
      ],
      onReject: [
        {
          name: 'set_status_rejected',
          type: 'field_update',
          config: { field: 'status', value: 'rejected' },
        },
        {
          name: 'notify_employee_rejected',
          type: 'inbox_notify',
          config: {
            recipients: ['{record.requester}'],
            title: 'Changes requested: {record.title}',
            body: 'Your expense report was sent back. Review the notes, fix it, and resubmit.',
            link: '/objects/expense_report/{record.id}',
          },
        },
      ],
    },
  ],

  onFinalApprove: [
    {
      name: 'notify_employee_approved',
      type: 'inbox_notify',
      config: {
        recipients: ['{record.requester}'],
        title: 'Approved: {record.title}',
        body: 'Your expense report is approved and queued for reimbursement.',
        link: '/objects/expense_report/{record.id}',
      },
    },
  ],

  escalation: {
    enabled: true,
    timeoutHours: 72,
    action: 'notify',
    notifySubmitter: true,
  },
};
