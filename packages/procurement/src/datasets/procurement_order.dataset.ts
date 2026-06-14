// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for procurement_order. */
export const ProcurementOrderDataset = defineDataset({
  name: 'procurement_order_metrics',
  label: 'procurement_order metrics',
  object: 'procurement_order',
  dimensions: [
    {
      name: 'order_date',
      label: 'order_date',
      field: 'order_date',
      type: 'date',
      dateGranularity: 'month',
    },
    { name: 'vendor', label: 'vendor', field: 'vendor', type: 'string' },
    { name: 'status', label: 'status', field: 'status', type: 'string' },
  ],
  measures: [
    { name: 'order_count', label: 'order_count', aggregate: 'count' },
    {
      name: 'sum_total_amount',
      label: 'sum_total_amount',
      aggregate: 'sum',
      field: 'total_amount',
    },
  ],
});
