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

## Rollup vs. lifecycle hooks (an important runtime constraint)

`expense_report.total_amount` is the sum of its lines. The obvious way to keep
it current is a child hook that, on every line change, recomputes the sum and
writes it back to the parent. **This template deliberately does *not* do that**,
and the reason is worth understanding before you fork:

- Hook bodies run inside a single shared **QuickJS (asyncify) sandbox** that
  allows only **one** suspended async call at a time. A hook that performs a
  *nested* engine write — `ctx.api.object('expense_report').update(...)` from
  an `expense_line` hook — re-enters that sandbox while the line hook is still
  suspended, corrupting asyncify state and **crashing the process**
  (`memory access out of bounds`). This is a hard platform limit in the
  standalone runtime, not a bug in the hook.
- Several reference templates appear to roll up via `ctx.services.data`, but
  that service is **undefined inside the sandbox**, so those rollups silently
  no-op — they neither update the parent nor crash. Don't copy that pattern
  expecting it to work.

So in this template `total_amount` is treated as a stored header field:
defaulted on insert, shipped correct in the seed, and meant to be maintained by
the client (or a server-side aggregation in your fork). What a hook *can* safely
do is mutate **its own** incoming payload — which is exactly what
`expense_report.hook.ts` does for the auto-number and the lifecycle timestamps
(`submitted_at` / `approved_at` / `reimbursed_at`), with no nested writes.

**Fork point:** to make the total self-maintaining, compute it outside the
sandbox — e.g. a native aggregate/summary field once the runtime computes the
`summary` field type, a database trigger/view, or an external worker that
listens for line changes and patches the parent at top level (not nested in a
hook).

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
