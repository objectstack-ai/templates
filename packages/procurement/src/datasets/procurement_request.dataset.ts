// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for procurement_request. */
export const ProcurementRequestDataset = defineDataset({
  name: 'procurement_request_metrics',
  label: 'procurement_request metrics',
  object: 'procurement_request',
  dimensions: [],
  measures: [{ name: 'request_count', label: 'request_count', aggregate: 'count' }],
});
