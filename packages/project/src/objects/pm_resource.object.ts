// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Resource — allocation of people or budget to projects.
 * Used to detect overallocation conflicts and inform AI predictions.
 */
export const Resource = ObjectSchema.create({
  name: 'pm_resource',
  label: 'Resource',
  pluralLabel: 'Resources',
  icon: 'users',
  description: 'Team member or budget allocated to a project.',

  fieldGroups: [
    { key: 'core', label: 'Allocation', icon: 'users', defaultExpanded: true },
  ],

  fields: {
    project: Field.lookup('pm_project', {
      label: 'Project',
      required: true,
      group: 'core',
    }),
    person: Field.lookup('user', {
      label: 'Person',
      required: true,
      group: 'core',
    }),
    role: Field.text({
      label: 'Role',
      required: false,
      maxLength: 100,
      group: 'core',
      description: 'E.g., Developer, Designer, QA.',
    }),
    allocated_hours_per_week: Field.number({
      label: 'Allocated Hours/Week',
      required: true,
      group: 'core',
      min: 0,
      max: 40,
      description: 'Expected hours per week on this project.',
    }),
    start_date: Field.date({
      label: 'Allocation Start',
      required: true,
      group: 'core',
    }),
    end_date: Field.date({
      label: 'Allocation End',
      required: false,
      group: 'core',
    }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    trash: true,
  },

  indexes: [
    { fields: ['project'] },
    { fields: ['person'] },
    { fields: ['start_date'] },
  ],

  titleFormat: tmpl`{{record.person.name}} → {{record.project.name}}`,
  compactLayout: ['person', 'project', 'role', 'allocated_hours_per_week'],
});
