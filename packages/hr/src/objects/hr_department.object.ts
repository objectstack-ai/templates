// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Department — a node in the org tree. Self-referential `parent_id` builds
 * the hierarchy. `head` is the responsible manager (an employee).
 */
export const Department = ObjectSchema.create({
  name: 'hr_department',
  sharingModel: 'public_read',
  label: 'Department',
  pluralLabel: 'Departments',
  icon: 'building',
  description: 'An org-chart node. Departments may nest via parent_id.',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 80,
    }),
    code: Field.text({
      label: 'Code',
      unique: true,
      maxLength: 20,
      description: 'Short identifier, e.g. ENG, MKT, OPS.',
    }),
    parent: Field.lookup('hr_department', {
      label: 'Parent Department',
      description: 'Builds the org tree. Leave empty for top-level units.',
    }),
    head: Field.lookup('hr_employee', {
      label: 'Department Head',
      description: 'Responsible manager. Soft pointer; no cascading rules.',
    }),
    description: Field.markdown({ label: 'Description' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['name'], unique: true }, { fields: ['parent'] }],

  nameField: 'name',
  highlightFields: ['name', 'code', 'parent', 'head'],
});
