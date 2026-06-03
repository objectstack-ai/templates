// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { requestHook } from '../objects/procurement_request.hook';
import { orderHook } from '../objects/procurement_order.hook';

// NOTE: `procurement_order.received_amount` is a STORED header field, not a
// hook-maintained rollup. A receipt → PO rollup would require a nested engine
// write from a hook, which is unsupported in the standalone runtime (the
// QuickJS hook sandbox crashes on nested writes; `ctx.services.data` is
// undefined inside it). See packages/expense/CHARTER.md. Maintain the total at
// the top level (client/seed) or, in a fork, via a native summary field /
// external worker.
export const allHooks = [requestHook, orderHook];
