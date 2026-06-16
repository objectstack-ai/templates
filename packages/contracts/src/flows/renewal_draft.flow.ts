// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
type Flow = Automation.Flow;

/**
 * Auto-create a renewal draft. When a non-auto-renewing active contract enters
 * its `renewal_notice_days` window before `end_date`, drop a draft renewal into
 * the owner's queue so they have something concrete to negotiate against.
 *
 * Why a SCHEDULED flow, not record-change (#1874): "is within the renewal-notice
 * window" is time-relative. A record-change trigger only fires on row mutation,
 * so it would (almost) never fire on the right day. A daily schedule queries the
 * population against `today()` instead.
 *
 * The notice window is per-record (`renewal_notice_days` varies), so the query
 * casts a wide net (end_date within 90 days) and a `loop` + decision refines it
 * with the robust range check `end_date <= daysFromNow(renewal_notice_days)`.
 *
 * Idempotency (no extra field — the draft IS the guard): before creating, the
 * flow looks for an existing draft whose title matches `Renewal — {parent.title}`
 * and only creates one when none exists.
 */
export const ContractRenewalDraftFlow: Flow = {
  name: 'contracts_contract_renewal_draft',
  label: 'Create Renewal Draft Before End Date',
  description:
    "Daily scheduled job: when a non-auto-renewing active contract is within its renewal-notice window, drop a draft renewal into the owner's queue (once).",
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
      id: 'query_candidates',
      type: 'get_record',
      label: 'Find Contracts Nearing Renewal',
      config: {
        objectName: 'contracts_contract',
        filter: {
          status: 'active',
          auto_renew: false,
          end_date: { $ne: null, $lte: cel`daysFromNow(90)` },
          renewal_notice_days: { $ne: null },
        },
        limit: 500,
        outputVariable: 'candidates',
      },
    },
    {
      id: 'foreach_parent',
      type: 'loop',
      label: 'For Each Candidate',
      config: {
        collection: '{candidates.records}',
        iteratorVar: 'parent',
      },
    },
    {
      id: 'in_notice_window',
      type: 'decision',
      label: 'Within Renewal-Notice Window?',
      config: {
        // Per-record window: range check, robust to the time component.
        condition: 'parent.end_date <= daysFromNow(parent.renewal_notice_days)',
        conditionDialect: 'cel',
      },
    },
    {
      id: 'find_existing_draft',
      type: 'get_record',
      label: 'Look For An Existing Draft',
      config: {
        objectName: 'contracts_contract',
        filter: { status: 'draft', title: 'Renewal — {parent.title}' },
        limit: 1,
        outputVariable: 'existingDraft',
      },
    },
    {
      id: 'draft_missing',
      type: 'decision',
      label: 'No Draft Yet?',
      config: {
        condition: 'size(existingDraft.records) == 0',
        conditionDialect: 'cel',
      },
    },
    {
      id: 'create_draft',
      type: 'create_record',
      label: 'Create Renewal Draft',
      config: {
        objectName: 'contracts_contract',
        fields: {
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
    { id: 'end_loop', type: 'end', label: 'End Loop Iteration' },
    { id: 'end', type: 'end', label: 'End Flow' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_candidates', type: 'default' },
    { id: 'e2', source: 'query_candidates', target: 'foreach_parent', type: 'default' },
    { id: 'e3', source: 'foreach_parent', target: 'in_notice_window', type: 'default' },
    {
      id: 'e4',
      source: 'in_notice_window',
      target: 'find_existing_draft',
      type: 'conditional',
      condition: 'parent.end_date <= daysFromNow(parent.renewal_notice_days)',
      label: 'In window',
    },
    { id: 'e5', source: 'in_notice_window', target: 'end_loop', isDefault: true, label: 'Not yet' },
    { id: 'e6', source: 'find_existing_draft', target: 'draft_missing', type: 'default' },
    {
      id: 'e7',
      source: 'draft_missing',
      target: 'create_draft',
      type: 'conditional',
      condition: 'size(existingDraft.records) == 0',
      label: 'None exists',
    },
    {
      id: 'e8',
      source: 'draft_missing',
      target: 'end_loop',
      isDefault: true,
      label: 'Already drafted',
    },
    { id: 'e9', source: 'create_draft', target: 'notify_owner', type: 'default' },
    { id: 'e10', source: 'notify_owner', target: 'end_loop', type: 'default' },
    { id: 'e11', source: 'end_loop', target: 'end', type: 'default' },
  ],
};
