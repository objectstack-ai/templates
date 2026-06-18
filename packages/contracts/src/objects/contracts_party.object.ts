// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Party — the counterparty on a contract. One record per legal entity (not
 * per signer). Vendors, customers, employees, landlords, anyone you sign
 * with all share this object so totals roll up naturally.
 *
 * Polymorphic platform features (free):
 *   - sys_attachment (parent_object = "contracts_party", parent_id = "{id}")
 *   - sys_audit_log  (per-field via Field.trackHistory, plugin-audit / ADR-0052)
 */
export const Party = ObjectSchema.create({
  name: 'contracts_party',
  label: 'Party',
  pluralLabel: 'Parties',
  icon: 'building',
  description: 'A legal entity that is a counterparty on one or more contracts.',

  fieldGroups: [
    { key: 'core', label: 'Party', icon: 'building' },
    { key: 'contact', label: 'Contact', icon: 'mail' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    legal_name: Field.text({
      label: 'Legal Name',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 200,
      group: 'core',
    }),

    party_type: Field.select({
      label: 'Type',
      required: true,
      group: 'core',
      options: [
        { label: 'Vendor', value: 'vendor', color: '#3B82F6', default: true },
        { label: 'Customer', value: 'customer', color: '#10B981' },
        { label: 'Employee', value: 'employee', color: '#8B5CF6' },
        { label: 'Landlord', value: 'landlord', color: '#F59E0B' },
        { label: 'Partner', value: 'partner', color: '#0EA5E9' },
        { label: 'Other', value: 'other', color: '#6B7280' },
      ],
    }),

    country: Field.text({
      label: 'Country',
      maxLength: 80,
      group: 'core',
      description: 'ISO 3166 country or free text. Used for data-residency filters.',
    }),

    website: Field.text({
      label: 'Website',
      maxLength: 200,
      group: 'contact',
    }),

    primary_contact_name: Field.text({
      label: 'Primary Contact',
      maxLength: 120,
      group: 'contact',
    }),

    primary_contact_email: Field.text({
      label: 'Primary Contact Email',
      maxLength: 200,
      group: 'contact',
    }),

    notes: Field.markdown({
      label: 'Notes',
      group: 'meta',
    }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['legal_name'], unique: true }, { fields: ['party_type'] }],

  compactLayout: ['legal_name', 'party_type', 'country', 'primary_contact_email'],
  displayNameField: 'legal_name',
  titleFormat: tmpl`{{record.legal_name}}`,
});
