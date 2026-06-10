// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Agent Workbench — what an agent sees first when they log in.
 * Top row: my queue health metrics.
 * Bottom: tables for ranked "do these next" lists.
 *
 * NOTE: analytics filters use base fields only (formula fields aren't
 * resolvable in the current platform — see PLATFORM_GAPS_FROM_TEMPLATES #10).
 */
export const AgentWorkbenchDashboard: Dashboard = {
  name: 'agent_workbench_dashboard',
  label: 'Agent Workbench',
  description: 'Your queue at a glance. Breaches, angry customers, AI-ready replies.',

  columns: 12,
  gap: 4,
  refreshInterval: 60,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [
      { label: 'New Ticket', icon: 'Plus', actionType: 'modal', actionUrl: 'create_ticket' },
    ],
  },

  widgets: [
    {
      id: 'my_open',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'My Open Tickets',
      type: 'metric',
      object: 'helpdesk_ticket',
      filter: {
        assignee: '{currentUser}',
        status: { $in: ['new', 'triaged', 'in_progress', 'waiting_customer', 'escalated'] },
      },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Inbox', format: '0,0' },
    },
    {
      id: 'breaching_resolution',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'SLA Breaching',
      type: 'metric',
      object: 'helpdesk_ticket',
      filter: {
        status: { $nin: ['closed', 'resolved'] },
        resolution_due_at: { $lt: '{today}' },
      },
      aggregate: 'count',
      colorVariant: 'danger',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'angry',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'Angry Customers',
      type: 'metric',
      object: 'helpdesk_ticket',
      filter: {
        ai_sentiment: 'angry',
        status: { $nin: ['closed', 'resolved'] },
      },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'Flame', format: '0,0' },
    },
    {
      id: 'awaiting_triage',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'Awaiting Triage',
      type: 'metric',
      object: 'helpdesk_ticket',
      filter: { status: 'new' },
      aggregate: 'count',
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'Sparkles', format: '0,0' },
    },

    {
      id: 'my_queue_table',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'My Queue (Priority Sorted)',
      type: 'table',
      object: 'helpdesk_ticket',
      aggregate: 'count',
      filter: {
        assignee: '{currentUser}',
        status: { $nin: ['closed', 'resolved'] },
      },
      layout: { x: 0, y: 2, w: 8, h: 5 },
      options: {
        columns: ['ticket_number', 'name', 'priority', 'ai_sentiment', 'first_response_due_at'],
        pageSize: 10,
        sort: [{ field: 'priority', order: 'desc' }],
      },
    },
    {
      id: 'breaching_table',
      dataset: 'ticket_metrics', values: ['ticket_count'],
      title: 'SLA Breaches',
      type: 'table',
      object: 'helpdesk_ticket',
      aggregate: 'count',
      filter: {
        status: { $nin: ['closed', 'resolved'] },
        resolution_due_at: { $lt: '{today}' },
      },
      layout: { x: 8, y: 2, w: 4, h: 5 },
      options: {
        columns: ['ticket_number', 'priority', 'resolution_due_at'],
        pageSize: 10,
        sort: [{ field: 'resolution_due_at', order: 'asc' }],
      },
    },
  ],
};
