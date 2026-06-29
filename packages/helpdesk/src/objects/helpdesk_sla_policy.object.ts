// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * SLA Policy — first-response and resolution targets in minutes, per priority.
 * `helpdesk_ticket.hook.ts` stamps `first_response_due_at` and
 * `resolution_due_at` on insert using these per-priority minutes (the hook
 * ships the same defaults inline to stay payload-only; a fork can read the
 * customer's tier-matched policy here instead).
 *
 * Keeping minutes-per-priority as scalar fields (not a JSON map) so they're
 * filterable / chart-able. In a fork add business-hours calendar awareness.
 */
export const SLAPolicy = ObjectSchema.create({
  name: 'helpdesk_sla_policy',
  label: 'SLA Policy',
  pluralLabel: 'SLA Policies',
  icon: 'clock',
  description: 'Response and resolution time targets, by priority.',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 120,
    }),
    applies_to_tier: Field.select({
      label: 'Applies To Tier',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Pro', value: 'pro' },
        { label: 'Business', value: 'business' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    }),
    is_default: Field.boolean({
      label: 'Default',
      defaultValue: false,
      description: 'Fallback policy when no tier match.',
    }),

    first_response_low_minutes: Field.number({
      label: 'First Response — Low (min)',
      defaultValue: 1440,
    }),
    first_response_normal_minutes: Field.number({
      label: 'First Response — Normal (min)',
      defaultValue: 480,
    }),
    first_response_high_minutes: Field.number({
      label: 'First Response — High (min)',
      defaultValue: 120,
    }),
    first_response_urgent_minutes: Field.number({
      label: 'First Response — Urgent (min)',
      defaultValue: 30,
    }),

    resolution_low_minutes: Field.number({ label: 'Resolution — Low (min)', defaultValue: 10080 }),
    resolution_normal_minutes: Field.number({
      label: 'Resolution — Normal (min)',
      defaultValue: 2880,
    }),
    resolution_high_minutes: Field.number({ label: 'Resolution — High (min)', defaultValue: 1440 }),
    resolution_urgent_minutes: Field.number({
      label: 'Resolution — Urgent (min)',
      defaultValue: 240,
    }),

    notes: Field.markdown({ label: 'Notes' }),
  },

  enable: { searchable: true, apiEnabled: true, trash: true, mru: true },
  indexes: [{ fields: ['applies_to_tier'] }, { fields: ['is_default'] }],
  nameField: 'name',
  compactLayout: ['name', 'applies_to_tier', 'is_default'],
});
