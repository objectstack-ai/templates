// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Expense-Report lifecycle:
 *   draft      → submitted   (SUBMIT — send for approval)
 *   submitted  → approved    (APPROVE — manager/finance signs off)
 *   submitted  → rejected    (REJECT — denied)
 *   submitted  → draft       (KICKBACK — send back for edits)
 *   approved   → reimbursed  (REIMBURSE — payment issued)
 *   rejected   → draft       (REOPEN — fix and resubmit)
 *
 * "reimbursed" is terminal: money has gone back to the employee.
 */
export const ExpenseReportStateMachine: StateMachineConfig = {
  id: 'expense_report_lifecycle',
  initial: 'draft',
  states: {
    draft: { on: { SUBMIT: { target: 'submitted', description: 'Submit for approval' } } },
    submitted: {
      on: {
        APPROVE: { target: 'approved' },
        REJECT: { target: 'rejected' },
        KICKBACK: { target: 'draft', description: 'Send back for edits' },
      },
      meta: {
        aiInstructions:
          'Awaiting approval. Do not transition automatically; wait for the approval process.',
      },
    },
    approved: { on: { REIMBURSE: { target: 'reimbursed', description: 'Issue reimbursement' } } },
    rejected: { on: { REOPEN: { target: 'draft' } } },
    reimbursed: {
      type: 'final',
      meta: { aiInstructions: 'Paid out. Terminal — open a new report for future expenses.' },
    },
  },
};
