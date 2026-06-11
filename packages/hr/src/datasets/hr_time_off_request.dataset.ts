// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for hr_time_off_request. */
export const HrTimeOffRequestDataset = defineDataset({
  name: 'hr_time_off_request_metrics',
  label: 'hr_time_off_request metrics',
  object: 'hr_time_off_request',
  dimensions: [],
  measures: [{ name: 'request_count', label: 'request_count', aggregate: 'count' }],
});
