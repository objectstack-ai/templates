// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';
/**
 * Purchase Order — formal commitment to a vendor. One PO per (vendor,
 * request) pair. Line items live in `lines` as JSON to stay under the
 * 4-object CHARTER budget; in a real fork promote them to their own object.
 *
 * 3-way-match concept (PO ↔ Receipt ↔ Invoice) is partially modelled:
 * `procurement_receipt` provides the receiving leg; invoice ingestion is
 * left as a connector hook in your fork.
 */
export const PurchaseOrder = ObjectSchema.create({
  name: 'procurement_order',
  label: 'Purchase Order',
  pluralLabel: 'Purchase Orders',
  icon: 'file-check',
  description:
    'A commitment to a vendor for goods or services. Created from an approved PR; closed when fully received.',

  fieldGroups: [
    { key: 'core', label: 'Order', icon: 'file-check' },
    { key: 'commercial', label: 'Commercial', icon: 'dollar-sign' },
    { key: 'fulfillment', label: 'Fulfillment', icon: 'truck' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    po_number: Field.text({
      label: 'PO Number',
      required: true,
      unique: true,
      maxLength: 40,
      searchable: true,
      group: 'core',
    }),
    vendor: Field.lookup('procurement_vendor', {
      label: 'Vendor',
      required: true,
      group: 'core',
    }),
    source_request: Field.lookup('procurement_request', {
      label: 'From Request',
      group: 'core',
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Draft', value: 'draft', color: '#94A3B8', default: true },
        { label: 'Sent', value: 'sent', color: '#F59E0B' },
        { label: 'Partial Receipt', value: 'partial', color: '#3B82F6' },
        { label: 'Received', value: 'received', color: '#10B981' },
        { label: 'Closed', value: 'closed', color: '#6B7280' },
        { label: 'Cancelled', value: 'cancelled', color: '#EF4444' },
      ],
    }),
    owner: Field.lookup('sys_user', {
      label: 'Buyer',
      group: 'core',
      description: 'Internal buyer responsible. Defaults to created_by.',
    }),
    total_amount: Field.currency({
      label: 'Total Amount',
      required: true,
      group: 'commercial',
      min: 0,
    }),
    received_amount: Field.currency({
      label: 'Received Amount',
      group: 'commercial',
      min: 0,
      defaultValue: 0,
      description:
        'Sum of accepted goods-receipt values. Stored header field — maintained at the top level (client/seed), not by a cross-object rollup hook (unsupported in the standalone runtime; see procurement/src/hooks/index.ts).',
    }),
    payment_terms: Field.select({
      label: 'Payment Terms',
      group: 'commercial',
      options: [
        { label: 'Net 15', value: 'net_15' },
        { label: 'Net 30', value: 'net_30', default: true },
        { label: 'Net 45', value: 'net_45' },
        { label: 'Net 60', value: 'net_60' },
        { label: 'Upfront', value: 'upfront' },
      ],
    }),
    is_fully_received: Field.formula({
      label: 'Fully Received',
      group: 'commercial',
      expression: F`record.received_amount != null && record.total_amount != null && record.received_amount >= record.total_amount`,
    }),
    match_status: Field.formula({
      label: 'Match Status',
      group: 'commercial',
      description: 'PO↔receipt match: awaiting (nothing in), partial, or matched (fully received).',
      expression: F`record.total_amount != null && record.received_amount != null && record.received_amount >= record.total_amount ? "matched" : (record.received_amount != null && record.received_amount > 0 ? "partial" : "awaiting")`,
    }),
    cost_center: Field.text({
      label: 'Cost Center',
      maxLength: 60,
      group: 'commercial',
      description: 'Carried from the originating PR so spend can be reported by cost center.',
    }),
    order_date: Field.date({
      label: 'Order Date',
      required: false,
      group: 'fulfillment',
      description:
        'Set when the PO is sent to the vendor. Not required on a draft (a PR→PO conversion creates a draft without one); the `sent_requires_order_date` validation enforces it at send time.',
    }),
    expected_delivery: Field.date({
      label: 'Expected Delivery',
      group: 'fulfillment',
    }),
    actual_delivery: Field.date({
      label: 'Actual Delivery',
      group: 'fulfillment',
    }),
    is_delivery_overdue: Field.formula({
      label: 'Delivery Overdue',
      group: 'fulfillment',
      expression: F`record.expected_delivery != null && record.expected_delivery < today() && record.status != "received" && record.status != "closed" && record.status != "cancelled"`,
    }),
    lines: Field.json({
      label: 'Line Items',
      group: 'fulfillment',
      description:
        'Array of { sku, description, qty, unit_price }. Promote to its own object in a fork if you need per-line receiving/invoicing.',
    }),
    notes: Field.markdown({ label: 'Internal Notes', group: 'meta' }),
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
    { fields: ['vendor'] },
    { fields: ['status'] },
    { fields: ['order_date'] },
    { fields: ['expected_delivery'] },
  ],

  titleFormat: tmpl`{{record.po_number}}`,
  compactLayout: [
    'po_number',
    'vendor',
    'total_amount',
    'status',
    'match_status',
    'expected_delivery',
  ],

  validations: [
    {
      type: 'state_machine',
      name: 'po_lifecycle',
      field: 'status',
      transitions: {
        draft: ['sent'],
        sent: ['partial', 'received', 'cancelled'],
        partial: ['received', 'closed'],
        received: ['closed'],
        closed: [],
        cancelled: [],
      },
      message: 'Illegal status transition.',
    },
    {
      name: 'sent_requires_order_date',
      type: 'script',
      severity: 'error',
      message: 'Sent POs must have an order_date.',
      condition: P`record.status == "sent" && record.order_date == null`,
    },
    {
      name: 'received_not_exceed_total',
      type: 'script',
      severity: 'error',
      message: 'received_amount cannot exceed total_amount.',
      condition: P`record.received_amount != null && record.total_amount != null && record.received_amount > record.total_amount`,
    },
  ],

  // Auto-advance to "received" is handled by `procurement_order.hook.ts`.
  // Object-level `workflows` are not a supported 7.x ObjectSchema field.
});
