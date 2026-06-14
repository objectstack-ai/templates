// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * English (en) — HR App Translations
 */
export const en: TranslationData = {
  objects: {
    hr_department: {
      label: 'Department',
      pluralLabel: 'Departments',
      description: 'An org-chart node. Departments may nest via parent.',
      fields: {
        name: { label: 'Name' },
        code: { label: 'Code' },
        parent: { label: 'Parent Department' },
        head: { label: 'Department Head' },
        description: { label: 'Description' },
      },
    },

    hr_employee: {
      label: 'Employee',
      pluralLabel: 'Employees',
      description: 'A person on the company directory.',
      fields: {
        full_name: { label: 'Full Name' },
        preferred_name: { label: 'Preferred Name' },
        work_email: { label: 'Work Email' },
        phone: { label: 'Phone' },
        user: { label: 'Login User' },
        job_title: { label: 'Job Title' },
        department: { label: 'Department' },
        manager: { label: 'Manager' },
        location: { label: 'Work Location' },
        status: {
          label: 'Status',
          options: { active: 'Active', on_leave: 'On Leave', terminated: 'Terminated' },
        },
        employment_type: {
          label: 'Employment Type',
          options: {
            full_time: 'Full-time',
            part_time: 'Part-time',
            contractor: 'Contractor',
            intern: 'Intern',
          },
        },
        hire_date: { label: 'Hire Date' },
        end_date: { label: 'End Date' },
        salary: { label: 'Salary' },
        contract_type: { label: 'Contract Type' },
        national_id_last4: { label: 'National ID (last 4)' },
        tenure_years: { label: 'Tenure (years)' },
        notes: { label: 'Internal Notes' },
      },
      _views: {
        all_employees: {
          label: 'All Employees',
          description: 'Every employee grouped by department',
        },
        active_employees: { label: 'Active', description: 'Currently active staff' },
        employees_on_leave: { label: 'On Leave', description: 'Staff currently on leave' },
      },
    },

    hr_time_off_request: {
      label: 'Time-Off Request',
      pluralLabel: 'Time-Off Requests',
      description: 'A request for paid or unpaid leave, routed to the employee’s manager.',
      fields: {
        employee: { label: 'Employee' },
        leave_type: {
          label: 'Leave Type',
          options: {
            vacation: 'Vacation',
            sick: 'Sick',
            personal: 'Personal',
            parental: 'Parental',
            bereavement: 'Bereavement',
            unpaid: 'Unpaid',
          },
        },
        start_date: { label: 'Start Date' },
        end_date: { label: 'End Date' },
        days: { label: 'Days' },
        reason: { label: 'Reason' },
        status: {
          label: 'Status',
          options: {
            draft: 'Draft',
            submitted: 'Submitted',
            approved: 'Approved',
            rejected: 'Rejected',
            cancelled: 'Cancelled',
          },
        },
        approver: { label: 'Approver' },
        decided_at: { label: 'Decided At' },
        decision_note: { label: 'Decision Note' },
        submitted_at: { label: 'Submitted At' },
      },
      _views: {
        all_time_off: { label: 'All Requests', description: 'Every request grouped by status' },
        time_off_pipeline: { label: 'Approval Pipeline', description: 'Kanban grouped by status' },
        pending_time_off: {
          label: 'Pending Approval',
          description: 'Submitted requests awaiting decision',
        },
        approved_time_off: { label: 'Approved', description: 'Approved requests by start date' },
      },
    },

    hr_document: {
      label: 'Employee Document',
      pluralLabel: 'Employee Documents',
      description: 'A document attached to an employee record (contract, ID, certification).',
      fields: {
        name: { label: 'Name' },
        employee: { label: 'Employee' },
        doc_type: {
          label: 'Type',
          options: {
            contract: 'Employment Contract',
            id: 'ID / Passport Scan',
            certification: 'Certification',
            visa: 'Visa / Work Permit',
            other: 'Other',
          },
        },
        issued_on: { label: 'Issued On' },
        expires_at: { label: 'Expires At' },
        is_expiring_soon: { label: 'Expiring Soon?' },
        is_expired: { label: 'Expired?' },
        expiry_status: { label: 'Expiry Status' },
        notes: { label: 'Notes' },
      },
      _views: {
        all_documents: { label: 'All Documents', description: 'Every document grouped by type' },
        expiring_documents: {
          label: 'Expiring Soon',
          description: 'Documents expiring within 30 days',
        },
        expired_documents: {
          label: 'Expired',
          description: 'Documents already past their expiry date',
        },
      },
    },
  },

  apps: {
    hr: {
      label: 'HR',
      description: 'People directory, time-off, and document expiry on ObjectStack.',
      navigation: {
        nav_dashboard: { label: 'HR Dashboard' },
        nav_employee: { label: 'Employees' },
        nav_department: { label: 'Departments' },
        nav_time_off: { label: 'Time-Off' },
        nav_document: { label: 'Documents' },
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
    'success.saved': 'Saved successfully',
    'success.time_off_submitted': 'Time-off request submitted for approval',
    'error.required': 'This field is required',
  },

  validationMessages: {
    terminated_requires_end_date: 'Terminated employees must have an end date.',
    manager_is_not_self: 'An employee cannot be their own manager.',
    end_after_start: 'End date must be on or after start date.',
    submitted_requires_dates: 'Submitted requests must have both start and end dates.',
  },

  dashboards: {
    hr_admin_dashboard: {
      label: 'HR Dashboard',
      description: 'Pending approvals, recent joiners, and document expiries at a glance.',
      actions: { create_employee: { label: 'New Employee' } },
      widgets: {
        headcount: { title: 'Active Headcount', description: 'Employees in active status' },
        on_leave: { title: 'On Leave', description: 'Employees currently on leave' },
        pending_time_off: {
          title: 'Pending Approvals',
          description: 'Time-off requests awaiting manager decision',
        },
        expiring_docs: {
          title: 'Documents Expiring (30d)',
          description: 'Documents whose expires_at falls in the next 30 days',
        },
        pending_time_off_table: {
          title: 'Pending Time-Off Requests',
          description: 'Submitted requests, oldest first',
        },
        expiring_docs_table: {
          title: 'Documents Expiring Soon',
          description: 'Documents expiring within 30 days',
        },
      },
    },
  },
};
