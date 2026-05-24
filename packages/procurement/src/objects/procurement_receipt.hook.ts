// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Hook, HookContext } from '@objectstack/spec/data';

/**
 * After a goods-receipt is inserted, roll its `received_value` up into the
 * parent PO's `received_amount`. The PO's `workflows[]` rule then auto-
 * flips status to "received" once the running total ≥ total_amount.
 *
 * Idempotency note: hook fires on every insert; an `afterDelete` companion
 * is intentionally omitted (deletes of receipts should be rare and audited).
 * If your fork allows receipt edits, mirror the delta on `afterUpdate`.
 */
const receiptHook: Hook = {
  name: 'procurement_receipt_rollup',
  object: 'procurement_receipt',
  events: ['afterInsert'],
  priority: 100,
  description: 'Roll receipt value up into the parent PO.received_amount.',
  handler: async (ctx: HookContext) => {
    const { input, services } = ctx as HookContext & {
      input: Record<string, unknown>;
      services?: {
        data?: {
          get(object: string, id: string): Promise<Record<string, unknown> | null>;
          update(object: string, id: string, values: Record<string, unknown>): Promise<void>;
        };
      };
    };

    const poId = input.purchase_order as string | undefined;
    const value = (input.received_value as number | undefined) ?? 0;
    const quality = input.quality as string | undefined;

    if (!poId || quality === 'rejected' || value <= 0) return;
    if (!services?.data) return;

    const po = await services.data.get('procurement_order', poId);
    if (!po) return;

    const prev = (po.received_amount as number | null) ?? 0;
    const next = prev + value;
    const partialFlip =
      po.status === 'sent' && next > 0 && next < ((po.total_amount as number) ?? 0)
        ? { status: 'partial' }
        : {};

    await services.data.update('procurement_order', poId, {
      received_amount: next,
      ...partialFlip,
    });
  },
};

export default receiptHook;
export { receiptHook };
