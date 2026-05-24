// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ApprovalProcess } from '@objectstack/spec/automation';

/**
 * Urgent-task approval — when priority becomes "urgent" the task must be
 * approved by a project lead before it leaves the `todo` state. Mirrors the
 * approval status onto `task.approval_status` and notifies the submitter
 * on both outcomes.
 */
export const UrgentTaskApproval = ApprovalProcess.create({
  name: 'todo_urgent_task_approval',
  label: 'Urgent Task Approval',
  object: 'todo_task',
  active: true,
  description: "Tasks marked urgent require a lead's sign-off before work begins.",

  entryCriteria: 'record.priority == "urgent"',
  lockRecord: false,
  approvalStatusField: 'approval_status',

  onSubmit: [
    {
      type: 'inbox_notify',
      name: 'notify_lead',
      config: {
        to: 'pending_approvers',
        title: 'Urgent task needs approval',
        body: 'Task {record_id} is marked urgent and is awaiting your approval.',
        link: '/system/approvals',
      },
    },
  ],

  onFinalApprove: [
    {
      type: 'inbox_notify',
      name: 'notify_submitter_approved',
      config: {
        to: 'submitter',
        title: 'Urgent task approved',
        body: 'Your urgent task {record_id} was approved — you can start work.',
        link: '/system/approvals',
      },
    },
  ],

  onFinalReject: [
    {
      type: 'field_update',
      name: 'downgrade_priority',
      config: { field: 'priority', value: 'high' },
    },
    {
      type: 'inbox_notify',
      name: 'notify_submitter_rejected',
      config: {
        to: 'submitter',
        title: 'Urgent task rejected — downgraded to High',
        body: 'Task {record_id} was rejected for urgent priority: {comment}',
        link: '/system/approvals',
      },
    },
  ],

  steps: [
    {
      name: 'lead_review',
      label: 'Project Lead Review',
      description: 'A lead validates the urgency.',
      approvers: [{ type: 'role', value: 'lead' }],
      behavior: 'first_response',
      rejectionBehavior: 'reject_process',
    },
  ],
});
