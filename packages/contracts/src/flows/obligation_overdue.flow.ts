// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
type Flow = Automation.Flow;

/**
 * Obligation overdue — pings the assignee of every open obligation whose
 * due date has passed.
 *
 * Why a SCHEDULED flow, not record-change (#1874): "due date has passed" is a
 * time-relative condition. A record-change trigger only fires when the row is
 * mutated, so an untouched obligation would sail past its due date without
 * firing. A daily schedule re-evaluates the whole population against `today()`.
 *
 * Idempotency is declarative: the query is scoped to `status == 'open'`, so an
 * obligation drops out the moment it is marked done/waived. (Open overdue items
 * are re-pinged daily on purpose — a nag until it is dealt with.)
 */
export const ObligationOverdueFlow: Flow = {
  name: 'contracts_obligation_overdue_notify',
  label: 'Notify Assignee When Obligation Overdue',
  description:
    'Daily scheduled job: notifies the assignee of every open obligation past its due date.',
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
      id: 'query_overdue',
      type: 'get_record',
      label: 'Find Overdue Open Obligations',
      config: {
        objectName: 'contracts_obligation',
        filter: {
          status: 'open',
          due_date: { $lt: cel`today()` },
        },
        limit: 500,
        outputVariable: 'overdueObligations',
      },
    },
    {
      id: 'foreach_obligation',
      type: 'loop',
      label: 'For Each Overdue Obligation',
      config: {
        collection: '{overdueObligations.records}',
        iteratorVar: 'obligation',
      },
    },
    {
      id: 'notify',
      type: 'notify',
      label: 'Notify Assignee',
      config: {
        recipients: ['{obligation.assignee}'],
        title: 'Obligation overdue: {obligation.summary}',
        body: 'Obligation "{obligation.summary}" on contract {obligation.contract} is past its due date ({obligation.due_date}).',
        actionUrl: '/objects/contracts_obligation/{obligation.id}',
      },
    },
    { id: 'end_loop', type: 'end', label: 'End Loop Iteration' },
    { id: 'end', type: 'end', label: 'End Flow' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_overdue', type: 'default' },
    { id: 'e2', source: 'query_overdue', target: 'foreach_obligation', type: 'default' },
    { id: 'e3', source: 'foreach_obligation', target: 'notify', type: 'default' },
    { id: 'e4', source: 'notify', target: 'end_loop', type: 'default' },
    { id: 'e5', source: 'end_loop', target: 'end', type: 'default' },
  ],
};
