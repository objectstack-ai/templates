// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for hr_document. */
export const HrDocumentDataset = defineDataset({
  name: 'hr_document_metrics',
  label: 'hr_document metrics',
  object: 'hr_document',
  dimensions: [],
  measures: [{ name: 'document_count', label: 'Documents', aggregate: 'count' }],
});
