// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Procurement Admin — full control. Approves high-value PRs, manages
 * vendor master, can hard-delete (rarely).
 */
export const ProcurementAdminProfile = {
  name: 'procurement_admin',
  label: 'Procurement Admin',
  isProfile: true,
  objects: {
    procurement_vendor: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    procurement_request: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    procurement_order: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    procurement_receipt: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
  },
};
