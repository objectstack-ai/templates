// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineSeed } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Vendor } from '../objects/procurement_vendor.object';
import { PurchaseRequest } from '../objects/procurement_request.object';
import { PurchaseOrder } from '../objects/procurement_order.object';
import { GoodsReceipt } from '../objects/procurement_receipt.object';

/**
 * Seed data — covers full template surface:
 *   • 4 vendors across categories
 *   • 5 PRs covering all lifecycle states + threshold scenarios
 *   • 4 POs (draft / sent / partial / received)
 *   • 3 receipts demonstrating 3-way-match rollup
 */

const vendors = defineSeed(Vendor, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    {
      name: 'Cloudwell Hosting, Inc.',
      vendor_code: 'V-CW-001',
      category: 'saas',
      status: 'active',
      default_payment_terms: 'net_30',
      country: 'US',
      website: 'https://cloudwell.example.com',
      primary_contact_name: 'Amelia Ortega',
      primary_contact_email: 'amelia.ortega@cloudwell.example.com',
    },
    {
      name: 'Dell Technologies',
      vendor_code: 'V-DL-002',
      category: 'hardware',
      status: 'active',
      default_payment_terms: 'net_45',
      country: 'US',
      primary_contact_name: 'James Wu',
      primary_contact_email: 'james.wu@dell.example.com',
    },
    {
      name: 'Bright Marketing Studio',
      vendor_code: 'V-BM-003',
      category: 'marketing',
      status: 'active',
      default_payment_terms: 'net_30',
      country: 'UK',
      primary_contact_name: 'Sara Lin',
      primary_contact_email: 'sara@brightmarketing.example.co.uk',
    },
    {
      name: 'Sato Translations K.K.',
      vendor_code: 'V-ST-004',
      category: 'services',
      status: 'onboarding',
      default_payment_terms: 'net_45',
      country: 'JP',
      primary_contact_name: 'Kenji Sato',
      primary_contact_email: 'kenji.sato@sato-tx.example.jp',
    },
  ],
});

const requests = defineSeed(PurchaseRequest, {
  mode: 'upsert',
  externalId: 'title',
  records: [
    {
      title: 'Annual Cloudwell hosting renewal',
      request_number: 'PR-2026-0001',
      vendor: 'Cloudwell Hosting, Inc.',
      category: 'saas',
      status: 'approved', // → triggers PR→PO convert flow
      estimated_amount: 180000,
      needed_by: cel`daysFromNow(30)`,
      cost_center: 'ENG-INFRA',
      justification: 'Production hosting; renewal must close before contract expires.',
    },
    {
      title: '10x Dell P2723D monitors for new hires',
      request_number: 'PR-2026-0002',
      vendor: 'Dell Technologies',
      category: 'hardware',
      status: 'submitted', // → over $5k → triggers approval flow
      estimated_amount: 7500,
      needed_by: cel`daysFromNow(14)`,
      cost_center: 'PEOPLE-OPS',
      justification: 'Standard issue for 10 new engineers starting next quarter.',
    },
    {
      title: 'Q2 paid social campaign',
      request_number: 'PR-2026-0003',
      vendor: 'Bright Marketing Studio',
      category: 'marketing',
      status: 'draft',
      estimated_amount: 24000,
      needed_by: cel`daysFromNow(60)`,
      cost_center: 'MKT',
    },
    {
      title: 'Localization services — Japanese docs',
      request_number: 'PR-2026-0004',
      vendor: 'Sato Translations K.K.',
      category: 'services',
      status: 'submitted',
      estimated_amount: 3200, // below threshold; no approval flow
      needed_by: cel`daysFromNow(45)`,
      cost_center: 'DOCS',
      justification: 'Translate API reference for JP market launch.',
    },
    {
      title: 'Office snacks — Q2 stocking',
      request_number: 'PR-2026-0005',
      vendor: 'Bright Marketing Studio', // placeholder vendor; real fork would have a grocery vendor
      category: 'facilities',
      status: 'rejected',
      estimated_amount: 1200,
      needed_by: cel`daysFromNow(10)`,
      cost_center: 'FACILITIES',
      notes: 'Rejected — budget already allocated for the quarter.',
    },
  ],
});

const orders = defineSeed(PurchaseOrder, {
  mode: 'upsert',
  externalId: 'po_number',
  records: [
    {
      po_number: 'PO-2026-001',
      vendor: 'Cloudwell Hosting, Inc.',
      status: 'sent',
      total_amount: 180000,
      payment_terms: 'net_30',
      order_date: cel`daysAgo(5)`,
      expected_delivery: cel`daysFromNow(25)`,
      notes: 'Annual SaaS subscription; "delivery" = activation confirmation email.',
    },
    {
      po_number: 'PO-2026-002',
      vendor: 'Dell Technologies',
      status: 'partial',
      total_amount: 7500,
      payment_terms: 'net_45',
      order_date: cel`daysAgo(20)`,
      expected_delivery: cel`daysFromNow(5)`,
      notes: '5 of 10 monitors delivered last week; remainder backordered.',
    },
    {
      po_number: 'PO-2026-003',
      vendor: 'Sato Translations K.K.',
      status: 'sent',
      total_amount: 3200,
      payment_terms: 'net_45',
      order_date: cel`daysAgo(10)`,
      expected_delivery: cel`daysAgo(2)`, // OVERDUE → po_overdue flow
      notes: 'Translation deliverable was due 2 days ago — chase Kenji.',
    },
    {
      po_number: 'PO-2025-099',
      vendor: 'Bright Marketing Studio',
      status: 'closed',
      total_amount: 18000,
      payment_terms: 'net_30',
      order_date: cel`daysAgo(120)`,
      expected_delivery: cel`daysAgo(90)`,
      actual_delivery: cel`daysAgo(88)`,
      notes: 'Q4 campaign closed out successfully.',
    },
  ],
});

const receipts = defineSeed(GoodsReceipt, {
  mode: 'upsert',
  externalId: 'receipt_number',
  records: [
    {
      receipt_number: 'GR-2026-001',
      purchase_order: 'PO-2026-002',
      received_at: cel`daysAgo(7)`,
      quality: 'accepted',
      received_value: 3750,
      notes: 'First 5 monitors received in good condition.',
    },
    {
      receipt_number: 'GR-2025-088',
      purchase_order: 'PO-2025-099',
      received_at: cel`daysAgo(88)`,
      quality: 'accepted',
      received_value: 18000,
      notes: 'Full delivery accepted on Q4 campaign close.',
    },
    {
      receipt_number: 'GR-2026-002',
      purchase_order: 'PO-2026-002',
      received_at: cel`daysAgo(1)`,
      quality: 'rejected',
      received_value: 0,
      notes: '1 monitor arrived with cracked panel — returned to vendor.',
    },
  ],
});

export const ProcurementSeedData = [vendors, requests, orders, receipts];
