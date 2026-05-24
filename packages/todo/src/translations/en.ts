// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/** English (en) — the only locale shipped with this template. Fork to add more. */
export const en: TranslationData = {
  objects: {
    project: {
      label: 'Project',
      pluralLabel: 'Projects',
      fields: {
        name: { label: 'Project Name' },
        key: { label: 'Key', help: 'Short identifier (e.g. WEB)' },
        description: { label: 'Description' },
        status: {
          label: 'Status',
          options: { active: 'Active', on_hold: 'On Hold', archived: 'Archived' },
        },
        owner: { label: 'Owner' },
        start_date: { label: 'Start Date' },
        target_date: { label: 'Target Date' },
        color: { label: 'Accent Color' },
        open_task_count: { label: 'Open Tasks' },
        done_task_count: { label: 'Done Tasks' },
      },
    },
    task: {
      label: 'Task',
      pluralLabel: 'Tasks',
      fields: {
        subject: { label: 'Subject' },
        description: { label: 'Description' },
        project: { label: 'Project' },
        status: {
          label: 'Status',
          options: { todo: 'To Do', doing: 'Doing', done: 'Done', cancelled: 'Cancelled' },
        },
        priority: {
          label: 'Priority',
          options: { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' },
        },
        assignee: { label: 'Assignee' },
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
    },
    label: {
      label: 'Label',
      pluralLabel: 'Labels',
      fields: {
        name: { label: 'Name' },
        color: { label: 'Color' },
        description: { label: 'Description' },
      },
    },
    task_label: {
      label: 'Task Label',
      pluralLabel: 'Task Labels',
      fields: {
        task: { label: 'Task' },
        label: { label: 'Label' },
      },
    },
  },
};
