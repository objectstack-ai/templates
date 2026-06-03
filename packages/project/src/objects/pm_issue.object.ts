// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Issue — problems that have occurred and need resolution.
 * Differs from risks: issues are current problems, risks are future threats.
 */
export const Issue = ObjectSchema.create({
  name: 'pm_issue',
  label: 'Issue',
  pluralLabel: 'Issues',
  icon: 'octagon-x',
  description: 'A current problem that requires resolution.',

  fieldGroups: [
    { key: 'core', label: 'Issue Details', icon: 'octagon-x', defaultExpanded: true },
  ],

  fields: {
    name: Field.text({
      label: 'Issue Title',
      required: true,
      maxLength: 200,
      searchable: true,
      group: 'core',
    }),
    description: Field.markdown({
      label: 'Description',
      required: true,
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
        { label: 'Open', value: 'open', color: '#F59E0B', default: true },
        { label: 'In Progress', value: 'in_progress', color: '#3B82F6' },
        { label: 'Blocked', value: 'blocked', color: '#EF4444' },
        { label: 'Resolved', value: 'resolved', color: '#10B981' },
        { label: 'Closed', value: 'closed', color: '#6B7280' },
      ],
    }),
    severity: Field.select({
      label: 'Severity',
      required: true,
      group: 'core',
      options: [
        { label: 'Low', value: 'low', color: '#94A3B8' },
        { label: 'Medium', value: 'medium', color: '#3B82F6' },
        { label: 'High', value: 'high', color: '#F59E0B' },
        { label: 'Critical', value: 'critical', color: '#EF4444' },
      ],
    }),
    assigned_to: Field.lookup('sys_user', {
      label: 'Assigned To',
      required: false,
      group: 'core',
    }),
    related_risk: Field.lookup('pm_risk', {
      label: 'Related Risk',
      required: false,
      group: 'core',
      description: 'Link if this issue came from a realized risk.',
    }),
    resolution: Field.markdown({
      label: 'Resolution',
      required: false,
      group: 'core',
      description: 'How the issue was resolved.',
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

  indexes: [
    { fields: ['project'] },
    { fields: ['status'] },
    { fields: ['severity'] },
  ],

  titleFormat: tmpl`{{record.name}}`,
  displayNameField: 'name',
  compactLayout: ['name', 'project', 'status', 'severity', 'assigned_to'],
});
