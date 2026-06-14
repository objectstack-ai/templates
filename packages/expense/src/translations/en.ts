// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * English (en) — Expense App Translations
 */
export const en: TranslationData = {
  objects: {
    expense_category: {
      label: 'Expense Category',
      pluralLabel: 'Expense Categories',
      description: 'A spend type used to code and report expense lines.',
      fields: {
        name: { label: 'Name' },
        code: { label: 'Code' },
        gl_account: { label: 'GL Account' },
        per_txn_limit: { label: 'Per-Transaction Limit' },
        active: { label: 'Active' },
        description: { label: 'Notes' },
      },
      _views: {
        all_categories: { label: 'All Categories', description: 'Every expense category' },
      },
    },

    expense_report: {
      label: 'Expense Report',
      pluralLabel: 'Expense Reports',
      description: 'An employee reimbursement claim grouping expense lines.',
      fields: {
        title: { label: 'Title' },
        report_number: { label: 'Report Number' },
        requester: { label: 'Employee' },
        purpose: { label: 'Business Purpose' },
        status: {
          label: 'Status',
          options: {
            draft: 'Draft',
            submitted: 'Submitted',
            approved: 'Approved',
            rejected: 'Rejected',
            reimbursed: 'Reimbursed',
          },
        },
        period_start: { label: 'Period Start' },
        period_end: { label: 'Period End' },
        cost_center: { label: 'Cost Center' },
        currency: {
          label: 'Currency',
          options: { usd: 'USD', eur: 'EUR', gbp: 'GBP', cny: 'CNY' },
        },
        total_amount: { label: 'Total Amount' },
        approval_required: { label: 'Approval Required' },
        submitted_at: { label: 'Submitted At' },
        approved_at: { label: 'Approved At' },
        reimbursed_at: { label: 'Reimbursed At' },
        payment_method: {
          label: 'Payment Method',
          options: {
            bank_transfer: 'Bank Transfer',
            payroll: 'Payroll',
            cash: 'Cash',
            check: 'Check',
          },
        },
        payment_reference: { label: 'Payment Reference' },
        notes: { label: 'Internal Notes' },
      },
      _views: {
        all_reports: { label: 'All Reports', description: 'Every report, grouped by status' },
        report_pipeline: { label: 'Report Pipeline', description: 'Kanban grouped by status' },
        my_reports: { label: 'My Reports', description: 'Reports where you are the employee' },
        awaiting_approval: {
          label: 'Awaiting Approval',
          description: 'Submitted reports pending a decision',
        },
        awaiting_reimbursement: {
          label: 'To Reimburse',
          description: 'Approved reports awaiting payment',
        },
      },
    },

    expense_line: {
      label: 'Expense Line',
      pluralLabel: 'Expense Lines',
      description: 'A single itemized expense on a report.',
      fields: {
        expense_report: { label: 'Expense Report' },
        expense_date: { label: 'Date' },
        category: { label: 'Category' },
        description: { label: 'Description' },
        merchant: { label: 'Merchant' },
        amount: { label: 'Amount' },
        payment_source: {
          label: 'Paid With',
          options: {
            personal_card: 'Personal Card',
            cash: 'Cash',
            personal_other: 'Personal — Other',
          },
        },
        reimbursable: { label: 'Reimbursable' },
        needs_receipt: { label: 'Receipt Required' },
        receipt_attached: { label: 'Receipt Attached' },
        notes: { label: 'Notes' },
      },
      _views: {
        all_lines: { label: 'All Lines', description: 'Every expense line, grouped by category' },
      },
    },
  },

  apps: {
    expense: {
      label: 'Expense',
      description: 'Employee expense & reimbursement on ObjectStack.',
      navigation: {
        nav_dashboard: { label: 'Overview' },
        nav_report: { label: 'Reports' },
        nav_line: { label: 'Lines' },
        nav_category: { label: 'Categories' },
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
    'success.submitted': 'Report submitted for approval',
    'success.reimbursed': 'Report marked reimbursed',
    'error.required': 'This field is required',
  },

  validationMessages: {
    submitted_requires_amount: 'Submitted reports must have at least one expense line (total > 0).',
    submitted_requires_purpose: 'Submitted reports must include a business purpose.',
    reimbursed_requires_method: 'Reimbursed reports must record a payment method.',
    receipt_required_over_threshold: 'Expenses of 75 or more require an attached receipt.',
  },

  dashboards: {
    expenses_overview_dashboard: {
      label: 'Expenses Overview',
      description: 'Reports awaiting approval, amounts owed, and spend trend.',
      actions: { create_report: { label: 'New Report' } },
      widgets: {
        awaiting_approval: {
          title: 'Awaiting Approval',
          description: 'Submitted reports pending a decision',
        },
        awaiting_reimbursement: {
          title: 'To Reimburse',
          description: 'Approved reports awaiting payment',
        },
        owed_amount: {
          title: 'Owed to Employees ($)',
          description: 'Total of approved, unpaid reports',
        },
        reimbursed_total: { title: 'Reimbursed ($)', description: 'Total reimbursed to date' },
        pending_reports_table: {
          title: 'Reports Awaiting Approval',
          description: 'Submitted reports sorted by amount',
        },
        to_reimburse_table: {
          title: 'Approved — To Reimburse',
          description: 'Approved reports awaiting payment',
        },
        spend_by_category: {
          title: 'Spend by Category',
          description: 'Line amounts grouped by category',
        },
        spend_by_month: {
          title: 'Reimbursed by Month',
          description: 'Reimbursed totals over the last 12 months',
        },
      },
    },
  },
};
