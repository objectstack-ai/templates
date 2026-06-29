// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Vendor — the supplier master. One per legal entity you buy from.
 * Onboarding fields are deliberately thin; fork to add tax IDs, bank
 * accounts, contracts back-link, ESG scoring, etc.
 */
export const Vendor = ObjectSchema.create({
  name: 'procurement_vendor',
  label: 'Vendor',
  pluralLabel: 'Vendors',
  icon: 'building',
  description: 'A supplier you place purchase orders against. Vendor master record.',

  fields: {
    name: Field.text({
      label: 'Legal Name',
      required: true,
      searchable: true,
      maxLength: 200,
    }),
    vendor_code: Field.text({
      label: 'Vendor Code',
      unique: true,
      maxLength: 40,
      description: 'Your internal ID. Often pulled from ERP.',
    }),
    category: Field.select({
      label: 'Category',
      options: [
        { label: 'Software / SaaS', value: 'saas', color: '#3B82F6', default: true },
        { label: 'Hardware', value: 'hardware', color: '#6366F1' },
        { label: 'Professional Services', value: 'services', color: '#10B981' },
        { label: 'Marketing', value: 'marketing', color: '#F59E0B' },
        { label: 'Facilities', value: 'facilities', color: '#EF4444' },
        { label: 'Other', value: 'other', color: '#94A3B8' },
      ],
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      options: [
        { label: 'Active', value: 'active', color: '#10B981', default: true },
        { label: 'Pending Onboarding', value: 'onboarding', color: '#F59E0B' },
        { label: 'Suspended', value: 'suspended', color: '#EF4444' },
        { label: 'Archived', value: 'archived', color: '#94A3B8' },
      ],
    }),
    default_payment_terms: Field.select({
      label: 'Default Payment Terms',
      options: [
        { label: 'Net 15', value: 'net_15' },
        { label: 'Net 30', value: 'net_30', default: true },
        { label: 'Net 45', value: 'net_45' },
        { label: 'Net 60', value: 'net_60' },
        { label: 'Upfront', value: 'upfront' },
      ],
    }),
    risk_tier: Field.select({
      label: 'Risk Tier',
      description: 'Supplier risk rating — drives review cadence and approval scrutiny.',
      options: [
        { label: 'Low', value: 'low', color: '#10B981', default: true },
        { label: 'Medium', value: 'medium', color: '#F59E0B' },
        { label: 'High', value: 'high', color: '#EF4444' },
      ],
    }),
    is_preferred: Field.boolean({
      label: 'Preferred Vendor',
      defaultValue: false,
      description: 'Preferred suppliers should be favoured when sourcing.',
    }),
    country: Field.text({ label: 'Country', maxLength: 80 }),
    website: Field.text({ label: 'Website', maxLength: 200 }),
    primary_contact_name: Field.text({ label: 'Primary Contact', maxLength: 120 }),
    primary_contact_email: Field.text({ label: 'Primary Contact Email', maxLength: 200 }),
    notes: Field.markdown({ label: 'Notes' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['name'] }, { fields: ['status'] }, { fields: ['category'] }],

  nameField: 'name',
  compactLayout: ['name', 'vendor_code', 'category', 'status', 'risk_tier', 'is_preferred'],
});
