// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Party } from '../objects/contracts_party.object';
import { Contract } from '../objects/contracts_contract.object';
import { Obligation } from '../objects/contracts_obligation.object';

/**
 * Seed data — realistic business content covering the full template surface:
 *
 *   • all major contract types (NDA, MSA, vendor, lease, employment)
 *   • all lifecycle states represented (draft → active, plus expired)
 *   • a high-value contract that triggers approval_required = true
 *   • an active contract expiring inside 30 days → renewal alert flow
 *   • an active auto-renewing contract → renewal alert flow (high-risk)
 *   • an in-review contract over the approval threshold
 *   • 6 obligations across contracts — some upcoming, one overdue, one done
 *
 *   PARTIES   4
 *   CONTRACTS 6
 *   OBLIGATIONS 6
 */

const parties = defineDataset(Party, {
  mode: 'upsert',
  externalId: 'legal_name',
  records: [
    {
      legal_name: 'Cloudwell Hosting, Inc.',
      party_type: 'vendor',
      country: 'US',
      website: 'https://cloudwell.example.com',
      primary_contact_name: 'Amelia Ortega',
      primary_contact_email: 'amelia.ortega@cloudwell.example.com',
    },
    {
      legal_name: 'Northwind Analytics Ltd.',
      party_type: 'customer',
      country: 'UK',
      website: 'https://northwind.example.co.uk',
      primary_contact_name: 'Daniel Bridge',
      primary_contact_email: 'daniel.bridge@northwind.example.co.uk',
    },
    {
      legal_name: 'Pacific Crest Property Group',
      party_type: 'landlord',
      country: 'US',
      primary_contact_name: 'Sara Lin',
      primary_contact_email: 'sara@pacificcrest.example.com',
    },
    {
      legal_name: 'Sato Translations K.K.',
      party_type: 'vendor',
      country: 'JP',
      primary_contact_name: 'Kenji Sato',
      primary_contact_email: 'kenji.sato@sato-tx.example.jp',
    },
  ],
});

const contracts = defineDataset(Contract, {
  mode: 'upsert',
  externalId: 'title',
  records: [
    {
      title: 'Cloudwell Enterprise Hosting 2026',
      contract_number: 'C-2026-001',
      party: 'Cloudwell Hosting, Inc.',
      contract_type: 'vendor',
      status: 'active',
      total_value: 180000,
      payment_terms: 'net_30',
      effective_date: cel`daysAgo(220)`,
      end_date: cel`daysFromNow(45)`, // expiring ≤ 60d → renewal alert
      signed_date: cel`daysAgo(230)`,
      auto_renew: true,
      renewal_notice_days: 60,
      tags: 'cloud, infra',
      notes: 'Auto-renews unless cancelled at least 60 days before end date.',
    },
    {
      title: 'Northwind Master Services Agreement',
      contract_number: 'C-2026-002',
      party: 'Northwind Analytics Ltd.',
      contract_type: 'msa',
      status: 'active',
      total_value: 240000,
      payment_terms: 'milestone',
      effective_date: cel`daysAgo(90)`,
      end_date: cel`daysFromNow(275)`,
      signed_date: cel`daysAgo(95)`,
      auto_renew: false,
      renewal_notice_days: 0,
      tags: 'customer, msa',
    },
    {
      title: 'HQ Office Lease — 2nd Floor',
      contract_number: 'C-2025-008',
      party: 'Pacific Crest Property Group',
      contract_type: 'lease',
      status: 'active',
      total_value: 96000,
      payment_terms: 'milestone',
      effective_date: cel`daysAgo(400)`,
      end_date: cel`daysFromNow(25)`, // imminently expiring + auto-renews
      signed_date: cel`daysAgo(410)`,
      auto_renew: true,
      renewal_notice_days: 30,
      tags: 'real-estate',
      notes: 'Triggers the 30-day renewal alert AND auto-renews — review now.',
    },
    {
      title: 'Sato Translations Annual Retainer',
      contract_number: 'C-2026-003',
      party: 'Sato Translations K.K.',
      contract_type: 'sow',
      status: 'in_review', // pending approval (over $50k → approval_required)
      total_value: 72000,
      payment_terms: 'net_45',
      effective_date: cel`daysFromNow(10)`,
      end_date: cel`daysFromNow(375)`,
      auto_renew: false,
      renewal_notice_days: 0,
      tags: 'localization',
      notes: 'Waiting on CFO sign-off; total value crosses $50k threshold.',
    },
    {
      title: 'Cloudwell NDA — 2025',
      contract_number: 'C-2025-014',
      party: 'Cloudwell Hosting, Inc.',
      contract_type: 'nda',
      status: 'expired',
      effective_date: cel`daysAgo(720)`,
      end_date: cel`daysAgo(15)`,
      signed_date: cel`daysAgo(725)`,
      auto_renew: false,
      tags: 'nda, historical',
    },
    {
      title: 'Internal — Employment: J. Park (Senior Engineer)',
      contract_number: 'C-2026-004',
      party: 'Cloudwell Hosting, Inc.', // placeholder — fork should use a real employee party
      contract_type: 'employment',
      status: 'draft',
      total_value: 0,
      tags: 'hr, draft',
      notes:
        'Demo seed only — in production, employment contracts get their own party type & owner.',
    },
  ],
});

const obligations = defineDataset(Obligation, {
  mode: 'upsert',
  externalId: 'summary',
  records: [
    {
      summary: 'Pay Cloudwell annual hosting invoice',
      contract: 'Cloudwell Enterprise Hosting 2026',
      obligor: 'us',
      kind: 'payment',
      status: 'open',
      due_date: cel`daysFromNow(15)`,
      amount: 180000,
    },
    {
      summary: 'Notify Cloudwell of non-renewal (if cancelling)',
      contract: 'Cloudwell Enterprise Hosting 2026',
      obligor: 'us',
      kind: 'notice',
      status: 'open',
      due_date: cel`daysAgo(15)`, // OVERDUE — triggers obligation_overdue flow
      amount: 0,
      notes: 'Window already closed — contract will auto-renew unless action taken.',
    },
    {
      summary: 'Deliver Q2 analytics report to Northwind',
      contract: 'Northwind Master Services Agreement',
      obligor: 'us',
      kind: 'deliverable',
      status: 'open',
      due_date: cel`daysFromNow(20)`,
      amount: 0,
    },
    {
      summary: 'Receive milestone payment from Northwind',
      contract: 'Northwind Master Services Agreement',
      obligor: 'counterparty',
      kind: 'payment',
      status: 'open',
      due_date: cel`daysFromNow(35)`,
      amount: 60000,
    },
    {
      summary: 'Pay Pacific Crest monthly rent',
      contract: 'HQ Office Lease — 2nd Floor',
      obligor: 'us',
      kind: 'payment',
      status: 'open',
      due_date: cel`daysFromNow(5)`,
      amount: 8000,
    },
    {
      summary: 'Receive annual SOC 2 report from Cloudwell',
      contract: 'Cloudwell Enterprise Hosting 2026',
      obligor: 'counterparty',
      kind: 'report',
      status: 'done',
      due_date: cel`daysAgo(60)`,
      completed_at: cel`daysAgo(55)`,
      amount: 0,
    },
  ],
});

/** All seed datasets, loaded in dependency order (parties → contracts → obligations). */
export const ContractsSeedData = [parties, contracts, obligations];
