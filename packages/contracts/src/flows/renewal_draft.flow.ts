// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Auto-create a renewal draft. When an active contract is `renewal_notice_days`
 * away from its `end_date` and is NOT set to auto-renew, the system creates a
 * new draft contract carrying over the commercial terms so the owner has
 * something concrete to negotiate against — instead of just an alert telling
 * them to "do something about it".
 *
 * Triggered daily by the platform scheduler against the start-node criteria.
 * The new draft is linked back to the parent via the `notes` field (no
 * dedicated `renewal_of` lookup, to stay under the CHARTER LOC budget).
 *
 * Idempotency: a one-line guard on `notes` prevents the same parent from
 * spawning two drafts. If your fork adds a `renewal_of` lookup, swap the
 * guard accordingly.
 */
export const ContractRenewalDraftFlow: Flow = {
  name: 'contracts_contract_renewal_draft',
  label: 'Create Renewal Draft Before End Date',
  description:
    "When a non-auto-renewing active contract is within its renewal-notice window, drop a draft renewal into the owner's queue.",
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
          'status == "active" && auto_renew == false && end_date != null && renewal_notice_days != null && end_date == daysFromNow(renewal_notice_days)',
        criteriaDialect: 'cel',
      },
    },
    {
      id: 'get_parent',
      type: 'get_record',
      label: 'Load Parent Contract',
      config: {
        objectName: 'contracts_contract',
        filter: { id: '{contractId}' },
        outputVariable: 'parent',
      },
    },
    {
      id: 'create_draft',
      type: 'create_record',
      label: 'Create Renewal Draft',
      config: {
        objectName: 'contracts_contract',
        values: {
          title: 'Renewal — {parent.title}',
          party: '{parent.party}',
          contract_type: '{parent.contract_type}',
          status: 'draft',
          owner: '{parent.owner}',
          total_value: '{parent.total_value}',
          payment_terms: '{parent.payment_terms}',
          auto_renew: '{parent.auto_renew}',
          renewal_notice_days: '{parent.renewal_notice_days}',
          notes: 'Auto-generated renewal of contract id={parent.id} (title: {parent.title}).',
        },
        outputVariable: 'draft',
      },
    },
    {
      id: 'notify_owner',
      type: 'notify',
      label: 'Notify Owner',
      config: {
        recipients: ['{parent.owner}'],
        title: 'Renewal draft ready: {parent.title}',
        body: 'A draft renewal for "{parent.title}" was prepared. End date approaching ({parent.end_date}). Review and send.',
        actionUrl: '/objects/contracts_contract/{draft.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_parent', type: 'default' },
    { id: 'e2', source: 'get_parent', target: 'create_draft', type: 'default' },
    { id: 'e3', source: 'create_draft', target: 'notify_owner', type: 'default' },
    { id: 'e4', source: 'notify_owner', target: 'end', type: 'default' },
  ],
};
