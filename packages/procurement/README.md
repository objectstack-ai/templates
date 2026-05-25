# @template/procurement

Source-to-pay procurement template for ObjectStack. See `CHARTER.md` for
scope, fork points, and LOC budget.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/procurement)

## Run in the browser

Click the StackBlitz badge above to launch this template in a WebContainer. It uses `@objectstack/driver-sqlite-wasm` (sql.js) instead of `better-sqlite3`, which can't compile inside WebContainers. The `.stackblitzrc` sets `OS_DATABASE_DRIVER=sqlite-wasm` so the standalone stack picks the WASM driver automatically. The `packageManager` field pins **pnpm** so StackBlitz/Corepack uses pnpm (npm trips over the optional `better-sqlite3` dependency inside WebContainers).

## Quick start

```bash
pnpm install
pnpm -F @template/procurement dev   # http://localhost:4004
```

Seed data drops 4 vendors, 5 purchase requests, 4 POs, and 3 receipts that
exercise every flow:

- **PR ≥ $5k → approval flow**: "10x Dell P2723D monitors" ($7.5k, submitted)
- **PR approved → PO draft**: "Annual Cloudwell hosting renewal" (approved)
- **PO delivery overdue**: "Localization services — Japanese docs" (PO-2026-003)
- **3-way-match rollup**: GR-2026-001 ($3,750) on PO-2026-002 ($7,500) → partial

## Objects

| Object | Purpose |
|---|---|
| `procurement_vendor` | Supplier master |
| `procurement_request` | Internal request to buy (PR) |
| `procurement_order` | Commitment sent to vendor (PO) |
| `procurement_receipt` | Receiving event against a PO (GR) |

## Flows

| Flow | Trigger | Action |
|---|---|---|
| `procurement_request_approval_required` | PR submitted ≥ $5k | Notify finance |
| `procurement_request_to_po_convert` | PR status → approved | Auto-draft PO, mark PR converted |
| `procurement_order_overdue_delivery` | PO past expected_delivery (T-1) | Notify buyer |

## Hooks

| Hook | Event | Behavior |
|---|---|---|
| `procurement_request_automation` | beforeInsert/Update | Default status, auto-PR-number, clear stale converted_po |
| `procurement_receipt_rollup` | afterInsert | Roll `received_value` into PO.received_amount; flip PO to `partial` |

## Roles

- **Procurement Admin** — full control, can hard-delete
- **Buyer** — full CRUD except delete

## i18n

- `en` (default)
- `zh-CN` (采购管理)

Add a locale: drop `ja-JP.ts` in `src/translations/`, register in
`src/translations/index.ts`, list in `objectstack.config.ts → i18n.supportedLocales`.
