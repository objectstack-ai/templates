// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { F, P, tmpl } from '@objectstack/spec';

/**
 * Employee — the people record. Self-referential `manager` builds the
 * reporting chain. `department` points to `hr_department`.
 *
 * Sensitive fields (salary, contract_type, national_id_last4) live in the
 * `sensitive` group; field-level visibility is governed by the
 * `hr_employee` vs `hr_admin` profiles. We do NOT store full national IDs —
 * the placeholder is `national_id_last4` only.
 */
export const Employee = ObjectSchema.create({
  name: 'hr_employee',
  label: 'Employee',
  pluralLabel: 'Employees',
  icon: 'user',
  description: 'A person on the company directory.',

  fieldGroups: [
    { key: 'identity', label: 'Identity', icon: 'user' },
    { key: 'role', label: 'Role', icon: 'briefcase' },
    { key: 'employment', label: 'Employment', icon: 'calendar' },
    { key: 'sensitive', label: 'Sensitive', icon: 'lock', defaultExpanded: false },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    full_name: Field.text({
      label: 'Full Name',
      required: true,
      searchable: true,
      maxLength: 120,
      group: 'identity',
    }),
    preferred_name: Field.text({
      label: 'Preferred Name',
      maxLength: 60,
      group: 'identity',
    }),
    work_email: Field.text({
      label: 'Work Email',
      required: true,
      unique: true,
      searchable: true,
      maxLength: 200,
      group: 'identity',
    }),
    phone: Field.text({ label: 'Phone', maxLength: 40, group: 'identity' }),
    user: Field.lookup('user', {
      label: 'Login User',
      description: 'Linked platform account for self-service.',
      group: 'identity',
    }),

    job_title: Field.text({
      label: 'Job Title',
      required: true,
      searchable: true,
      maxLength: 120,
      group: 'role',
    }),
    department: Field.lookup('hr_department', {
      label: 'Department',
      group: 'role',
    }),
    manager: Field.lookup('hr_employee', {
      label: 'Manager',
      description: 'Self-referential reporting line.',
      group: 'role',
    }),
    location: Field.text({
      label: 'Work Location',
      maxLength: 80,
      group: 'role',
      description: 'Office, city, or "Remote".',
    }),

    status: Field.select({
      label: 'Status',
      required: true,
      group: 'employment',
      options: [
        { label: 'Active', value: 'active', color: '#10B981', default: true },
        { label: 'On Leave', value: 'on_leave', color: '#F59E0B' },
        { label: 'Terminated', value: 'terminated', color: '#6B7280' },
      ],
    }),
    employment_type: Field.select({
      label: 'Employment Type',
      group: 'employment',
      options: [
        { label: 'Full-time', value: 'full_time', default: true },
        { label: 'Part-time', value: 'part_time' },
        { label: 'Contractor', value: 'contractor' },
        { label: 'Intern', value: 'intern' },
      ],
    }),
    hire_date: Field.date({ label: 'Hire Date', group: 'employment' }),
    end_date: Field.date({
      label: 'End Date',
      group: 'employment',
      description: 'Last working day, if terminated.',
    }),

    // --- Sensitive ---
    salary: Field.currency({
      label: 'Salary',
      group: 'sensitive',
      min: 0,
      description: 'Visible to HR Admins and the employee themselves.',
    }),
    contract_type: Field.text({
      label: 'Contract Type',
      maxLength: 60,
      group: 'sensitive',
    }),
    national_id_last4: Field.text({
      label: 'National ID (last 4)',
      maxLength: 4,
      group: 'sensitive',
      description:
        'Last 4 digits only. The template deliberately does NOT store full national IDs — see CHARTER.',
    }),

    // --- Meta ---
    tenure_years: Field.formula({
      label: 'Tenure (years)',
      group: 'meta',
      expression: F`record.hire_date != null ? floor((today() - record.hire_date) / 365) : null`,
    }),
    notes: Field.markdown({ label: 'Internal Notes', group: 'meta' }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    files: true,
    feeds: true,
    activities: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['work_email'], unique: true },
    { fields: ['department'] },
    { fields: ['manager'] },
    { fields: ['status'] },
  ],

  titleFormat: tmpl`{{record.preferred_name || record.full_name}}`,
  compactLayout: ['full_name', 'job_title', 'department', 'manager', 'status'],

  validations: [
    {
      name: 'terminated_requires_end_date',
      type: 'script',
      severity: 'error',
      message: 'Terminated employees must have an end date.',
      condition: P`record.status == "terminated" && record.end_date == null`,
    },
    {
      name: 'manager_is_not_self',
      type: 'script',
      severity: 'error',
      message: 'An employee cannot be their own manager.',
      condition: P`record.manager != null && record.manager == record.id`,
    },
  ],
});
