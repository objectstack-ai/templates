# @objectlab/expense

Employee expense & reimbursement template for ObjectStack. See `CHARTER.md`
for scope, fork points, and LOC budget.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/expense)

## Run in the browser

Click the StackBlitz badge above to launch this template in a WebContainer. It
uses `@objectstack/driver-sqlite-wasm` (sql.js) instead of `better-sqlite3`,
which can't compile inside WebContainers. The `.stackblitzrc` sets
`OS_DATABASE_DRIVER=sqlite-wasm` so the standalone stack picks the WASM driver
automatically. The `packageManager` field pins **pnpm** so StackBlitz/Corepack
uses pnpm.

## Quick start

```bash
pnpm install
pnpm -F @objectlab/expense dev   # http://localhost:4011
```

Seed data drops 6 categories, 5 reports, and 13 lines that exercise every
state and flow:

- **Submitted → approval + notify**: "March client dinners" (EXP-2026-0002)
- **Approved → awaiting reimbursement**: "Q1 home office setup" (EXP-2026-0003)
- **Reimbursed → employee notification**: "Sales offsite — Berlin" (EXP-2026-0001)
- **Rejected → reopen**: "Misc taxi receipts" (EXP-2026-0005)
- **Receipt-required policy**: every line ≥ $75 must have `receipt_attached`

## Objects

| Object | Purpose |
|---|---|
| `expense_report` | Reimbursement claim header (lifecycle + total of its lines) |
| `expense_line` | One itemized expense on a report |
| `expense_category` | Spend taxonomy with GL account + soft limit |

## Lifecycle

```
draft → submitted → approved → reimbursed
            │            
            ├── rejected → (reopen) → draft
            └── kickback → draft
```

## Flows & approval

| Automation | Trigger | Action |
|---|---|---|
| `expense_approval` | Report submitted | Manager sign-off gates submit→approved |
| `expense_report_submitted` | Status → submitted | Notify the `expense_manager` role |
| `expense_report_reimbursed` | Status → reimbursed | Notify the employee with payment reference |
| `expense_report_approval_overdue` | Submitted 3 days, no decision | Escalate to approver pool |

## Roles & profiles

- **Employee** (`expense_employee`) — create/edit own reports & lines, read categories.
- **Expense Admin** (`expense_admin`) — see everything, approve, reimburse, manage categories.
- Role hierarchy: `expense_admin → expense_manager → expense_employee`.

## What to change first

- Tune the **approval threshold** (`approval_required` formula, $1,000) and the
  **receipt threshold** (`needs_receipt`, $75) for your policy.
- Add categories in the **Categories** list; set `per_txn_limit` + `gl_account`.
- Wire **per-category hard limits**, a **corporate-card feed**, or an **AI
  receipt OCR** action — see `CHARTER.md` fork points.

## License

[Apache-2.0](../../LICENSE)
