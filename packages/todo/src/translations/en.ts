// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * English (en) — Todo App Translations
 *
 * Per-locale file. Covers:
 *  - Object labels / fields / option enums / view labels
 *  - App label, description, and navigation group labels
 *  - Common UI messages and validation messages
 *  - Dashboard labels, widgets, and actions
 */
export const en: TranslationData = {
  objects: {
    todo_task: {
      label: 'Task',
      pluralLabel: 'Tasks',
      description: 'A unit of work assigned to a person.',
      fields: {
        subject: { label: 'Subject' },
        description: { label: 'Description' },
        status: {
          label: 'Status',
          options: { todo: 'To Do', doing: 'Doing', done: 'Done', cancelled: 'Cancelled' },
        },
        priority: {
          label: 'Priority',
          options: { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' },
        },
        assignee: { label: 'Assignee' },
        labels: { label: 'Labels' },
        due_date: { label: 'Due Date' },
        started_at: { label: 'Started At' },
        completed_at: { label: 'Completed At' },
        estimate_hours: { label: 'Estimate (h)' },
        approval_status: {
          label: 'Approval',
          options: {
            not_required: 'Not Required',
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
          },
        },
        is_overdue: { label: 'Overdue?' },
      },
      _views: {
        all_tasks: { label: 'All Tasks', description: 'Every task, grouped by status' },
        task_board: { label: 'Task Board', description: 'Kanban board grouped by status' },
        my_open_tasks: { label: 'My Open Tasks', description: 'Open tasks assigned to you' },
        overdue_tasks: { label: 'Overdue Tasks', description: 'Open tasks past their due date' },
      },
    },

    todo_label: {
      label: 'Label',
      pluralLabel: 'Labels',
      description: 'Color-coded tag used to categorise tasks.',
      fields: {
        name: { label: 'Name' },
        color: { label: 'Color' },
        description: { label: 'Description' },
      },
    },
  },

  apps: {
    todo: {
      label: 'Todo',
      description: 'Lightweight task tracker with approvals and dashboards.',
      navigation: {
        group_work: { label: 'Work' },
        group_admin: { label: 'Admin' },
        group_reports: { label: 'Reports' },
        group_approvals: { label: 'Approvals' },
        nav_dashboard: { label: 'My Work' },
        nav_task: { label: 'Tasks' },
        nav_label: { label: 'Labels' },
        nav_overdue: { label: 'Overdue by Assignee' },
        nav_throughput: { label: 'Throughput' },
        nav_approval_requests: { label: 'My Approvals' },
        nav_approval_processes: { label: 'Processes' },
      },
    },
  },

  messages: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.back': 'Back',
    'common.confirm': 'Confirm',
    'nav.work': 'Work',
    'nav.admin': 'Admin',
    'nav.reports': 'Reports',
    'nav.approvals': 'Approvals',
    'success.saved': 'Task saved successfully',
    'success.assigned': 'Task assigned successfully',
    'confirm.delete': 'Are you sure you want to delete this record?',
    'confirm.mark_done': 'Mark {count} task(s) as done?',
    'confirm.reassign': 'Reassign {count} task(s)?',
    'error.required': 'This field is required',
    'error.load_failed': 'Failed to load data',
  },

  validationMessages: {
    due_date_required_for_urgent: 'Urgent tasks must have a due date',
    estimate_non_negative: 'Estimated hours cannot be negative',
  },

  dashboards: {
    my_work_dashboard: {
      label: 'My Work',
      description: 'Personal landing page: open work, overdue items, and weekly throughput.',
      actions: {
        create_task: { label: 'New Task' },
      },
      widgets: {
        my_open_tasks: { title: 'My Open Tasks', description: 'Tasks assigned to you that are still to do or in progress' },
        my_overdue: { title: 'Overdue', description: 'Your open tasks past their due date' },
        done_this_week: { title: 'Done This Week', description: 'Tasks you completed since the start of the week' },
        recent_overdue_list: { title: 'Overdue Tasks', description: 'Your open tasks past their due date, sorted by oldest first' },
      },
    },
  },
};
