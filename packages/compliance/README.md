# @objectlab/compliance

Compliance posture & evidence management template for ObjectStack. See
`CHARTER.md` for scope, fork points, and LOC budget.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/compliance)

## Run in the browser

Click the StackBlitz badge above to launch this template in a WebContainer. It uses `@objectstack/driver-sqlite-wasm` (sql.js) instead of `better-sqlite3`, which can't compile inside WebContainers. The `.stackblitzrc` sets `OS_DATABASE_DRIVER=sqlite-wasm` so the standalone stack picks the WASM driver automatically. The `packageManager` field pins **pnpm** so StackBlitz/Corepack uses pnpm (npm trips over the optional `better-sqlite3` dependency inside WebContainers).

## Quick start

```bash
pnpm install
pnpm -F @objectlab/compliance dev   # http://localhost:4005
```

Seed data drops 3 frameworks (SOC2, ISO 27001, GDPR), 6 controls, 7 evidence
items, and 5 assessments. Things to look at:

- **Dashboard** → 1 failing control (CC7.1 Vulnerability Management),
  evidence expiring in 7 / 25 days, 1 in-progress assessment.
- **Flows** → DPA evidence is already past expires_on → `evidence_auto_expire`
  should flip it. Nessus scan evidence is T-25 days → `evidence_expiring` fires
  at T-7 by default.
- **Hook** → Adding a passed/failed/partial assessment updates its control's
  `last_status` and `last_assessed_at`.

## Objects

| Object | Purpose |
|---|---|
| `compliance_framework` | Standard catalog (SOC2, ISO27001, etc.) |
| `compliance_control` | Individual requirement (e.g. CC6.1) |
| `compliance_evidence` | Proof file/log/screenshot supporting a control |
| `compliance_assessment` | Periodic test result for a control |

## Flows

| Flow | Trigger | Action |
|---|---|---|
| `compliance_evidence_expiring` | Approved evidence T-30 / T-7 before expires_on | Notify collector |
| `compliance_evidence_auto_expire` | Approved evidence expires_on passed | Flip status to expired |
| `compliance_failed_control_escalation` | Assessment → failed | Notify owner + compliance team |

## Hooks

| Hook | Event | Behavior |
|---|---|---|
| `compliance_assessment_rollup` | afterInsert/Update | Update Control.last_status + last_assessed_at |
| `compliance_evidence_automation` | beforeInsert/Update | Default approver, clear stale approvals on rejection |

## Roles

- **Compliance Admin** — full control
- **Control Owner** — manage controls/evidence/assessments, read-only frameworks

## i18n

- `en` (default)
- `zh-CN` (合规态势)
