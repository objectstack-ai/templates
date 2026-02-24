import { ObjectSchema, Field } from '@objectstack/spec/data';

export const TodoList = ObjectSchema.create({
  name: 'todo_list',
  label: 'Todo List',
  pluralLabel: 'Todo Lists',
  icon: 'list',
  description: 'A named collection of todo items',

  fields: {
    title: Field.text({
      label: 'Title',
      required: true,
      maxLength: 100,
    }),
    description: Field.textarea({
      label: 'Description',
    }),
    color: Field.select({
      label: 'Color',
      defaultValue: 'blue',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Purple', value: 'purple' },
      ],
    }),
    is_archived: Field.boolean({
      label: 'Archived',
      defaultValue: false,
    }),
    owner_id: Field.lookup('users', {
      label: 'Owner',
      required: true,
      defaultValue: '$currentUser',
    }),
  },

  enable: {
    searchable: true,
    trackHistory: false,
    activities: false,
    feeds: false,
  },
});
