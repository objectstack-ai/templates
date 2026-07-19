// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { requestHook } from '../objects/procurement_request.hook';
import { orderHook } from '../objects/procurement_order.hook';

// NOTE: `procurement_order.received_amount` is a live `summary` roll-up (sum of
// `procurement_receipt.received_value` over the `purchase_order` lookup), which
// the engine recomputes on every receipt insert/update/delete — no hook needed.
// Rejected receipts carry `received_value` 0, so a plain sum equals the accepted
// total. (Before framework#1867 was fixed, a receipt→PO rollup hook crashed the
// sandbox, so the total was hand-maintained; that workaround is gone.)
export const allHooks = [requestHook, orderHook];
