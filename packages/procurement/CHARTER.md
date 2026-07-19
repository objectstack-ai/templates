# @objectlab/procurement — Charter

> A template's purpose, scope, and self-imposed limits.

## What this template is

A **source-to-pay (S2P) procurement** starter for ObjectStack. Covers the
operational backbone of purchasing: vendor master, purchase requests, purchase
orders, and goods receipts — plus approval routing, 3-way-match rollup, and
overdue-delivery alerts.

It deliberately **does not** try to replace ERP financials (GL postings,
3-way invoice matching against AP), e-sourcing / RFQ tooling, or supplier
portals — those remain pluggable.

## Who it's for

- **B2B companies** of 50–500 people running on Google Sheets + email
- **Ops / finance / procurement leads** who need approval routing and a
  central record of "what did we order from whom for how much"
- Teams that need **data sovereignty** for vendor master and spend data

## What it demonstrates

| Capability | How |
|---|---|
| 4-object schema with relationships | `vendor` ← `request` → `order` → `receipt` |
| State-machine driven lifecycle | PR `draft→submitted→approved→converted` |
| Threshold-based approval routing | `pr_approval_required.flow` fires at ≥ $5k |
| Auto-record-creation flow | `pr_to_po_convert.flow` drafts the PO |
| 2-way match signal | PO `match_status` formula (awaiting / partial / matched) from `received_amount` vs `total_amount`. `received_amount` is a live `summary` roll-up — the engine sums `procurement_receipt.received_value` (over the `purchase_order` lookup) on every receipt change; rejected receipts carry value 0, so the sum equals the accepted total. (Earlier this was a hand-maintained stored field because a receipt→PO rollup hook crashed the sandbox — framework#1867, now fixed.) Full PO↔receipt↔invoice 3-way match is a fork. |
| Scheduler-driven alerts | `po_overdue.flow` flags missed deliveries |
| Internationalization | English + 简体中文 ship out of the box |
| Realistic seed data | 4 vendors, 5 PRs, 4 POs, 3 receipts covering all states |

## Limits (LOC budget)

≤ 2,500 lines of TypeScript across `src/**`. Bigger systems should fork.

## Fork points

- **Line items as their own object** — currently JSON on PO to stay under
  the 4-object budget.
- **Per-line receiving & invoicing** — needed for partial line acceptance.
- **Invoice ingestion** — connector hook; left for fork.
- **Multi-currency** — single currency per record; multi requires FX lookup.
- **Vendor onboarding workflow** — currently a single status field; could
  spawn a full questionnaire + risk-scoring flow.
- **Catalog / punchout** — no item master ships; PRs are free-text titles.
