// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';
import { TicketStateMachine } from './helpdesk_ticket.state';

/**
 * Helpdesk Ticket — the central object. **AI fields are first-class**:
 * `ai_summary`, `ai_category`, `ai_priority_suggestion`, `ai_sentiment`,
 * `ai_intent`, `ai_language`, `ai_suggested_reply`, `ai_suggested_kb_ids`.
 *
 * Unlike Zendesk/Freshdesk where AI is a paid add-on macro, these fields
 * are part of the schema. The `ai_triage_on_create` flow populates them
 * via a script node. In a real deployment the script calls an LLM
 * provider (OpenAI / Anthropic / Bedrock / Azure / 通义 / 文心) — the
 * shape is fixed so dashboards, automations, and analytics work the same
 * regardless of which provider you wire up.
 */
export const Ticket = ObjectSchema.create({
  name: 'helpdesk_ticket',
  label: 'Ticket',
  pluralLabel: 'Tickets',
  icon: 'life-buoy',
  description:
    'A customer support request. AI-triaged, SLA-tracked, threaded with messages.',

  fieldGroups: [
    { key: 'core', label: 'Ticket', icon: 'life-buoy' },
    { key: 'people', label: 'People', icon: 'users' },
    { key: 'ai', label: 'AI Assist', icon: 'sparkles' },
    { key: 'sla', label: 'SLA', icon: 'clock' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    ticket_number: Field.text({
      label: 'Ticket #',
      required: true,
      unique: true,
      maxLength: 40,
      searchable: true,
      group: 'core',
    }),
    name: Field.text({
      label: 'Subject',
      required: true,
      maxLength: 280,
      searchable: true,
      group: 'core',
      description: 'Short summary of the request. Used as the display name.',
    }),
    description: Field.markdown({
      label: 'Description',
      required: true,
      group: 'core',
    }),
    channel: Field.select({
      label: 'Channel',
      required: true,
      group: 'core',
      options: [
        { label: 'Email', value: 'email', color: '#3B82F6', default: true },
        { label: 'Web Form', value: 'web', color: '#10B981' },
        { label: 'Chat', value: 'chat', color: '#A855F7' },
        { label: 'Phone', value: 'phone', color: '#F59E0B' },
        { label: 'API', value: 'api', color: '#6B7280' },
      ],
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'New', value: 'new', color: '#3B82F6', default: true },
        { label: 'Triaged', value: 'triaged', color: '#8B5CF6' },
        { label: 'In Progress', value: 'in_progress', color: '#F59E0B' },
        { label: 'Waiting Customer', value: 'waiting_customer', color: '#06B6D4' },
        { label: 'Resolved', value: 'resolved', color: '#10B981' },
        { label: 'Closed', value: 'closed', color: '#6B7280' },
        { label: 'Escalated', value: 'escalated', color: '#EF4444' },
      ],
    }),
    priority: Field.select({
      label: 'Priority',
      required: true,
      group: 'core',
      options: [
        { label: 'Low', value: 'low', color: '#94A3B8' },
        { label: 'Normal', value: 'normal', color: '#3B82F6', default: true },
        { label: 'High', value: 'high', color: '#F59E0B' },
        { label: 'Urgent', value: 'urgent', color: '#EF4444' },
      ],
    }),

    customer: Field.lookup('helpdesk_customer', {
      label: 'Customer',
      required: true,
      group: 'people',
    }),
    team: Field.lookup('helpdesk_team', {
      label: 'Team',
      group: 'people',
    }),
    assignee: Field.lookup('user', {
      label: 'Assignee',
      group: 'people',
      description: 'Agent currently responsible.',
    }),
    sla_policy: Field.lookup('helpdesk_sla_policy', {
      label: 'SLA Policy',
      group: 'sla',
    }),

    ai_summary: Field.markdown({
      label: 'AI Summary',
      group: 'ai',
      description: 'One-paragraph TL;DR generated on triage.',
    }),
    ai_category: Field.select({
      label: 'AI Category',
      group: 'ai',
      options: [
        { label: 'Bug / Defect', value: 'bug', color: '#EF4444' },
        { label: 'How-to', value: 'how_to', color: '#3B82F6' },
        { label: 'Account / Billing', value: 'billing', color: '#F59E0B' },
        { label: 'Feature Request', value: 'feature_request', color: '#A855F7' },
        { label: 'Outage', value: 'outage', color: '#DC2626' },
        { label: 'Feedback', value: 'feedback', color: '#10B981' },
        { label: 'Other', value: 'other', color: '#94A3B8' },
      ],
    }),
    ai_intent: Field.text({
      label: 'AI Intent',
      group: 'ai',
      maxLength: 200,
      description: 'Short phrase: what the customer ultimately wants.',
    }),
    ai_sentiment: Field.select({
      label: 'AI Sentiment',
      group: 'ai',
      options: [
        { label: 'Positive', value: 'positive', color: '#10B981' },
        { label: 'Neutral', value: 'neutral', color: '#94A3B8', default: true },
        { label: 'Frustrated', value: 'frustrated', color: '#F59E0B' },
        { label: 'Angry', value: 'angry', color: '#EF4444' },
      ],
    }),
    ai_priority_suggestion: Field.select({
      label: 'AI Suggested Priority',
      group: 'ai',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      description: 'AI may differ from human-set priority — review on triage.',
    }),
    ai_language: Field.text({
      label: 'AI Detected Language',
      group: 'ai',
      maxLength: 16,
      description: 'BCP-47 tag, e.g. en, zh-CN, ja.',
    }),
    ai_suggested_reply: Field.markdown({
      label: 'AI Suggested Reply',
      group: 'ai',
      description: 'First-draft reply for the agent to edit and send.',
    }),
    ai_suggested_kb_ids: Field.json({
      label: 'AI Suggested KB Articles',
      group: 'ai',
      description: 'Array of helpdesk_kb_article IDs recalled by the AI.',
    }),
    ai_confidence: Field.number({
      label: 'AI Confidence',
      group: 'ai',
      description: '0.0–1.0. Below 0.6 we route to human triage.',
    }),
    ai_triage_at: Field.datetime({
      label: 'AI Triaged At',
      group: 'ai',
    }),

    first_response_due_at: Field.datetime({
      label: 'First Response Due',
      group: 'sla',
    }),
    resolution_due_at: Field.datetime({
      label: 'Resolution Due',
      group: 'sla',
    }),
    first_response_at: Field.datetime({
      label: 'First Response At',
      group: 'sla',
    }),
    resolved_at: Field.datetime({
      label: 'Resolved At',
      group: 'sla',
    }),
    is_first_response_breached: Field.formula({
      label: 'First Response Breached',
      group: 'sla',
      expression: F`record.first_response_due_at != null && record.first_response_at == null && record.first_response_due_at < now()`,
    }),
    is_resolution_breached: Field.formula({
      label: 'Resolution Breached',
      group: 'sla',
      expression: F`record.resolution_due_at != null && record.resolved_at == null && record.resolution_due_at < now()`,
    }),

    csat_score: Field.number({
      label: 'CSAT (1–5)',
      group: 'meta',
      min: 1,
      max: 5,
    }),
    csat_comment: Field.text({
      label: 'CSAT Comment',
      group: 'meta',
      maxLength: 1000,
    }),
    tags: Field.json({
      label: 'Tags',
      group: 'meta',
    }),
    internal_notes: Field.markdown({
      label: 'Internal Notes',
      group: 'meta',
    }),
  },

  stateMachines: { lifecycle: TicketStateMachine },

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
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['assignee'] },
    { fields: ['customer'] },
    { fields: ['team'] },
    { fields: ['ai_sentiment'] },
    { fields: ['first_response_due_at'] },
    { fields: ['resolution_due_at'] },
  ],

  titleFormat: tmpl`{{record.ticket_number}} — {{record.name}}`,
  displayNameField: 'name',
  compactLayout: ['ticket_number', 'name', 'status', 'priority', 'assignee', 'ai_sentiment'],

  validations: [
    {
      name: 'resolved_requires_resolved_at',
      type: 'script',
      severity: 'error',
      message: 'Resolved tickets must have a resolved_at timestamp.',
      condition: P`record.status == "resolved" && record.resolved_at == null`,
    },
    {
      name: 'csat_only_when_resolved_or_closed',
      type: 'script',
      severity: 'warning',
      message: 'CSAT is normally collected after resolution.',
      condition: P`record.csat_score != null && record.status != "resolved" && record.status != "closed"`,
    },
  ],

  workflows: [
    {
      name: 'auto_set_resolved_at',
      objectName: 'helpdesk_ticket',
      triggerType: 'on_update',
      criteria: P`record.status == "resolved" && record.resolved_at == null`,
      active: true,
      actions: [
        { name: 'stamp_resolved_at', type: 'field_update', field: 'resolved_at', value: 'now()' },
      ],
    },
  ],
});
