// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
type Flow = Automation.Flow;

/**
 * Renewal alert — notifies the contract owner at T-60 / T-30 / T-7 days before
 * an active contract's `end_date`, so auto-renewal does not happen by accident.
 *
 * Why this is a SCHEDULED flow, not record-change (#1874):
 * a `record_change` trigger only fires when the contract row is mutated. A
 * contract sitting untouched will sail past T-60 / T-30 / T-7 without any update
 * event, so a record-change trigger with `end_date == daysFromNow(N)` would
 * (almost) never fire on the right day — it only matched if someone happened to
 * edit the contract that exact day. Time-relative criteria belong on a daily
 * SCHEDULE that QUERIES the population, not on a record-change trigger.
 *
 * The daily job selects active contracts whose `end_date` lands on one of the
 * three alert days and notifies each owner. `end_date` is a `date` field; the
 * `$in` set uses `daysFromNow(N)` to preserve the original T-N alert tiers.
 * (If the engine's date/timestamp equality proves too strict in practice, widen
 * each tier to a one-day range and de-dupe with a `last_alert_tier` guard.)
 */
export const ContractRenewalAlertFlow: Flow = {
  name: 'contracts_contract_renewal_alert',
  label: 'Alert Owner About Upcoming Renewal',
  description:
    'Daily scheduled job: notifies the contract owner at T-60, T-30, and T-7 days before end_date so auto-renewal does not happen by accident.',
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
      id: 'query_due',
      type: 'get_record',
      label: 'Find Contracts Hitting an Alert Day',
      config: {
        objectName: 'contracts_contract',
        filter: {
          status: 'active',
          end_date: { $in: [cel`daysFromNow(60)`, cel`daysFromNow(30)`, cel`daysFromNow(7)`] },
        },
        limit: 500,
        outputVariable: 'dueContracts',
      },
    },
    {
      id: 'foreach_contract',
      type: 'loop',
      label: 'For Each Due Contract',
      config: {
        collection: '{dueContracts.records}',
        iteratorVar: 'contract',
      },
    },
    {
      id: 'notify',
      type: 'notify',
      label: 'Notify Owner',
      config: {
        recipients: ['{contract.owner}'],
        title: 'Contract renewing soon: {contract.title}',
        body: 'Contract "{contract.title}" with {contract.party} reaches its end_date on {contract.end_date}. Auto-renew is {contract.auto_renew}. Review now.',
        actionUrl: '/objects/contracts_contract/{contract.id}',
      },
    },
    {
      id: 'email',
      type: 'notify',
      label: 'Email Owner',
      config: {
        channels: ['email'],
        recipients: ['{contract.owner.email}'],
        title: 'Contract renewing soon: {contract.title}',
        body: 'Contract "{contract.title}" with {contract.party} reaches its end_date on {contract.end_date}. Auto-renew is {contract.auto_renew}.',
        actionUrl: '/objects/contracts_contract/{contract.id}',
      },
    },
    { id: 'end_loop', type: 'end', label: 'End Loop Iteration' },
    { id: 'end', type: 'end', label: 'End Flow' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_due', type: 'default' },
    { id: 'e2', source: 'query_due', target: 'foreach_contract', type: 'default' },
    { id: 'e3', source: 'foreach_contract', target: 'notify', type: 'default' },
    { id: 'e4', source: 'notify', target: 'email', type: 'default' },
    { id: 'e5', source: 'email', target: 'end_loop', type: 'default' },
    { id: 'e6', source: 'end_loop', target: 'end', type: 'default' },
  ],
};
