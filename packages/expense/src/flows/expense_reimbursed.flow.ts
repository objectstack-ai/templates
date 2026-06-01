// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Expense Reimbursed — when a report moves to "reimbursed", confirm to the
 * employee that the money is on the way, including the payment reference.
 */
export const ExpenseReimbursedFlow: Flow = {
  name: 'expense_report_reimbursed',
  label: 'Notify Employee When Reimbursed',
  description:
    'When an expense report is marked reimbursed, notify the employee with the payment reference.',
  type: 'record_change',

  variables: [{ name: 'reportId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'expense_report',
        criteria: 'status == "reimbursed"',
        criteriaDialect: 'cel',
      },
    },
    {
      id: 'get_report',
      type: 'get_record',
      label: 'Load Report',
      config: {
        objectName: 'expense_report',
        filter: { id: '{reportId}' },
        outputVariable: 'report',
      },
    },
    {
      id: 'notify_employee',
      type: 'notify',
      label: 'Notify Employee',
      config: {
        recipients: ['{report.requester}'],
        title: 'Reimbursed: {report.title}',
        body: 'Your expense report "{report.title}" ({report.total_amount}) has been reimbursed via {report.payment_method}. Reference: {report.payment_reference}.',
        actionUrl: '/objects/expense_report/{report.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_report', type: 'default' },
    { id: 'e2', source: 'get_report', target: 'notify_employee', type: 'default' },
    { id: 'e3', source: 'notify_employee', target: 'end', type: 'default' },
  ],
};
