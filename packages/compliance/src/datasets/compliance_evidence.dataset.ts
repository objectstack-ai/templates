// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for compliance_evidence. */
export const ComplianceEvidenceDataset = defineDataset({
  name: 'compliance_evidence_metrics',
  label: 'compliance_evidence metrics',
  object: 'compliance_evidence',
  dimensions: [],
  measures: [{ name: 'evidence_count', label: 'evidence_count', aggregate: 'count' }],
});
