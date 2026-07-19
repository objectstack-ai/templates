// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { F, P } from '@objectstack/spec';
/**
 * Time-Off Request — vacation, sick, personal, unpaid. Goes through a
 * one-step approval (employee's manager). Sharing rule
 * `time_off_requester_and_manager_only` keeps the row private to the
 * requester + their reporting chain.
 */
export const TimeOffRequest = ObjectSchema.create({
  name: 'hr_time_off_request',
  sharingModel: 'private',
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
        { label: 'Parental', value: 'parental', color: '#06B6D4' },
        { label: 'Bereavement', value: 'bereavement', color: '#475569' },
        { label: 'Unpaid', value: 'unpaid', color: '#6B7280' },
      ],
    }),
    start_date: Field.date({ label: 'Start Date', required: true, group: 'core' }),
    end_date: Field.date({ label: 'End Date', required: true, group: 'core' }),
    days: Field.formula({
      label: 'Calendar Days',
      group: 'core',
      description:
        'Inclusive calendar-day span (weekends + holidays counted). Switch to a working-days helper if your policy excludes them.',
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

    // ADR-0079: real field holding the record title (was the render-only
    // `titleFormat` template `{{leave_type}} · {{start_date}} → {{end_date}}`).
    // Date fields are stored as ISO strings; `string(...)` makes the concat
    // overload explicit. A stored formula so the server can return/query it.
    display_name: Field.formula({
      label: 'Display Name',
      group: 'meta',
      expression: F`coalesce(record.leave_type, '') + ' · ' + string(record.start_date) + ' → ' + string(record.end_date)`,
    }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['employee'] }, { fields: ['status'] }, { fields: ['start_date'] }],

  nameField: 'display_name',
  highlightFields: ['employee', 'leave_type', 'start_date', 'end_date', 'status'],

  validations: [
    {
      type: 'state_machine',
      name: 'time_off_lifecycle',
      field: 'status',
      transitions: {
        draft: ['submitted', 'cancelled'],
        submitted: ['approved', 'rejected', 'draft'],
        approved: ['cancelled'],
        rejected: ['draft'],
        cancelled: [],
      },
      message: 'Illegal status transition.',
    },
    {
      name: 'end_after_start',
      type: 'script',
      severity: 'error',
      message: 'End date must be on or after start date.',
      condition: P`record.start_date != null && record.end_date != null && record.end_date < record.start_date`,
    },
  ],

  // `submitted_at` / `decided_at` are stamped by `hr_time_off_request.hook.ts`
  // on status entry. Object-level `workflows` are not a supported 7.x field.
});
