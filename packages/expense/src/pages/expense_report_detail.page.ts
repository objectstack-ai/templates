// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Page } from '@objectstack/spec/ui';

/**
 * Expense Report detail — slotted, header override only. Defaults render
 * highlights, related lists (lines, comments, files), and history.
 */
export const ExpenseReportDetailPage = {
  name: 'expense_report_detail_page',
  label: 'Expense Report Detail',
  description: 'Slotted detail page for an expense report — header override only.',
  type: 'record',
  object: 'expense_report',
  kind: 'slotted',
  regions: [],
  slots: {
    header: {
      type: 'page:header',
      id: 'expense_report_header_slotted',
      label: 'Report Header',
      properties: {
        title: '{title}',
        subtitle: '{requester} · {status} · {total_amount}',
        eyebrow: 'EXPENSE REPORT',
        icon: 'receipt',
        breadcrumb: true,
      },
    },
  },
} as unknown as Page;
