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
      id: 'group_work',
      type: 'group',
      label: 'Work',
      icon: 'briefcase',
      expanded: true,
      children: [
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
      ],
    },
    {
      id: 'group_admin',
      type: 'group',
      label: 'Admin',
      icon: 'settings',
      children: [
        { id: 'nav_label', type: 'object', objectName: 'todo_label', label: 'Labels', icon: 'tag' },
      ],
    },
    {
      id: 'group_reports',
      type: 'group',
      label: 'Reports',
      icon: 'chart-bar',
      children: [
        {
          id: 'nav_overdue',
          type: 'report',
          reportName: 'todo_overdue_tasks_by_assignee',
          label: 'Overdue by Assignee',
          icon: 'alert-triangle',
        },
        {
          id: 'nav_throughput',
          type: 'report',
          reportName: 'todo_task_throughput_by_week',
          label: 'Throughput',
          icon: 'trending-up',
        },
      ],
    },
    {
      id: 'group_approvals',
      type: 'group',
      label: 'Approvals',
      icon: 'check-circle',
      children: [
        {
          id: 'nav_approval_requests',
          type: 'object',
          objectName: 'sys_approval_request',
          label: 'My Approvals',
          icon: 'inbox',
          requiresObject: 'sys_approval_request',
        },
        {
          id: 'nav_approval_processes',
          type: 'object',
          objectName: 'sys_approval_process',
          label: 'Processes',
          icon: 'workflow',
          requiresObject: 'sys_approval_process',
        },
      ],
    },
  ],
});
