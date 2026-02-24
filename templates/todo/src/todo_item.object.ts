import { ObjectSchema, Field } from '@objectstack/spec/data';

export const TodoItem = ObjectSchema.create({
  name: 'todo_item',
  label: 'Todo Item',
  pluralLabel: 'Todo Items',
  icon: 'check-square',
  description: 'A single task or action item in a todo list',

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
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Done', value: 'done' },
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
    list_id: Field.lookup('todo_list', {
      label: 'List',
      required: true,
    }),
    assigned_to: Field.lookup('users', {
      label: 'Assigned To',
    }),
  },

  enable: {
    searchable: true,
    trackHistory: true,
    activities: false,
    feeds: false,
  },
});
