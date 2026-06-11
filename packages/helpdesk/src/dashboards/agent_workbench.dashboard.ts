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
      dataset: 'ticket_metrics',
      values: ['ticket_count'],
      title: 'My Open Tickets',
      type: 'metric',
      filter: {
        assignee: '{currentUser}',
        status: { $in: ['new', 'triaged', 'in_progress', 'waiting_customer', 'escalated'] },
      },
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Inbox', format: '0,0' },
    },
    {
      id: 'breaching_resolution',
      dataset: 'ticket_metrics',
      values: ['ticket_count'],
      title: 'SLA Breaching',
      type: 'metric',
      filter: {
        status: { $nin: ['closed', 'resolved'] },
        resolution_due_at: { $lt: '{today}' },
      },
      colorVariant: 'danger',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'angry',
      dataset: 'ticket_metrics',
      values: ['ticket_count'],
      title: 'Angry Customers',
      type: 'metric',
      filter: {
        ai_sentiment: 'angry',
        status: { $nin: ['closed', 'resolved'] },
      },
      colorVariant: 'warning',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'Flame', format: '0,0' },
    },
    {
      id: 'awaiting_triage',
      dataset: 'ticket_metrics',
      values: ['ticket_count'],
      title: 'Awaiting Triage',
      type: 'metric',
      filter: { status: 'new' },
      colorVariant: 'success',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'Sparkles', format: '0,0' },
    },

    // Record listings moved to object-bound ListViews (ADR-0017): `my_queue_table`
    // is the Tickets "My Queue" tab (my_queue view); `breaching_table` is the
    // Tickets "Breaching SLA" tab. KPI widgets above keep the counts here.
  ],
};
