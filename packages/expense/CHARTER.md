# @objectlab/expense — Charter

> A template's purpose, scope, and self-imposed limits.

## What this template is

A **report-first employee expense & reimbursement** starter for ObjectStack.
Covers the operational backbone of "an employee paid out of pocket → submits a
claim → it gets approved → finance pays it back": multi-line expense reports,
a category master with soft policy limits, amount-tiered approval, and
reimbursement tracking.

It deliberately **does not** try to be a corporate-card platform (Ramp/Brex
style pre-spend controls), an ERP/GL posting engine, a travel-booking tool, or
a tax-compliance system (VAT reclaim, 增值税专票验真). Those remain pluggable
fork points.

## Who it's for

- **SMBs** (50–500 people) running expenses on spreadsheets + email
- **Finance / ops leads** who need approval routing and an auditable record of
  "who is owed how much for what"
- Teams that want **data sovereignty** over employee spend data

## What it demonstrates

| Capability | How |
|---|---|
| 3-object schema with a header→line relationship | `report` → `line` → `category` |
| Header total of child lines | `report.total_amount` (see *Rollup vs. lifecycle hooks* below) |
| State-machine driven lifecycle | `draft→submitted→approved→reimbursed` |
| Threshold-aware approval | `approval_required` flips at ≥ $1,000; `expense_approval` gates submit→approved |
| Lifecycle timestamps via hook | `submitted_at` / `approved_at` / `reimbursed_at` stamped on transition |
| Policy validation | receipt required on any line ≥ $75 |
| Scheduler-driven escalation | `expense_approval_overdue.flow` nudges stale approvals |
| Internationalization | English + 简体中文 ship out of the box |
| Realistic seed data | 6 categories, 5 reports across every state, 13 lines |

## Rollup: `total_amount` is a live summary

`expense_report.total_amount` is the sum of its lines, kept current
automatically by a native **`summary` field** — the engine recomputes it
whenever an `expense_line` is inserted, updated, or deleted:

```ts
total_amount: Field.summary({
  summaryOperations: {
    object: 'expense_line',
    field: 'amount',
    function: 'sum',
    relationshipField: 'expense_report',
  },
});
```

No hook, no denormalization, no client-maintained header. Two consequences worth
knowing before you fork:

- `total_amount` is **not seeded** — it is computed, so the summary derives it
  from the seeded lines as they load.
- The "submitted reports need a positive total" rule fires on the
  draft→submitted **transition** (`previous.status != "submitted"`), when the
  lines already exist — not on every write — so a report seeded directly in its
  final state isn't gated by rollup timing.

**History:** earlier versions of this template hand-maintained `total_amount` as
a stored header field, because a child hook doing a nested parent write
(`ctx.api.object('expense_report').update(...)`) crashed the sandbox
(`memory access out of bounds`, framework#1867). That is now fixed — nested
writes from hooks are safe. For a plain aggregate the `summary` field above is
the delete-safe, declarative tool; for a **non-aggregate** cross-object rollup
(e.g. copying a child's latest status onto the parent) an `afterInsert` /
`afterUpdate` hook doing `ctx.api.object(parent).update(...)` is now the
sanctioned pattern.

## Limits (LOC budget)

≤ 2,500 lines of TypeScript across `src/**`. Bigger systems should fork.

## Fork points

- **Corporate-card feed** — ingest card transactions and auto-draft lines
  (card-first model). Not modelled; this template is report-first.
- **AI receipt OCR** — an `extract_receipt` AI action that reads an uploaded
  receipt image into a draft line (stubbed in `actions/`).
- **Per-category hard limits** — `category.per_txn_limit` is informational;
  enforce as a blocking validation/hook in your fork.
- **Payment batch object** — pay many reports in one run; v0 keeps payment
  fields on the report.
- **Multi-currency** — single currency per report; multi requires FX lookup.
- **ERP / GL posting** — `gl_account` is captured but not posted anywhere.
- **Reimbursable vs. billable split** — all lines roll into one total.
