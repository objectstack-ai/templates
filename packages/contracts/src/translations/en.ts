// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * English (en) — Contracts App Translations
 *
 * Per-locale file. Covers object/field labels, view labels, dashboard
 * widgets, navigation, and common UI messages. The template ships en only;
 * fork and add `zh-CN.ts` / `ja-JP.ts` etc. then register in `index.ts`
 * and list in `objectstack.config.ts → i18n.supportedLocales`.
 */
export const en: TranslationData = {
  objects: {
    contracts_contract: {
      label: 'Contract',
      pluralLabel: 'Contracts',
      description: 'A signed (or being-negotiated) agreement with one counterparty.',
      fields: {
        title: { label: 'Title' },
        contract_number: { label: 'Contract Number' },
        party: { label: 'Counterparty' },
        contract_type: {
          label: 'Type',
          options: {
            nda: 'NDA',
            msa: 'MSA',
            sow: 'SOW',
            dpa: 'DPA',
            vendor: 'Vendor / Subscription',
            employment: 'Employment',
            lease: 'Lease',
            other: 'Other',
          },
        },
        status: {
          label: 'Status',
          options: {
            draft: 'Draft',
            in_review: 'In Review',
            signed: 'Signed',
            active: 'Active',
            expired: 'Expired',
            terminated: 'Terminated',
            cancelled: 'Cancelled',
          },
        },
        owner: { label: 'Internal Owner' },
        total_value: { label: 'Total Value' },
        payment_terms: {
          label: 'Payment Terms',
          options: {
            net_30: 'Net 30',
            net_45: 'Net 45',
            net_60: 'Net 60',
            net_90: 'Net 90',
            upfront: 'Upfront',
            milestone: 'Milestone',
            other: 'Other',
          },
        },
        effective_date: { label: 'Effective Date' },
        end_date: { label: 'End Date' },
        signed_date: { label: 'Signed Date' },
        auto_renew: { label: 'Auto-Renew' },
        renewal_notice_days: { label: 'Renewal Notice (days)' },
        is_expiring_soon: { label: 'Expiring ≤ 60 days' },
        is_auto_renewing_soon: { label: 'Auto-Renewing ≤ 30 days' },
        approval_required: { label: 'Approval Required' },
        extracted_clauses: { label: 'Extracted Clauses' },
        extraction_confidence: { label: 'Extraction Confidence' },
        extracted_at: { label: 'Extracted At' },
        tags: { label: 'Tags' },
        notes: { label: 'Internal Notes' },
      },
      _views: {
        all_contracts: { label: 'All Contracts', description: 'Every contract, grouped by status' },
        contract_pipeline: { label: 'Contract Pipeline', description: 'Kanban grouped by status' },
        my_contracts: { label: 'My Contracts', description: 'Contracts you own that are still open' },
        expiring_contracts: { label: 'Expiring Soon', description: 'Active contracts ending in ≤ 60 days' },
        pending_approval_contracts: { label: 'Pending Approval', description: 'Contracts in review awaiting approval' },
      },
    },

    contracts_party: {
      label: 'Party',
      pluralLabel: 'Parties',
      description: 'A legal entity that is a counterparty on one or more contracts.',
      fields: {
        legal_name: { label: 'Legal Name' },
        party_type: {
          label: 'Type',
          options: {
            vendor: 'Vendor',
            customer: 'Customer',
            employee: 'Employee',
            landlord: 'Landlord',
            partner: 'Partner',
            other: 'Other',
          },
        },
        country: { label: 'Country' },
        website: { label: 'Website' },
        primary_contact_name: { label: 'Primary Contact' },
        primary_contact_email: { label: 'Primary Contact Email' },
        notes: { label: 'Notes' },
      },
    },

    contracts_obligation: {
      label: 'Obligation',
      pluralLabel: 'Obligations',
      description: 'A dated commitment tied to a contract.',
      fields: {
        summary: { label: 'Summary' },
        contract: { label: 'Contract' },
        obligor: {
          label: 'Owed By',
          options: { us: 'Us', counterparty: 'Counterparty' },
        },
        kind: {
          label: 'Kind',
          options: {
            payment: 'Payment',
            deliverable: 'Deliverable',
            report: 'Report / Disclosure',
            notice: 'Notice',
            other: 'Other',
          },
        },
        status: {
          label: 'Status',
          options: { open: 'Open', done: 'Done', waived: 'Waived' },
        },
        due_date: { label: 'Due Date' },
        amount: { label: 'Amount' },
        assignee: { label: 'Assignee' },
        completed_at: { label: 'Completed At' },
        is_overdue: { label: 'Overdue?' },
        notes: { label: 'Notes' },
      },
      _views: {
        all_obligations: { label: 'All Obligations', description: 'Every obligation, grouped by status' },
        my_open_obligations: { label: 'My Open Obligations', description: 'Open obligations assigned to you' },
        overdue_obligations: { label: 'Overdue Obligations', description: 'Open obligations past due date' },
      },
    },
  },

  apps: {
    contracts: {
      label: 'Contracts',
      description: 'Post-signature contract lifecycle on ObjectStack.',
      navigation: {
        nav_dashboard: { label: 'Renewals at Risk' },
        nav_contract: { label: 'Contracts' },
        nav_party: { label: 'Parties' },
        nav_obligation: { label: 'Obligations' },
      },
    },
  },

  messages: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.back': 'Back',
    'common.confirm': 'Confirm',
    'success.saved': 'Contract saved successfully',
    'success.extracted': 'Contract terms extracted and applied',
    'confirm.delete': 'Are you sure you want to delete this record?',
    'confirm.reassign_owner': 'Reassign {count} contract(s)?',
    'error.required': 'This field is required',
    'error.load_failed': 'Failed to load data',
    'error.extraction_failed': 'AI extraction failed — see logs',
  },

  validationMessages: {
    end_date_after_effective_date: 'End date must be on or after effective date.',
    signed_requires_signed_date: 'Status "signed" requires a signed_date.',
    payment_requires_amount: 'Payment obligations must have an amount.',
  },

  dashboards: {
    renewals_at_risk_dashboard: {
      label: 'Renewals at Risk',
      description: 'Contracts expiring soon, recently signed, and overall portfolio exposure.',
      actions: {
        create_contract: { label: 'New Contract' },
      },
      widgets: {
        expiring_60: { title: 'Expiring ≤ 60 days', description: 'Active contracts with end_date within 60 days' },
        auto_renewing_30: { title: 'Auto-Renewing ≤ 30d', description: 'Active contracts set to auto-renew in 30 days or less' },
        pending_approval: { title: 'Pending Approval', description: 'In-review contracts above the approval threshold' },
        active_total_value: { title: 'Active Portfolio Value', description: 'Sum of total_value across active contracts' },
        expiring_table: { title: 'Expiring Contracts (Next 60d)', description: 'Active contracts sorted by end date — earliest first' },
        pending_obligations: { title: 'Open Obligations', description: 'All open obligations sorted by due date' },
      },
    },
  },
};
