# Changelog

All notable changes to this repository are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `packages/expense` — employee expense & reimbursement template (v0). 3
  objects (`report`, `line`, `category`), report lifecycle state machine
  (`draft → submitted → approved → reimbursed`, with reject/kickback/reopen),
  1 approval process (`expense_approval`, manager sign-off gating
  submit→approved), 3 flows (notify on submit, notify on reimburse, escalate
  approvals stale 3 days), 1 dashboard (Expenses Overview), 2 profiles
  (`expense_employee` / `expense_admin`) over a 3-tier role hierarchy. A line
  rollup hook keeps `report.total_amount` in sync with its lines; a report
  hook stamps `submitted_at` / `approved_at` / `reimbursed_at` on transition
  and auto-numbers reports. Receipt-required policy at $75; approval threshold
  at $1,000. 6 categories + 5 reports (every state) + 13 lines of seed data,
  en + zh-CN locales. Port 4011.
- Repo scaffolding: CI (Node 20 + 22 matrix, smoke boot), `CONTRIBUTING.md`, `TEMPLATE_GUIDE.md`, EditorConfig, Prettier config, Dependabot.
- Restored marketplace publish workflow (`.github/workflows/publish.yml`, `scripts/publish-template.mjs`, `docs/PUBLISHING.md`).
- `packages/todo` — first template: task & project management. 4 objects, state machine, 2 flows, 1 approval, 1 sharing rule, 2 profiles, 2 reports, 1 dashboard, English locale, seeded with one project + two labels.
- `packages/contracts` — post-signature CLM template (v0). 3 business objects
  (`party`, `contract`, `obligation`), 7-state contract lifecycle machine, 2
  flows (renewal alert at T-60/30/7, obligation overdue), 1 dashboard
  (Renewals at Risk), 1 AI action (`extract_terms` — LLM-driven metadata
  extraction from attached PDFs), 2 profiles (`contract_owner` / `legal_admin`),
  4 parties + 6 contracts + 6 obligations of realistic seed data, English
  locale. Charter declares post-signature scope (no drafting / redlining /
  e-sig — keep using Word + DocuSign) and graduation criteria for a future
  standalone product repo. Port 4003.
- `docs/products/contracts-gtm-draft.md` — go-to-market draft for the
  contracts template, parked until graduation criteria fire.
- `packages/procurement` — purchase-to-pay template (v0). 4 objects
  (`vendor`, `request`, `order`, `receipt`), PR + PO state machines,
  3 flows (PR approval ≥ $5k threshold, PR→PO conversion, overdue PO
  alert), 1 dashboard (Spend at a Glance), 2 profiles
  (`buyer` / `procurement_admin`), 4 vendors + 5 PRs + 4 POs + 3
  receipts of seed data exercising every state, en + zh-CN locales.
  3-way-match is implemented as a receipt afterInsert hook that
  rolls `received_value` into PO.received_amount. Port 4004.
- `packages/compliance` — controls & evidence template (v0). 4 objects
  (`framework`, `control`, `evidence`, `assessment`), evidence +
  assessment state machines, 3 flows (evidence expiring T-30/T-7,
  evidence auto-expire, failed control escalation), 1 dashboard
  (Compliance Posture), 2 profiles
  (`auditor` / `compliance_admin`), 3 frameworks (SOC 2, ISO 27001,
  GDPR) + 6 controls + 7 evidence (one already expired) + 5
  assessments of seed data, en + zh-CN locales. Assessment
  afterInsert hook rolls `last_status` + `last_assessed_at` onto the
  parent control. Port 4005.

### Changed
- Root README template table updated with the contracts, procurement,
  and compliance rows; subsequent planned templates renumbered.
- `procurement_vendor.legal_name` → `name` so the bundled
  `LookupCellRenderer` picks up the display name in dashboard/list
  cells (`legal_name` was not in its hard-coded candidate list).

### Fixed
- `todo`: `project.owner` no longer marked `required` — platform fills via `created_by` and ownership rules.
