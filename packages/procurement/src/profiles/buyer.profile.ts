// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Buyer — runs day-to-day procurement. Can create/edit PRs, POs, receipts;
 * can read vendor master but not delete vendors.
 */
export const BuyerProfile = {
  name: 'procurement_buyer',
  label: 'Buyer',
  isProfile: true,
  objects: {
    procurement_vendor:  { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: false, viewAllRecords: true, modifyAllRecords: false },
    procurement_request: { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: false, viewAllRecords: true, modifyAllRecords: false },
    procurement_order:   { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: false, viewAllRecords: true, modifyAllRecords: false },
    procurement_receipt: { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: false, viewAllRecords: true, modifyAllRecords: false },
  },
};
