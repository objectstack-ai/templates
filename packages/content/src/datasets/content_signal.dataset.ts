// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for content_signal. */
export const ContentSignalDataset = defineDataset({
  name: 'content_signal_metrics',
  label: 'content_signal metrics',
  object: 'content_signal',
  dimensions: [],
  measures: [{ name: 'signal_count', label: 'signal_count', aggregate: 'count' }],
});
