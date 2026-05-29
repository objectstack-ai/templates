# @objectlab/hr — Charter

> A template's purpose, scope, and self-imposed limits.

## What this template is

A **production-ready starter** for People Ops basics: employee directory, departments / org chart, time-off requests with approval, and document tracking with expiry alerts.

It is the minimum HR backbone a 20–200-person company actually uses on day one.

## Who it's for

- Companies replacing the "HR spreadsheet" with something queryable, permissioned, and auditable.
- Builders who want a permissions-heavy ObjectStack example (sensitive fields, sharing rules, approval chains).

## What it demonstrates

| Capability | How |
|---|---|
| Self-referential relationship | `hr_employee.manager_id → hr_employee` |
| Hierarchy object | `hr_department.parent_id → hr_department` |
| State machine + approval | `hr_time_off_request`: draft → submitted → approved/rejected |
| Field-level sensitivity | `hr_employee` salary / contract fields visible only to HR + self |
| Sharing rule | time-off request rows visible only to requester + approval chain |
| Expiry-driven flow | `hr_document.expires_at` triggers reminder 30 days out |
| Profiles | `hr_employee` (self-service) vs `hr_admin` (full access) |
| Dashboard | HR Admin landing: joiners this month, pending approvals, expiring docs |
| Seed data | small fictional company with departments, employees, sample requests |

## What it deliberately does NOT do

- **No payroll.** Tax, currency, country-specific compliance — out of scope. Belongs in a separate `payroll` template.
- **No onboarding checklists.** Belongs in a separate `onboarding` template; this one keeps the directory clean.
- **No performance reviews.** Belongs in a separate `performance` template.
- **No recruiting / ATS.** Different domain, different rhythm.
- **No SSN / national ID storage.** A `national_id_last4` field exists as a placeholder; full IDs are a compliance risk this template will not model. README calls this out.
- **No salary encryption demo.** Sensitive-field handling is shown via sharing rules, not crypto.
- **No second locale.** `en` only; fork to add.

## Hard limits

| Metric | Cap | Notes |
|---|---|---|
| Business objects | 4 (`hr_employee`, `hr_department`, `hr_time_off_request`, `hr_document`) | |
| Total `.ts` LOC under `src/` | ≤ 2,500 | |
| Locales | 1 (`en`) | |
| Dashboards | 1 | HR Admin landing |
| Flows | 2 | Time-off notification + document expiry reminder |
| Approval processes | 1 | Time-off |
| Sharing rules | 1 | Time-off privacy |
| Permission sets | 2 | `hr_employee` + `hr_admin` |
| State machines | 1 | Time-off lifecycle |

If you need onboarding tasks, performance reviews, or recruiting, fork a new template. Do not bloat this one.

## Compatibility with other templates

Soft references only — no `import` from sibling templates, no schema-level foreign keys across packages.

- Future `onboarding` template: reference an employee via `employee_ref: text` carrying `hr:employee:<external_id>`.
- Future `performance` template: same convention.

See `docs/recipes/` in the repo root (added once a second HR-area template exists) for end-user wiring examples.

## Versioning

Semver. Schema-breaking changes bump the major. Tracks the latest stable `@objectstack/*` minor.
