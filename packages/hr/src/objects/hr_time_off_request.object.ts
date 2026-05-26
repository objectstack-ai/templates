// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { F, P, tmpl } from '@objectstack/spec';
import { TimeOffRequestStateMachine } from './hr_time_off_request.state';

/**
 * Time-Off Request — vacation, sick, personal, unpaid. Goes through a
 * one-step approval (employee's manager). Sharing rule
 * `time_off_requester_and_manager_only` keeps the row private to the
 * requester + their reporting chain.
 */
export const TimeOffRequest = ObjectSchema.create({
  name: 'hr_time_off_request',
  label: 'Time-Off Request',
  pluralLabel: 'Time-Off Requests',
  icon: 'calendar-off',
  description: 'A request for paid or unpaid leave, routed to the employee’s manager.',

  fieldGroups: [
    { key: 'core', label: 'Request', icon: 'calendar' },
    { key: 'decision', label: 'Decision', icon: 'check-circle' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    employee: Field.lookup('hr_employee', {
      label: 'Employee',
      required: true,
      group: 'core',
      description: 'Who is requesting the time off. Usually the current user.',
    }),
    leave_type: Field.select({
      label: 'Leave Type',
      required: true,
      group: 'core',
      options: [
        { label: 'Vacation', value: 'vacation', color: '#3B82F6', default: true },
        { label: 'Sick', value: 'sick', color: '#EF4444' },
        { label: 'Personal', value: 'personal', color: '#8B5CF6' },
        { label: 'Unpaid', value: 'unpaid', color: '#6B7280' },
      ],
    }),
    start_date: Field.date({ label: 'Start Date', required: true, group: 'core' }),
    end_date: Field.date({ label: 'End Date', required: true, group: 'core' }),
    days: Field.formula({
      label: 'Calendar Days',
      group: 'core',
      description: 'Inclusive calendar-day span (weekends + holidays counted). Switch to a working-days helper if your policy excludes them.',
      expression: F`record.start_date != null && record.end_date != null ? (record.end_date - record.start_date) + 1 : null`,
    }),
    reason: Field.markdown({
      label: 'Reason',
      group: 'core',
      description: 'Optional context for the manager.',
    }),

    status: Field.select({
      label: 'Status',
      required: true,
      group: 'decision',
      options: [
        { label: 'Draft', value: 'draft', color: '#94A3B8', default: true },
        { label: 'Submitted', value: 'submitted', color: '#F59E0B' },
        { label: 'Approved', value: 'approved', color: '#10B981' },
        { label: 'Rejected', value: 'rejected', color: '#EF4444' },
        { label: 'Cancelled', value: 'cancelled', color: '#6B7280' },
      ],
    }),
    approver: Field.lookup('hr_employee', {
      label: 'Approver',
      group: 'decision',
      description: 'Manager who reviewed the request.',
    }),
    decided_at: Field.datetime({
      label: 'Decided At',
      readonly: true,
      group: 'decision',
    }),
    decision_note: Field.text({
      label: 'Decision Note',
      maxLength: 400,
      group: 'decision',
    }),

    submitted_at: Field.datetime({ label: 'Submitted At', readonly: true, group: 'meta' }),
  },

  stateMachines: { lifecycle: TimeOffRequestStateMachine },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    feeds: true,
    activities: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['employee'] },
    { fields: ['status'] },
    { fields: ['start_date'] },
  ],

  titleFormat: tmpl`{{record.leave_type}} · {{record.start_date}} → {{record.end_date}}`,
  compactLayout: ['employee', 'leave_type', 'start_date', 'end_date', 'status'],

  validations: [
    {
      name: 'end_after_start',
      type: 'script',
      severity: 'error',
      message: 'End date must be on or after start date.',
      condition: P`record.start_date != null && record.end_date != null && record.end_date < record.start_date`,
    },
  ],

  workflows: [
    {
      name: 'stamp_submitted_at',
      objectName: 'hr_time_off_request',
      triggerType: 'on_update',
      criteria: P`record.status == "submitted" && previous.status != "submitted"`,
      active: true,
      actions: [
        { name: 'set_submitted_at', type: 'field_update', field: 'submitted_at', value: 'now()' },
      ],
    },
    {
      name: 'stamp_decided_at',
      objectName: 'hr_time_off_request',
      triggerType: 'on_update',
      criteria: P`(record.status == "approved" || record.status == "rejected") && previous.status == "submitted"`,
      active: true,
      actions: [
        { name: 'set_decided_at', type: 'field_update', field: 'decided_at', value: 'now()' },
      ],
    },
  ],
});
