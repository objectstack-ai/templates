// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for expense_report. */
export const ExpenseReportDataset = defineDataset({
  name: 'expense_report_metrics',
  label: 'expense_report metrics',
  object: 'expense_report',
  dimensions: [
    { name: 'reimbursed_at', label: 'reimbursed_at', field: 'reimbursed_at', type: 'date', dateGranularity: 'month' },
  ],
  measures: [
    { name: 'report_count', label: 'report_count', aggregate: 'count' },
    { name: 'sum_total_amount', label: 'sum_total_amount', aggregate: 'sum', field: 'total_amount' },
  ],
});
