// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for contracts_obligation. */
export const ContractsObligationDataset = defineDataset({
  name: 'contracts_obligation_metrics',
  label: 'contracts_obligation metrics',
  object: 'contracts_obligation',
  dimensions: [],
  measures: [{ name: 'obligation_count', label: 'Obligations', aggregate: 'count' }],
});
