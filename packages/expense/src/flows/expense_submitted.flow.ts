// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Expense Submitted — when a report is submitted, notify the approver pool
 * so it lands in someone's queue. The approval process (expense_approval)
 * formally gates the decision; this flow just raises the signal.
 */
export const ExpenseSubmittedFlow: Flow = {
  name: 'expense_report_submitted',
  label: 'Notify Approver on Submit',
  description: 'When an expense report is submitted, alert the expense-manager role to review it.',
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
      id: 'notify_manager',
      type: 'notify',
      label: 'Notify Manager',
      config: {
        recipients: ['role:expense_manager'],
        title: 'Expense report awaiting approval: {report.title}',
        body: 'Report "{report.title}" for {report.total_amount} ({report.cost_center}) is awaiting your approval.',
        actionUrl: '/objects/expense_report/{report.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_report', type: 'default' },
    { id: 'e2', source: 'get_report', target: 'notify_manager', type: 'default' },
    { id: 'e3', source: 'notify_manager', target: 'end', type: 'default' },
  ],
};
