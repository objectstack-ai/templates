// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
type Flow = Automation.Flow;

/**
 * Expense Approval Overdue — nudges the expense-manager role about every report
 * that has waited 3+ days in `submitted` without a decision.
 *
 * Why a SCHEDULED flow, not record-change (#1874): "has waited 3 days" is time-
 * relative. A record-change trigger only fires on row mutation, so a report
 * left untouched would never cross the boundary. The daily schedule re-evaluates
 * against `daysAgo(3)`.
 *
 * Idempotency is declarative via status: the query is scoped to
 * `status == 'submitted'`, so a report drops out the moment it is approved or
 * rejected. (Still-pending reports are re-escalated daily on purpose.)
 */
export const ExpenseApprovalOverdueFlow: Flow = {
  name: 'expense_report_approval_overdue',
  label: 'Escalate Stale Pending Approvals',
  description:
    'Daily scheduled job: re-notifies the expense-manager role about reports that have waited 3+ days for approval.',
  type: 'schedule',

  variables: [],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start (Scheduled)',
      config: {
        schedule: 'cron:0 9 * * *', // Daily at 9am
      },
    },
    {
      id: 'query_stale',
      type: 'get_record',
      label: 'Find Stale Pending Reports',
      config: {
        objectName: 'expense_report',
        filter: {
          status: 'submitted',
          submitted_at: { $lte: cel`daysAgo(3)` },
        },
        limit: 500,
        outputVariable: 'staleReports',
      },
    },
    {
      id: 'foreach_report',
      type: 'loop',
      label: 'For Each Stale Report',
      config: {
        collection: '{staleReports.records}',
        iteratorVar: 'report',
      },
    },
    {
      id: 'escalate',
      type: 'notify',
      label: 'Escalate',
      config: {
        recipients: ['role:expense_manager'],
        title: 'Still pending: {report.title}',
        body: 'Report "{report.title}" ({report.total_amount}) has awaited approval for 3+ days. Please review.',
        actionUrl: '/objects/expense_report/{report.id}',
      },
    },
    { id: 'end_loop', type: 'end', label: 'End Loop Iteration' },
    { id: 'end', type: 'end', label: 'End Flow' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_stale', type: 'default' },
    { id: 'e2', source: 'query_stale', target: 'foreach_report', type: 'default' },
    { id: 'e3', source: 'foreach_report', target: 'escalate', type: 'default' },
    { id: 'e4', source: 'escalate', target: 'end_loop', type: 'default' },
    { id: 'e5', source: 'end_loop', target: 'end', type: 'default' },
  ],
};
