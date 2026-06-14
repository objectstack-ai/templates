// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Signed → Obligations. When a contract is signed, drop a renewal-notice
 * obligation into the tracker so the team never misses the window to decide
 * renew vs. terminate. This is the charter's "signed → create obligations"
 * flow: it turns post-signature metadata into a dated, assignable task.
 *
 * Fires once, on the transition into "signed" (guarded by `previous.status`),
 * and only when an `end_date` exists (the notice obligation needs a due date).
 * Kind = "notice" so no amount is required. A fork can fan out additional
 * obligations from `extracted_clauses` (payment schedule, SOC2 report, …) and
 * compute `end_date − renewal_notice_days` once date arithmetic lands in CEL.
 */
export const ContractSignedObligationsFlow: Flow = {
  name: 'contracts_contract_signed_obligations',
  label: 'Create Obligations on Signing',
  description:
    'On signing, create a renewal-notice obligation due by the end date so the renewal decision is tracked.',
  type: 'record_change',

  variables: [{ name: 'contractId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'contracts_contract',
        triggerType: 'record-after-update',
        condition: 'status == "signed" && previous.status != "signed" && end_date != null',
      },
    },
    {
      id: 'get_parent',
      type: 'get_record',
      label: 'Load Contract',
      config: {
        objectName: 'contracts_contract',
        filter: { id: '{record.id}' },
        outputVariable: 'parent',
      },
    },
    {
      id: 'create_notice_obligation',
      type: 'create_record',
      label: 'Create Renewal-Notice Obligation',
      config: {
        objectName: 'contracts_obligation',
        fields: {
          summary: 'Decide renewal — {parent.title}',
          contract: '{parent.id}',
          obligor: 'us',
          kind: 'notice',
          status: 'open',
          due_date: '{parent.end_date}',
          assignee: '{parent.owner}',
          notes:
            'Auto-created on signing. Review renew/renegotiate/terminate before the end date (account for the renewal-notice window).',
        },
        outputVariable: 'obligation',
      },
    },
    {
      id: 'notify_owner',
      type: 'notify',
      label: 'Notify Owner',
      config: {
        recipients: ['{parent.owner}'],
        title: 'Renewal obligation created: {parent.title}',
        body: 'A renewal-decision obligation was added for "{parent.title}" (end date {parent.end_date}).',
        actionUrl: '/objects/contracts_obligation/{obligation.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_parent', type: 'default' },
    { id: 'e2', source: 'get_parent', target: 'create_notice_obligation', type: 'default' },
    { id: 'e3', source: 'create_notice_obligation', target: 'notify_owner', type: 'default' },
    { id: 'e4', source: 'notify_owner', target: 'end', type: 'default' },
  ],
};
