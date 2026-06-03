// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const TicketViews = defineView({
  list: {
    type: 'grid',
    name: 'all_tickets',
    label: 'All Tickets',
    data: { provider: 'object', object: 'helpdesk_ticket' },
    columns: [
      { field: 'ticket_number', width: 130, link: true, pinned: 'left', sortable: true },
      { field: 'name', width: 320, sortable: true },
      { field: 'status', width: 140, sortable: true },
      { field: 'priority', width: 110, sortable: true },
      { field: 'ai_sentiment', width: 130, sortable: true },
      { field: 'ai_category', width: 150 },
      { field: 'customer', width: 200 },
      { field: 'assignee', width: 160 },
      { field: 'team', width: 160 },
      { field: 'channel', width: 100 },
      { field: 'first_response_due_at', width: 170, sortable: true },
      { field: 'resolution_due_at', width: 170, sortable: true },
      { field: 'is_first_response_breached', width: 130, align: 'center' },
    ],
    sort: [{ field: 'priority', order: 'desc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: { allowedVisualizations: ['grid', 'kanban'] },
    tabs: [
      { name: 'all', label: 'All', view: 'all_tickets', isDefault: true, pinned: true },
      { name: 'open', label: 'Open', icon: 'inbox', view: 'open_tickets' },
      {
        name: 'breaching',
        label: 'Breaching SLA',
        icon: 'alert-triangle',
        view: 'breaching_tickets',
      },
      { name: 'angry', label: 'Angry', icon: 'flame', view: 'angry_tickets' },
    ],
  },

  listViews: {
    ticket_pipeline: {
      name: 'ticket_pipeline',
      type: 'kanban',
      label: 'Ticket Pipeline',
      data: { provider: 'object', object: 'helpdesk_ticket' },
      columns: ['ticket_number', 'name', 'priority', 'assignee', 'ai_sentiment'],
      kanban: {
        groupByField: 'status',
        columns: ['ticket_number', 'name', 'priority', 'assignee', 'ai_sentiment'],
      },
    },

    open_tickets: {
      name: 'open_tickets',
      type: 'grid',
      label: 'Open Tickets',
      data: { provider: 'object', object: 'helpdesk_ticket' },
      columns: [
        'ticket_number',
        'name',
        'status',
        'priority',
        'ai_sentiment',
        'assignee',
        'first_response_due_at',
      ],
      filter: [
        {
          field: 'status',
          operator: 'in',
          value: ['new', 'triaged', 'in_progress', 'waiting_customer', 'escalated'],
        },
      ],
      sort: [{ field: 'priority', order: 'desc' }],
    },

    breaching_tickets: {
      name: 'breaching_tickets',
      type: 'grid',
      label: 'Breaching SLA',
      data: { provider: 'object', object: 'helpdesk_ticket' },
      columns: [
        'ticket_number',
        'name',
        'priority',
        'first_response_due_at',
        'resolution_due_at',
        'assignee',
      ],
      filter: [
        { field: 'status', operator: 'not_in', value: ['closed', 'resolved'] },
        { field: 'resolution_due_at', operator: 'less_than', value: '{today}' },
      ],
      sort: [{ field: 'resolution_due_at', order: 'asc' }],
    },

    angry_tickets: {
      name: 'angry_tickets',
      type: 'grid',
      label: 'Angry Customers',
      data: { provider: 'object', object: 'helpdesk_ticket' },
      columns: ['ticket_number', 'name', 'customer', 'priority', 'assignee', 'team'],
      filter: [
        { field: 'ai_sentiment', operator: 'equals', value: 'angry' },
        { field: 'status', operator: 'not_in', value: ['closed', 'resolved'] },
      ],
      sort: [{ field: 'priority', order: 'desc' }],
    },

    my_queue: {
      name: 'my_queue',
      type: 'grid',
      label: 'My Queue',
      data: { provider: 'object', object: 'helpdesk_ticket' },
      columns: [
        'ticket_number',
        'name',
        'status',
        'priority',
        'ai_sentiment',
        'first_response_due_at',
      ],
      filter: [
        { field: 'assignee', operator: 'equals', value: '{currentUser}' },
        { field: 'status', operator: 'not_in', value: ['closed', 'resolved'] },
      ],
      sort: [{ field: 'priority', order: 'desc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'helpdesk_ticket' },
    sections: [
      {
        label: 'Ticket',
        columns: 2,
        fields: [
          { field: 'name', required: true, colSpan: 2 },
          'ticket_number',
          'channel',
          'status',
          'priority',
          { field: 'description', colSpan: 2 },
        ],
      },
      {
        label: 'People',
        columns: 2,
        fields: ['customer', 'team', 'assignee', 'sla_policy'],
      },
      {
        label: 'AI Assist',
        columns: 2,
        fields: [
          'ai_category',
          'ai_priority_suggestion',
          'ai_sentiment',
          'ai_language',
          'ai_confidence',
          'ai_triage_at',
          { field: 'ai_intent', colSpan: 2 },
          { field: 'ai_summary', colSpan: 2 },
          { field: 'ai_suggested_reply', colSpan: 2 },
          { field: 'ai_suggested_kb_ids', colSpan: 2 },
        ],
      },
      {
        label: 'SLA',
        columns: 2,
        fields: [
          'first_response_due_at',
          'first_response_at',
          'resolution_due_at',
          'resolved_at',
          'is_first_response_breached',
          'is_resolution_breached',
        ],
      },
      {
        label: 'CSAT & Notes',
        columns: 2,
        fields: [
          'csat_score',
          'csat_comment',
          { field: 'tags', colSpan: 2 },
          { field: 'internal_notes', colSpan: 2 },
        ],
      },
    ],
  },
});
