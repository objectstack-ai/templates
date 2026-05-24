// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { App } from '@objectstack/spec/ui';

export const TodoApp = App.create({
  name: 'todo',
  label: 'Todo',
  icon: 'check-square',
  branding: {
    primaryColor: '#3B82F6',
  },

  navigation: [
    {
      id: 'nav_dashboard',
      type: 'dashboard',
      dashboardName: 'my_work_dashboard',
      label: 'My Work',
      icon: 'gauge',
    },
    {
      id: 'nav_task',
      type: 'object',
      objectName: 'todo_task',
      label: 'Tasks',
      icon: 'check-square',
    },
    {
      id: 'nav_label',
      type: 'object',
      objectName: 'todo_label',
      label: 'Labels',
      icon: 'tag',
    },
  ],
});
