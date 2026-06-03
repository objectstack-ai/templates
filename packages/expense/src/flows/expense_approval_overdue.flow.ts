// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Expense Approval Overdue — when a report has been sitting in "submitted"
 * for 3 days without a decision, nudge the approver pool. The daily
 * scheduler re-evaluates the criteria so it fires once the boundary is
 * crossed (submitted_at == 3 days ago).
 */
export const ExpenseApprovalOverdueFlow: Flow = {
  name: 'expense_report_approval_overdue',
  label: 'Escalate Stale Pending Approvals',
  description:
    'When a submitted report has waited 3 days for approval, re-notify the expense-manager role.',
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
        condition: 'status == "submitted" && submitted_at != null && submitted_at == daysAgo(3)',
      },
    },
    {
      id: 'get_report',
      type: 'get_record',
      label: 'Load Report',
      config: {
        objectName: 'expense_report',
        filter: { id: '{record.id}' },
        outputVariable: 'report',
      },
    },
    {
      id: 'escalate',
      type: 'notify',
      label: 'Escalate',
      config: {
        recipients: ['role:expense_manager'],
        title: 'Still pending: {report.title}',
        body: 'Report "{report.title}" ({report.total_amount}) has awaited approval for 3 days. Please review.',
        actionUrl: '/objects/expense_report/{report.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_report', type: 'default' },
    { id: 'e2', source: 'get_report', target: 'escalate', type: 'default' },
    { id: 'e3', source: 'escalate', target: 'end', type: 'default' },
  ],
};
