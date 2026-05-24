# @template/contracts — Charter

> A template's purpose, scope, and self-imposed limits.

## What this template is

A **post-signature Contract Lifecycle Management (CLM)** starter. Optimized
for the part of the contract lifecycle that lives _after_ the PDF is signed:
central repository, AI-extracted metadata, multi-step approvals, obligation
tracking, and renewal alerts.

It deliberately **does not** try to replace Word for drafting, online
collaboration tools for redlining, or DocuSign / 法大大 for signing — those
remain in your existing workflow.

## Who it's for

- **B2B SaaS / fintech / professional services** companies of 50–500 people
  with 100–2,000 active contracts (NDA, MSA, DPA, vendor, employment, lease)
- **In-house legal / ops leads** who already use Word + DocuSign + a shared
  drive and are drowning in spreadsheets of expiry dates
- Teams that need **data sovereignty** (GDPR Art.28, China data export rules,
  SOC2/ISO 27001 evidence locality) and can't put contract metadata in a
  third-party SaaS

## What it demonstrates

| Capability | How |
|---|---|
| Multi-object schema with relationships | `contract` → `party`, `contract` → `obligation` |
| State machine | `contract.status`: `draft → in_review → signed → active → expired/terminated` |
| Multi-step amount-tiered approval | `< $50k` manager · `≥ $50k` CFO (via `approval_required` formula + workflow) |
| AI action (LLM as first-class tool) | `extract_terms.action.ts` — drop a PDF, get party / amount / dates / auto-renew filled |
| Scheduled flow | Renewal alert at T-60 / T-30 / T-7 days |
| Roll-up reporting | "Total exposure by counterparty", "Renewals at risk" dashboard |
| Field-level audit | Every change tracked via `enable: { trackHistory: true }` |
| Cross-object query (AI-ready) | One agent prompt walks `contract → party → obligations` |
| Permission set | `contract_owner` (own only) vs `legal_admin` (all) |
| Seed data | 2 parties + 4 sample contracts spanning all states |

## What it deliberately does NOT do

These are out of scope for v0; users who need them should integrate, not wait
for us:

- **No drafting / clause library / template authoring** — keep using Word
- **No online redlining / track changes UI** — keep using Word + email
- **No built-in e-signature provider** — integrate DocuSign / Adobe Sign /
  法大大 via webhook; we model the signed PDF, not the signing event
- **No OCR pipeline for scanned paper contracts** — assume text-extractable
  PDFs. Scanned contracts get a manual data-entry path
- **No vendor risk scoring / spend analytics** — that's `procurement` territory
- **No second locale at v0** — `en` only. Fork and add `zh-CN` / `ja-JP` as needed

If you need any of these, you can add them in your fork, or wait for the
companion **product** repo (see "Template vs Product" below).

## Hard limits

These exist so the template stays a **template**, not a half-finished product:

| Metric | Cap | Rationale |
|---|---|---|
| Business objects | ≤ 4 (`party`, `contract`, `obligation`, `contract_party_link`) | Readable in one sitting |
| Total `.ts` LOC under `src/` | ≤ 2,500 | Same |
| Locales | 1 (`en`) | Forkable starting point |
| Dashboards | 1 | "Renewals at risk" |
| Flows | ≤ 3 | Renewal alert + signed → create obligations + assigned notify |
| AI actions | 1 | `extract_terms` — others belong in user forks |
| Permission sets | 2 | `contract_owner` + `legal_admin` |
| Sharing rules | 0 at v0 | Profiles + roles cover the demo; rules are a fork extension |

If you find yourself exceeding any of these, the right move is to **fork into
a new template or graduate to a product repo** (see below), not bloat
`contracts`.

## Template vs Product (important)

This template is **a starter scaffold**, _not_ a production-grade product.

| | This template | A future product (separate repo) |
|---|---|---|
| Purpose | Show the platform; give you a starting point to fork | Run-it-in-prod replacement for Ironclad / LinkSquares |
| LOC | < 2,500 | < 25,000 |
| Languages | en only | en + zh-CN + others |
| SSO / SCIM | Platform defaults | SAML / OIDC tested |
| Migration tooling | None | SharePoint / Drive / Word import |
| Integrations | None | DocuSign / Adobe Sign / 法大大 / Slack / 飞书 |
| Support | Community (GitHub issues) | SLA available |
| Brand | `@template/contracts` | Independent name + marketplace listing |

**Graduation criteria** — we will spin up an independent product repo
(`objectstack-contracts` or its own brand) **only if** the following signals
appear within 60–90 days of this template's release:

- GitHub stars on this repo from `contracts` searches > 500
- Inbound emails asking for hosting / customization > 10
- ≥ 5 production self-host deployments confirmed

Until then, we keep iterating on this template and avoid premature investment
in a separate product motion. GTM thinking is parked in
[`docs/products/contracts-gtm-draft.md`](../../docs/products/contracts-gtm-draft.md)
for trigger time.

## Relationship to other repos

- **`hotcrm`** — production CRM; its `crm_contract` is a downstream sales
  artifact of `crm_opportunity`. This template covers the _post-signature_
  side for _all_ contract types (vendor, employment, lease, NDA…), not just
  sales. Some overlap, intentionally different scope.
- **`procurement`** (planned) — will own vendor master, POs, receipts. When
  available, `contract.party` and `procurement.vendor` should be the same
  underlying entity via shared object (TBD in `procurement` charter).

## Versioning

Semver. Breaking schema changes bump the major. Tracks the latest stable
`@objectstack/*` minor.
