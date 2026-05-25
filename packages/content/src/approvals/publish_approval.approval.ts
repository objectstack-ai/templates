// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { ApprovalProcess } from '@objectstack/spec/automation';

/**
 * publish_approval — gating the `in_review → approved` transition on a
 * content piece. One step: the editorial lead role approves; rejection
 * sends the piece back to the previous status (drafting) so the writer
 * can iterate.
 *
 * Entry criteria: a piece reaches `in_review`. The state-machine APPROVE
 * transition is wired to this process's onApprove side effect.
 */
export const PublishApprovalProcess: ApprovalProcess = {
  name: 'publish_approval',
  label: 'Publish Approval',
  object: 'content_piece',
  description:
    'Editorial-lead sign-off required before a piece moves from in_review to approved. Rejection bounces back to drafting.',
  active: true,
  entryCriteria: { dialect: 'cel', source: 'status == "in_review"' },
  lockRecord: true,
  approvalStatusField: 'status',

  steps: [
    {
      name: 'lead_signoff',
      label: 'Editorial Lead Sign-off',
      description: 'The editorial lead reviews the draft and approves or requests changes.',
      approvers: [{ type: 'role', value: 'lead' }],
      behavior: 'first_response',
      rejectionBehavior: 'back_to_previous',
      onApprove: [
        {
          name: 'set_status_approved',
          type: 'field_update',
          config: { field: 'status', value: 'approved' },
        },
      ],
      onReject: [
        {
          name: 'set_status_drafting',
          type: 'field_update',
          config: { field: 'status', value: 'drafting' },
        },
        {
          name: 'notify_writer',
          type: 'inbox_notify',
          config: {
            recipients: ['{record.assignee}'],
            title: 'Changes requested: {record.title}',
            body: 'Your piece needs revisions before it can be approved.',
            link: '/objects/content_piece/{record.id}',
          },
        },
      ],
    },
  ],

  onFinalApprove: [
    {
      name: 'notify_writer_approved',
      type: 'inbox_notify',
      config: {
        recipients: ['{record.assignee}'],
        title: 'Approved: {record.title}',
        body: 'Your piece is approved. Schedule it whenever ready.',
        link: '/objects/content_piece/{record.id}',
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
