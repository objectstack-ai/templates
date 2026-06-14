// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for pm_risk register analytics. */
export const RiskDataset = defineDataset({
  name: 'pm_risk_metrics',
  label: 'pm_risk metrics',
  object: 'pm_risk',
  dimensions: [
    { name: 'category', label: 'category', field: 'category', type: 'string' },
    { name: 'status', label: 'status', field: 'status', type: 'string' },
  ],
  measures: [{ name: 'risk_count', label: 'risk_count', aggregate: 'count' }],
});
