// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * Purchase-Order lifecycle:
 *   draft     → sent       (SEND — issued to vendor)
 *   sent      → partial    (PARTIAL_RECEIPT — some goods received)
 *   sent      → received   (FULLY_RECEIVED — everything in)
 *   sent      → cancelled  (CANCEL — pulled before fulfilment)
 *   partial   → received   (FULLY_RECEIVED)
 *   partial   → closed     (CLOSE_SHORT — close with shortage)
 *   received  → closed     (CLOSE)
 *
 * "partial" is set automatically by the receipt rollup hook when a
 * receipt covers some but not all of the PO value.
 */
export const PurchaseOrderStateMachine: StateMachineConfig = {
  id: 'po_lifecycle',
  initial: 'draft',
  states: {
    draft:    { on: { SEND:   { target: 'sent', description: 'Issue to vendor' } } },
    sent: {
      on: {
        PARTIAL_RECEIPT: { target: 'partial' },
        FULLY_RECEIVED:  { target: 'received' },
        CANCEL:          { target: 'cancelled' },
      },
    },
    partial: {
      on: {
        FULLY_RECEIVED: { target: 'received' },
        CLOSE_SHORT:    { target: 'closed', description: 'Close with shortage' },
      },
    },
    received: { on: { CLOSE: { target: 'closed' } } },
    closed:    { type: 'final' },
    cancelled: { type: 'final' },
  },
};
