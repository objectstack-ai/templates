// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Page } from '@objectstack/spec/ui';

/**
 * Ticket detail — slotted, header override only. The header surfaces the
 * AI sentiment + priority as eyebrow + subtitle so triagers see the most
 * critical signals at a glance.
 */
export const TicketDetailPage = {
  name: 'helpdesk_ticket_detail_page',
  label: 'Ticket Detail',
  description: 'Slotted detail page for tickets — header override only.',
  type: 'record',
  object: 'helpdesk_ticket',
  kind: 'slotted',
  regions: [],
  slots: {
    header: {
      type: 'page:header',
      id: 'helpdesk_ticket_header_slotted',
      label: 'Ticket Header',
      properties: {
        title: '{name}',
        subtitle: '{ticket_number} · {status} · {priority} · {customer}',
        eyebrow: 'TICKET · {ai_sentiment} · {ai_category}',
        icon: 'life-buoy',
        breadcrumb: true,
      },
    },
  },
} as unknown as Page;
