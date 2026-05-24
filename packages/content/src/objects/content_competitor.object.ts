// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Competitor — a tracked org / blog / creator we watch for signals.
 * Deliberately tiny: name + URL + category + a free-form notes blob.
 * Signal volume per competitor is what makes this object useful, not
 * its own field count.
 */
export const Competitor = ObjectSchema.create({
  name: 'content_competitor',
  label: 'Competitor',
  pluralLabel: 'Competitors',
  icon: 'eye',
  description: 'An organisation, publication, or creator we monitor for content signals.',

  fieldGroups: [
    { key: 'core', label: 'Competitor', icon: 'eye' },
    { key: 'meta', label: 'Notes', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 120,
      group: 'core',
    }),
    category: Field.select({
      label: 'Category',
      group: 'core',
      options: [
        { label: 'Direct Competitor', value: 'direct', color: '#EF4444', default: true },
        { label: 'Indirect / Adjacent', value: 'indirect', color: '#F59E0B' },
        { label: 'Big-Co Reference', value: 'big_co', color: '#3B82F6' },
        { label: 'Creator / Newsletter', value: 'creator', color: '#8B5CF6' },
        { label: 'Industry Analyst', value: 'analyst', color: '#10B981' },
      ],
    }),
    website: Field.text({ label: 'Website', maxLength: 200, group: 'core' }),
    rss_feed: Field.text({
      label: 'RSS / Feed URL',
      maxLength: 300,
      group: 'core',
      description: 'Optional feed used by an external watcher to drop new signals via API.',
    }),
    notes: Field.markdown({ label: 'Notes', group: 'meta' }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    feeds: true,
    activities: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['name'], unique: true }, { fields: ['category'] }],

  displayNameField: 'name',
  titleFormat: tmpl`{{record.name}}`,
  compactLayout: ['name', 'category', 'website'],
});
