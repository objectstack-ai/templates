// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for compliance_control. */
export const ComplianceControlDataset = defineDataset({
  name: 'compliance_control_metrics',
  label: 'compliance_control metrics',
  object: 'compliance_control',
  dimensions: [],
  measures: [{ name: 'control_count', label: 'Controls', aggregate: 'count' }],
});
