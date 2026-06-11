// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for expense_line. */
export const ExpenseLineDataset = defineDataset({
  name: 'expense_line_metrics',
  label: 'expense_line metrics',
  object: 'expense_line',
  dimensions: [{ name: 'category', label: 'category', field: 'category', type: 'string' }],
  measures: [{ name: 'sum_amount', label: 'sum_amount', aggregate: 'sum', field: 'amount' }],
});
