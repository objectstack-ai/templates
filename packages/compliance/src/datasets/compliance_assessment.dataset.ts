// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for compliance_assessment. */
export const ComplianceAssessmentDataset = defineDataset({
  name: 'compliance_assessment_metrics',
  label: 'compliance_assessment metrics',
  object: 'compliance_assessment',
  dimensions: [
    { name: 'assessed_at', label: 'assessed_at', field: 'assessed_at', type: 'date' },
  ],
  measures: [
    { name: 'assessment_count', label: 'assessment_count', aggregate: 'count' },
  ],
});
