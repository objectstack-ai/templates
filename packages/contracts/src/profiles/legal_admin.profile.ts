// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Legal Admin — full control. Approves high-value contracts, can terminate,
 * can hard-delete (rarely).
 */
export const LegalAdminProfile = {
  name: 'legal_admin',
  label: 'Legal Admin',
  isProfile: true,
  objects: {
    contracts_contract: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    contracts_party: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    contracts_obligation: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
  },
};
