// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Timesheet — daily time tracking for actual effort.
 * Feeds AI models for cost actuals and future predictions.
 */
export const Timesheet = ObjectSchema.create({
  name: 'pm_timesheet',
  label: 'Timesheet Entry',
  pluralLabel: 'Timesheet Entries',
  icon: 'clock',
  description: 'Daily time tracking entry for a project.',

  fieldGroups: [{ key: 'core', label: 'Time Entry', icon: 'clock', defaultExpanded: true }],

  fields: {
    project: Field.lookup('pm_project', {
      label: 'Project',
      required: true,
      group: 'core',
    }),
    person: Field.lookup('sys_user', {
      label: 'Person',
      required: true,
      group: 'core',
    }),
    work_date: Field.date({
      label: 'Work Date',
      required: true,
      group: 'core',
    }),
    hours: Field.number({
      label: 'Hours',
      required: true,
      group: 'core',
      min: 0,
      max: 24,
      step: 0.25,
      description: 'Hours worked on this project on this date.',
    }),
    description: Field.text({
      label: 'Description',
      required: false,
      maxLength: 500,
      group: 'core',
      description: 'What was done.',
    }),
    billable: Field.boolean({
      label: 'Billable',
      required: false,
      group: 'core',
      description: 'Is this time billable to a client?',
    }),
  },

  enable: {
    searchable: false,
    apiEnabled: true,
    trash: true,
  },

  indexes: [{ fields: ['project'] }, { fields: ['person'] }, { fields: ['work_date'] }],

  // ADR-0079: `displayNameField` names a REAL local field. The old
  // `titleFormat` opened with `{{record.person.name}}`, a DOT-WALK across the
  // `person` lookup — unreferenceable in a stored field (ADR-0072) — so it is
  // dropped. Degraded to the local `work_date`.
  displayNameField: 'work_date',
  compactLayout: ['person', 'project', 'work_date', 'hours'],
});
