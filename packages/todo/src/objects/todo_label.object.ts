// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Label — free-form tag attached to tasks via the multi-value `labels`
 * lookup on `todo_task`. Kept deliberately tiny: name + color.
 */
export const Label = ObjectSchema.create({
  name: 'todo_label',
  label: 'Label',
  pluralLabel: 'Labels',
  icon: 'tag',
  description: 'Free-form tag for grouping tasks.',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 40,
    }),
    color: Field.color({
      label: 'Color',
      colorFormat: 'hex',
      defaultValue: '#3B82F6',
    }),
    description: Field.text({ label: 'Description', maxLength: 200 }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
  },

  indexes: [{ fields: ['name'], unique: true }],
});
