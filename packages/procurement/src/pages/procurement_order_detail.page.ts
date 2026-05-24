// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Page } from '@objectstack/spec/ui';

/**
 * Purchase Order detail — slotted, header override only. Defaults render
 * highlights, related lists (receipts, comments), history.
 */
export const PurchaseOrderDetailPage = {
  name: 'procurement_order_detail_page',
  label: 'Purchase Order Detail',
  description: 'Slotted detail page for PO — header override only.',
  type: 'record',
  object: 'procurement_order',
  kind: 'slotted',
  regions: [],
  slots: {
    header: {
      type: 'page:header',
      id: 'procurement_order_header_slotted',
      label: 'PO Header',
      properties: {
        title: '{po_number}',
        subtitle: '{vendor} · {status} · {total_amount}',
        eyebrow: 'PURCHASE ORDER',
        icon: 'file-check',
        breadcrumb: true,
      },
    },
  },
} as unknown as Page;
