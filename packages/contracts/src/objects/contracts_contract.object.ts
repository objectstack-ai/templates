// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';
import { ContractStateMachine } from './contracts_contract.state';

/**
 * Contract — the central record. One Contract per signed agreement (or
 * one-being-negotiated). Metadata-first: the PDF lives in sys_attachment;
 * everything you query / filter / report on lives in these fields.
 *
 * Fields are populated either manually or via `extract_terms.action.ts`,
 * which hands the attached PDF to an LLM and writes party / amount / dates
 * / auto-renew back here.
 *
 * Polymorphic platform features (free):
 *   - sys_comment    (thread_id = "contracts_contract:{id}")
 *   - sys_attachment (parent_object = "contracts_contract", parent_id = "{id}")
 *   - sys_activity / sys_audit_log (auto via enable.feeds/trackHistory)
 */
export const Contract = ObjectSchema.create({
  name: 'contracts_contract',
  label: 'Contract',
  pluralLabel: 'Contracts',
  icon: 'file-text',
  description:
    'A signed (or being-negotiated) agreement with one counterparty. PDF upload is provisioned via `enable.files: true` (sys_attachment polymorphic storage); the extract_terms action consumes that PDF to auto-fill metadata.',

  fieldGroups: [
    { key: 'core', label: 'Contract', icon: 'file-text' },
    { key: 'commercial', label: 'Commercial Terms', icon: 'dollar-sign' },
    { key: 'dates', label: 'Dates', icon: 'calendar' },
    { key: 'renewal', label: 'Renewal', icon: 'refresh-cw' },
    { key: 'ai', label: 'AI Extracted', icon: 'sparkles', defaultExpanded: false },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    title: Field.text({
      label: 'Title',
      required: true,
      searchable: true,
      maxLength: 200,
      group: 'core',
      description: 'Short human-readable name. e.g. "AWS Enterprise Agreement 2026".',
    }),

    contract_number: Field.text({
      label: 'Contract Number',
      unique: true,
      maxLength: 60,
      group: 'core',
      description: 'Your internal reference. Auto-generate in your fork if you prefer.',
    }),

    party: Field.lookup('contracts_party', {
      label: 'Counterparty',
      required: true,
      group: 'core',
    }),

    contract_type: Field.select({
      label: 'Type',
      required: true,
      group: 'core',
      options: [
        { label: 'NDA', value: 'nda', color: '#6B7280', default: true },
        { label: 'MSA', value: 'msa', color: '#3B82F6' },
        { label: 'SOW', value: 'sow', color: '#0EA5E9' },
        { label: 'DPA', value: 'dpa', color: '#8B5CF6' },
        { label: 'Vendor / Subscription', value: 'vendor', color: '#10B981' },
        { label: 'Employment', value: 'employment', color: '#F59E0B' },
        { label: 'Lease', value: 'lease', color: '#EF4444' },
        { label: 'Other', value: 'other', color: '#94A3B8' },
      ],
    }),

    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Draft', value: 'draft', color: '#94A3B8', default: true },
        { label: 'In Review', value: 'in_review', color: '#F59E0B' },
        { label: 'Signed', value: 'signed', color: '#3B82F6' },
        { label: 'Active', value: 'active', color: '#10B981' },
        { label: 'Expired', value: 'expired', color: '#6B7280' },
        { label: 'Terminated', value: 'terminated', color: '#EF4444' },
        { label: 'Cancelled', value: 'cancelled', color: '#475569' },
      ],
    }),

    owner: Field.lookup('user', {
      label: 'Internal Owner',
      group: 'core',
      description:
        'Person on our side accountable for this contract. Defaults to created_by; do not require — the platform fills it.',
    }),

    // Commercial
    total_value: Field.currency({
      label: 'Total Value',
      group: 'commercial',
      min: 0,
      description: 'Annualised if recurring; total if one-off. Currency: USD (override per-fork).',
    }),

    payment_terms: Field.select({
      label: 'Payment Terms',
      group: 'commercial',
      options: [
        { label: 'Net 30', value: 'net_30', default: true },
        { label: 'Net 45', value: 'net_45' },
        { label: 'Net 60', value: 'net_60' },
        { label: 'Net 90', value: 'net_90' },
        { label: 'Upfront', value: 'upfront' },
        { label: 'Milestone', value: 'milestone' },
        { label: 'Other', value: 'other' },
      ],
    }),

    // Dates
    effective_date: Field.date({ label: 'Effective Date', group: 'dates' }),
    end_date: Field.date({ label: 'End Date', group: 'dates' }),
    signed_date: Field.date({ label: 'Signed Date', group: 'dates' }),

    // Renewal
    auto_renew: Field.boolean({
      label: 'Auto-Renew',
      defaultValue: false,
      group: 'renewal',
      description: 'If true, the contract self-renews unless terminated by the notice window.',
    }),
    renewal_notice_days: Field.number({
      label: 'Renewal Notice (days)',
      scale: 0,
      min: 0,
      group: 'renewal',
      description: 'Days before end_date by which we must notify to cancel. Drives alert lead time.',
    }),

    // Derived signals
    //
    // The CEL stdlib exposed to formulas covers: now(), today(),
    // daysFromNow(int), daysAgo(int), isBlank, coalesce, trim, joinNonEmpty.
    // It does NOT include arbitrary date-arithmetic helpers (no daysBetween),
    // so derived "days remaining" must be computed at the call site / view
    // layer. We keep the boolean classifiers below — they only need
    // timestamp comparisons, which CEL supports natively.

    is_expiring_soon: Field.formula({
      label: 'Expiring ≤ 60 days',
      group: 'dates',
      expression: F`record.end_date != null && record.status == "active" && record.end_date <= daysFromNow(60) && record.end_date >= today()`,
    }),

    is_auto_renewing_soon: Field.formula({
      label: 'Auto-Renewing ≤ 30 days',
      group: 'renewal',
      expression: F`record.auto_renew == true && record.end_date != null && record.status == "active" && record.end_date <= daysFromNow(30) && record.end_date >= today()`,
    }),

    approval_required: Field.formula({
      label: 'Approval Required',
      group: 'commercial',
      expression: F`record.total_value != null && record.total_value >= 50000`,
    }),

    // AI-extracted (rewritten by extract_terms.action.ts)
    extracted_clauses: Field.json({
      label: 'Extracted Clauses',
      group: 'ai',
      description:
        'AI-extracted structured clause summary. Schema: { liability_cap, governing_law, termination_notice_days, data_processing, ... }. Rewritten by extract_terms.action.ts.',
    }),

    extraction_confidence: Field.number({
      label: 'Extraction Confidence',
      scale: 2,
      min: 0,
      max: 1,
      group: 'ai',
      readonly: true,
      description: '0–1, set by extract_terms.action.ts. Below 0.7 → human review.',
    }),

    extracted_at: Field.datetime({
      label: 'Extracted At',
      group: 'ai',
      readonly: true,
    }),

    // Metadata
    tags: Field.text({
      label: 'Tags',
      maxLength: 200,
      group: 'meta',
      description: 'Comma-separated free tags. Replace with a proper junction in your fork if needed.',
    }),

    notes: Field.markdown({
      label: 'Internal Notes',
      group: 'meta',
    }),
  },

  stateMachines: {
    lifecycle: ContractStateMachine,
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    files: true,
    feeds: true,
    activities: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['party'] },
    { fields: ['status'] },
    { fields: ['end_date'] },
    { fields: ['contract_type'] },
    { fields: ['owner'] },
  ],

  titleFormat: tmpl`{{record.title}}`,
  compactLayout: ['title', 'party', 'contract_type', 'status', 'total_value', 'end_date'],

  validations: [
    {
      name: 'end_date_after_effective_date',
      type: 'script',
      severity: 'error',
      message: 'End date must be on or after effective date.',
      condition: P`record.effective_date != null && record.end_date != null && record.end_date < record.effective_date`,
    },
    {
      name: 'signed_requires_signed_date',
      type: 'script',
      severity: 'error',
      message: 'Status "signed" requires a signed_date.',
      condition: P`record.status == "signed" && record.signed_date == null`,
    },
  ],

  workflows: [
    {
      name: 'stamp_signed_date_on_sign',
      objectName: 'contracts_contract',
      triggerType: 'on_update',
      criteria: P`record.status == "signed" && previous.status != "signed" && record.signed_date == null`,
      active: true,
      actions: [
        { name: 'set_signed_date', type: 'field_update', field: 'signed_date', value: 'today()' },
      ],
    },
    {
      name: 'auto_activate_on_effective_date',
      objectName: 'contracts_contract',
      triggerType: 'on_update',
      criteria: P`record.status == "signed" && record.effective_date != null && record.effective_date <= today()`,
      active: true,
      actions: [
        { name: 'set_status_active', type: 'field_update', field: 'status', value: 'active' },
      ],
    },
    {
      name: 'auto_expire_on_end_date',
      objectName: 'contracts_contract',
      triggerType: 'on_update',
      criteria: P`record.status == "active" && record.end_date != null && record.end_date < today() && record.auto_renew == false`,
      active: true,
      actions: [
        { name: 'set_status_expired', type: 'field_update', field: 'status', value: 'expired' },
      ],
    },
  ],
});
