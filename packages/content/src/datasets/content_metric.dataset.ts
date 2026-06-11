// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for content_metric. */
export const ContentMetricDataset = defineDataset({
  name: 'content_metric_metrics',
  label: 'content_metric metrics',
  object: 'content_metric',
  dimensions: [
    {
      name: 'period_start',
      label: 'period_start',
      field: 'period_start',
      type: 'date',
      dateGranularity: 'week',
    },
  ],
  measures: [{ name: 'sum_signups', label: 'sum_signups', aggregate: 'sum', field: 'signups' }],
});
