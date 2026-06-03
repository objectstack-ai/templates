// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Milestone — key delivery points within a project.
 * Tracks planned vs actual dates for AI delay prediction.
 */
export const Milestone = ObjectSchema.create({
  name: 'pm_milestone',
  label: 'Milestone',
  pluralLabel: 'Milestones',
  icon: 'flag',
  description: 'A key delivery point or decision gate in a project timeline.',

  fieldGroups: [
    { key: 'core', label: 'Milestone', icon: 'flag', defaultExpanded: true },
    { key: 'dates', label: 'Timeline', icon: 'calendar' },
  ],

  fields: {
    name: Field.text({
      label: 'Milestone Name',
      required: true,
      maxLength: 200,
      searchable: true,
      group: 'core',
    }),
    description: Field.markdown({
      label: 'Description',
      required: false,
      group: 'core',
    }),
    project: Field.lookup('pm_project', {
      label: 'Project',
      required: true,
      group: 'core',
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Not Started', value: 'not_started', color: '#94A3B8', default: true },
        { label: 'In Progress', value: 'in_progress', color: '#3B82F6' },
        { label: 'Completed', value: 'completed', color: '#10B981' },
        { label: 'Missed', value: 'missed', color: '#EF4444' },
      ],
    }),
    planned_date: Field.date({
      label: 'Planned Date',
      required: true,
      group: 'dates',
    }),
    actual_date: Field.date({
      label: 'Actual Date',
      required: false,
      group: 'dates',
      description: 'Set when milestone is reached.',
    }),
    owner: Field.lookup('sys_user', {
      label: 'Owner',
      required: false,
      group: 'core',
    }),
    deliverables: Field.text({
      label: 'Deliverables',
      required: false,
      maxLength: 1000,
      group: 'core',
      description: 'What must be delivered at this milestone.',
    }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    files: true,
    feeds: true,
    trash: true,
  },

  indexes: [{ fields: ['project'] }, { fields: ['status'] }, { fields: ['planned_date'] }],

  titleFormat: tmpl`{{record.name}}`,
  displayNameField: 'name',
  compactLayout: ['name', 'project', 'status', 'planned_date', 'actual_date'],
});
