import { TodoList } from './todo_list.object.js';
import { TodoItem } from './todo_item.object.js';

export const TodoPlugin = {
  name: 'todo',
  label: 'Todo',
  version: '1.0.0',
  description: 'Task management — todo lists and items with priorities and due dates',

  dependencies: [],

  init: async () => {},

  actions: {},
  triggers: {},
  workflows: {},

  objects: {
    todo_list: TodoList,
    todo_item: TodoItem,
  },

  apps: [
    {
      name: 'todo',
      label: 'Todo',
      navigation: [
        {
          id: 'tasks',
          type: 'group',
          label: 'Tasks',
          children: [
            { id: 'todo_list', label: 'My Lists', type: 'object', objectName: 'todo_list' },
            { id: 'todo_item', label: 'All Tasks', type: 'object', objectName: 'todo_item' },
          ],
        },
      ],
    },
  ],
};

export default TodoPlugin;
