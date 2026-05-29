# @objectlab/compliance — Charter

> A template's purpose, scope, and self-imposed limits.

## What this template is

A **compliance posture & evidence management** starter for ObjectStack.
Lets a small infosec / GRC team maintain their control catalog, collect
and review evidence, schedule and record assessments, and surface failing
controls and stale evidence on a single dashboard.

It deliberately **does not** try to replace dedicated GRC platforms
(Vanta, Drata, Hyperproof) on automated evidence collection from cloud
infra — instead it provides the data model & workflow on top of which
you can plug in your own collectors via the API.

## Who it's for

- **B2B SaaS / fintech / health-tech** companies pursuing SOC 2, ISO 27001,
  HIPAA, or GDPR — typically 30–500 people
- **Heads of Security / Compliance** maintaining the control register
  manually in spreadsheets today
- Companies that need **data sovereignty** for evidence (especially
  encryption configs, access reviews, pentest reports)

## What it demonstrates

| Capability | How |
|---|---|
| 4-object schema with relationships | `framework` → `control` → (`evidence`, `assessment`) |
| State machines on multiple objects | Evidence + Assessment lifecycles |
| Cross-object rollup via hook | Assessment outcome → Control.last_status / last_assessed_at |
| Time-triggered alert flows | Evidence expiring at T-30 / T-7 |
| Auto-state-transition flows | Evidence auto-expire when expires_on passes |
| Threshold-driven escalation | Failed high-criticality controls → notify owner + compliance team |
| Internationalization | English + 简体中文 ship out of the box |
| Realistic seed data | SOC2 + ISO27001 + GDPR with 6 controls, 7 evidence, 5 assessments |

## Limits (LOC budget)

≤ 2,500 lines of TypeScript across `src/**`.

## Fork points

- **Automated collectors** — pull AWS Config / Datadog / GitHub access reviews
  on a schedule and create Evidence records (use `http_request` + `create_record` nodes)
- **Multi-control evidence** — currently 1 evidence → 1 primary control; add
  a join object for many-to-many
- **Auditor portal** — share read-only views with external auditors via sharing rules
- **Findings & risks** — a separate "risk register" object that ties open
  findings to controls
- **Per-framework dashboards** — duplicate the dashboard with framework filters
