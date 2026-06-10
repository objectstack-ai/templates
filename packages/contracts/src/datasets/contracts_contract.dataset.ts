// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for contracts_contract. */
export const ContractsContractDataset = defineDataset({
  name: 'contracts_contract_metrics',
  label: 'contracts_contract metrics',
  object: 'contracts_contract',
  dimensions: [
    { name: 'signed_date', label: 'signed_date', field: 'signed_date', type: 'date' },
  ],
  measures: [
    { name: 'contract_count', label: 'contract_count', aggregate: 'count' },
    { name: 'sum_total_value', label: 'sum_total_value', aggregate: 'sum', field: 'total_value' },
  ],
});
