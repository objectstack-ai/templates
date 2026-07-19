// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F } from '@objectstack/spec';

/**
 * Goods Receipt — one record per receiving event against a PO. The
 * `received_amount` rollup on PurchaseOrder is updated by the
 * `procurement_receipt.hook.ts` after-create handler.
 *
 * Quality outcome ("accepted" / "rejected" / "partial") drives the 3-way
 * match: only `accepted` value rolls up into PO.received_amount.
 */
export const GoodsReceipt = ObjectSchema.create({
  name: 'procurement_receipt',
  sharingModel: 'private',
  label: 'Goods Receipt',
  pluralLabel: 'Goods Receipts',
  icon: 'package',
  description: 'A receiving event recording what arrived against a PO.',

  fields: {
    receipt_number: Field.text({
      label: 'Receipt Number',
      unique: true,
      maxLength: 40,
    }),
    purchase_order: Field.lookup('procurement_order', {
      label: 'Purchase Order',
      required: true,
    }),
    received_at: Field.datetime({
      label: 'Received At',
      required: true,
    }),
    received_by: Field.lookup('sys_user', { label: 'Received By' }),
    quality: Field.select({
      label: 'Quality',
      required: true,
      options: [
        { label: 'Accepted', value: 'accepted', color: '#10B981', default: true },
        { label: 'Partial', value: 'partial', color: '#F59E0B' },
        { label: 'Rejected', value: 'rejected', color: '#EF4444' },
      ],
    }),
    received_value: Field.currency({
      label: 'Received Value',
      required: true,
      min: 0,
      description:
        'Dollar value of goods accepted in this receipt. Rolls up into PO.received_amount via the after-create hook.',
    }),
    notes: Field.markdown({ label: 'Notes' }),

    // ADR-0079: real field holding the record title (was the render-only
    // `titleFormat` template `Receipt {{receipt_number}}`). A stored formula
    // so the server can return/query the display name.
    display_name: Field.formula({
      label: 'Display Name',
      expression: F`'Receipt ' + coalesce(record.receipt_number, '')`,
    }),
  },

  enable: {
    apiEnabled: true,
    trash: true,
  },

  indexes: [{ fields: ['purchase_order'] }, { fields: ['received_at'] }, { fields: ['quality'] }],

  nameField: 'display_name',
  highlightFields: ['receipt_number', 'purchase_order', 'quality', 'received_value', 'received_at'],

  validations: [
    {
      name: 'rejected_has_zero_value',
      type: 'script',
      severity: 'error',
      message: 'Rejected receipts must have a received_value of 0.',
      condition: P`record.quality == "rejected" && record.received_value != null && record.received_value > 0`,
    },
  ],
});
