// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Message — a single entry in a ticket's conversation thread.
 * `direction` distinguishes inbound (from customer), outbound (agent → customer),
 * and internal_note (agent ↔ agent, not visible to customer portal).
 *
 * `is_ai_drafted` flags messages whose body originated from an AI suggestion
 * (even if the agent edited before sending) — feeds the "AI assist hit rate"
 * dashboard metric.
 */
export const Message = ObjectSchema.create({
  name: 'helpdesk_message',
  label: 'Message',
  pluralLabel: 'Messages',
  icon: 'message-circle',
  description: 'One message in a ticket thread. Inbound, outbound, or internal note.',

  fields: {
    name: Field.text({
      label: 'Snippet',
      maxLength: 200,
      description: 'Display name = first 200 chars of body. Auto-computed by hook in a real fork.',
    }),
    ticket: Field.lookup('helpdesk_ticket', {
      label: 'Ticket',
      required: true,
    }),
    direction: Field.select({
      label: 'Direction',
      required: true,
      options: [
        { label: 'Inbound', value: 'inbound', color: '#3B82F6', default: true },
        { label: 'Outbound', value: 'outbound', color: '#10B981' },
        { label: 'Internal Note', value: 'internal_note', color: '#94A3B8' },
      ],
    }),
    author_user: Field.lookup('sys_user', { label: 'Author (User)' }),
    author_customer: Field.lookup('helpdesk_customer', { label: 'Author (Customer)' }),
    body: Field.markdown({
      label: 'Body',
      required: true,
    }),
    is_ai_drafted: Field.boolean({
      label: 'AI Drafted',
      defaultValue: false,
      description: 'True if the agent started from an AI suggestion.',
    }),
    sent_at: Field.datetime({ label: 'Sent At' }),
  },

  enable: {
    apiEnabled: true,
    trash: true,
  },

  indexes: [{ fields: ['ticket'] }, { fields: ['direction'] }],
  titleFormat: tmpl`{{record.name}}`,
  displayNameField: 'name',
  compactLayout: ['name', 'ticket', 'direction', 'sent_at'],
});
