// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Team — a support queue / specialty group. Tickets are routed here by
 * AI category (e.g. billing → "Billing Team") or manually by a triager.
 */
export const Team = ObjectSchema.create({
  name: 'helpdesk_team',
  label: 'Team',
  pluralLabel: 'Teams',
  icon: 'users',
  description: 'A support team / queue. Tickets are routed here for assignment.',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 120,
    }),
    code: Field.text({
      label: 'Code',
      unique: true,
      maxLength: 32,
      description: 'Short id, e.g. T1 / T2 / BILL / TECH.',
    }),
    specialty: Field.select({
      label: 'Specialty',
      options: [
        { label: 'Tier 1 — General', value: 'tier1', default: true },
        { label: 'Tier 2 — Technical', value: 'tier2' },
        { label: 'Billing', value: 'billing' },
        { label: 'Account Management', value: 'account' },
        { label: 'Trust & Safety', value: 'trust' },
      ],
    }),
    manager: Field.lookup('sys_user', { label: 'Manager' }),
    is_active: Field.boolean({ label: 'Active', defaultValue: true }),
    business_hours: Field.text({
      label: 'Business Hours',
      maxLength: 200,
      description: 'Free-form e.g. "Mon–Fri 09:00–18:00 Asia/Shanghai"; fork to a structured calendar.',
    }),
  },

  enable: { searchable: true, apiEnabled: true, trash: true, mru: true },
  indexes: [{ fields: ['code'] }, { fields: ['specialty'] }],
  titleFormat: tmpl`{{record.name}}`,
  displayNameField: 'name',
  compactLayout: ['name', 'code', 'specialty', 'is_active'],
});
