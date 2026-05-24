// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Contract Owner — can manage their own contracts and obligations, read
 * everyone else's. Default profile for most users.
 */
export const ContractOwnerProfile = {
  name: 'contract_owner',
  label: 'Contract Owner',
  isProfile: true,
  objects: {
    contracts_contract: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    contracts_party: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    contracts_obligation: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
  },
};
