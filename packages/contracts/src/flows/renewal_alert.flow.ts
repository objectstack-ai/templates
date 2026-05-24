// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Renewal alert — fires when an active contract reaches the T-60 / T-30 / T-7
 * day mark before its `end_date`. Notifies the contract owner so they can
 * decide to renegotiate or terminate before auto-renew kicks in.
 *
 * Why CEL `end_date == daysFromNow(N)` instead of a `days_until_expiry`
 * formula field: the CEL stdlib shipped with @objectstack/formula 5.2 does
 * not include `daysBetween`, so an "exact days remaining" derived integer is
 * not expressible as a formula. The platform scheduler re-evaluates the
 * criteria daily, so equality against `daysFromNow(N)` flips true on
 * exactly the right day.
 */
export const ContractRenewalAlertFlow: Flow = {
  name: 'contracts_contract_renewal_alert',
  label: 'Alert Owner About Upcoming Renewal',
  description:
    'Notifies the contract owner at T-60, T-30, and T-7 days before end_date so auto-renewal does not happen by accident.',
  type: 'record_change',

  variables: [{ name: 'contractId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'contracts_contract',
        criteria:
          'status == "active" && end_date != null && (end_date == daysFromNow(60) || end_date == daysFromNow(30) || end_date == daysFromNow(7))',
        criteriaDialect: 'cel',
      },
    },
    {
      id: 'get_contract',
      type: 'get_record',
      label: 'Get Contract',
      config: {
        objectName: 'contracts_contract',
        filter: { id: '{contractId}' },
        outputVariable: 'contractRecord',
      },
    },
    {
      id: 'notify',
      type: 'script',
      label: 'Notify Owner',
      config: {
        actionType: 'notification',
        recipients: ['{contractRecord.owner}'],
        title: 'Contract renewing soon: {contractRecord.title}',
        body:
          'Contract "{contractRecord.title}" with {contractRecord.party} reaches its end_date on {contractRecord.end_date}. Auto-renew is {contractRecord.auto_renew}. Review now.',
        link: '/objects/contracts_contract/{contractRecord.id}',
      },
    },
    {
      id: 'email',
      type: 'script',
      label: 'Email Owner',
      config: {
        actionType: 'email',
        template: 'contracts_renewal_alert',
        recipients: ['{contractRecord.owner.email}'],
        variables: {
          title: '{contractRecord.title}',
          party: '{contractRecord.party}',
          endDate: '{contractRecord.end_date}',
          autoRenew: '{contractRecord.auto_renew}',
        },
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_contract', type: 'default' },
    { id: 'e2', source: 'get_contract', target: 'notify', type: 'default' },
    { id: 'e3', source: 'notify', target: 'email', type: 'default' },
    { id: 'e4', source: 'email', target: 'end', type: 'default' },
  ],
};
