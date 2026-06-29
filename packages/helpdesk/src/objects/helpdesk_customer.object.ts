// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Customer — the end-user submitting tickets. Lightweight contact record;
 * fork to add company/account hierarchy, contracts back-link, NPS history.
 *
 * Customers with a `portal_user` set can log into the customer portal
 * (a permission-scoped slice of the same app).
 */
export const Customer = ObjectSchema.create({
  name: 'helpdesk_customer',
  label: 'Customer',
  pluralLabel: 'Customers',
  icon: 'user',
  description: 'A person who files tickets. Maps to a portal user account.',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      searchable: true,
      maxLength: 200,
    }),
    email: Field.text({
      label: 'Email',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 200,
    }),
    company: Field.text({
      label: 'Company',
      maxLength: 200,
    }),
    tier: Field.select({
      label: 'Tier',
      options: [
        { label: 'Free', value: 'free', color: '#94A3B8', default: true },
        { label: 'Pro', value: 'pro', color: '#3B82F6' },
        { label: 'Business', value: 'business', color: '#A855F7' },
        { label: 'Enterprise', value: 'enterprise', color: '#10B981' },
      ],
      description: 'Drives default SLA policy selection.',
    }),
    locale: Field.text({
      label: 'Preferred Locale',
      maxLength: 16,
      description: 'BCP-47, e.g. en, zh-CN, ja. Used for reply suggestions.',
    }),
    portal_user: Field.lookup('sys_user', {
      label: 'Portal User',
      description: 'Linked user account for portal login.',
    }),
    timezone: Field.text({ label: 'Timezone', maxLength: 80 }),
    notes: Field.markdown({ label: 'Notes' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['email'] }, { fields: ['tier'] }],

  nameField: 'name',
  compactLayout: ['name', 'email', 'company', 'tier'],
});
