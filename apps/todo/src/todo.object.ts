import { ObjectSchema, Field } from '@objectstack/spec/data';

export const Todo = ObjectSchema.create({
  name: 'todo',
  label: 'Todo',
  pluralLabel: 'Todos',
  icon: 'check-square',
  description: 'A simple task or to-do item',

  fields: {
    title: Field.text({
      label: 'Title',
      required: true,
      maxLength: 255,
    }),
    description: Field.textarea({
      label: 'Description',
    }),
    status: Field.select({
      label: 'Status',
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Done', value: 'done' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    }),
    priority: Field.select({
      label: 'Priority',
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    }),
    due_date: Field.date({
      label: 'Due Date',
    }),
    completed_at: Field.datetime({
      label: 'Completed At',
      readonly: true,
    }),
    owner_id: Field.lookup('users', {
      label: 'Assignee',
      required: true,
      defaultValue: '$currentUser',
    }),
    tags: Field.text({
      label: 'Tags',
      maxLength: 500,
    }),
  },

  enable: {
    searchable: true,
    trackHistory: true,
    activities: true,
  },
});
