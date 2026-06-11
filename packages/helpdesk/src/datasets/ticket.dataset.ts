// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/**
 * Ticket analytics dataset (ADR-0021) — the semantic source of truth for the
 * Agent Workbench and Manager Overview dashboards. Widgets bind to it and
 * select measures/dimensions BY NAME.
 */
export const TicketDataset = defineDataset({
  name: 'ticket_metrics',
  label: 'Ticket Metrics',
  description: 'Helpdesk ticket counts and CSAT.',
  object: 'helpdesk_ticket',
  dimensions: [
    { name: 'status', label: 'Status', field: 'status', type: 'string' },
    { name: 'channel', label: 'Channel', field: 'channel', type: 'string' },
    { name: 'ai_category', label: 'AI Category', field: 'ai_category', type: 'string' },
    { name: 'ai_sentiment', label: 'AI Sentiment', field: 'ai_sentiment', type: 'string' },
    { name: 'priority', label: 'Priority', field: 'priority', type: 'string' },
    { name: 'resolved_at', label: 'Resolved At', field: 'resolved_at', type: 'date', dateGranularity: 'day' },
  ],
  measures: [
    { name: 'ticket_count', label: 'Tickets', aggregate: 'count' },
    { name: 'avg_csat', label: 'Avg CSAT', aggregate: 'avg', field: 'csat_score', format: '0.00' },
  ],
});
