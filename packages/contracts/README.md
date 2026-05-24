# @template/contracts

**Post-signature contract lifecycle management on ObjectStack.**

> Drop in a signed PDF. Get party / amount / dates / auto-renew automatically
> extracted, the right people notified for approval, obligations tracked, and
> a renewal alert 60 / 30 / 7 days out. Keep using Word + DocuSign — we only
> own the part that lives _after_ the signature.

[![Status: v0](https://img.shields.io/badge/status-v0-blue.svg)](./CHARTER.md)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](../../LICENSE)

---

## Why this exists

If you have 100–2,000 contracts and you're tracking them in a spreadsheet
(or paying $25k–$200k/year for Ironclad / LinkSquares / Icertis), this
template gives you the **80% that actually matters**:

- A single searchable repository keyed by counterparty, amount, dates, type
- AI extraction of the metadata that humans hate to type
- Multi-step amount-tiered approval ($<50k manager · $≥50k CFO; rewrite to taste)
- Renewal alerts so you stop auto-renewing things you wanted to cancel
- An audit trail granular enough to hand the auditor a read-only link
- And — because this is ObjectStack — **your contracts are first-class
  objects in the same runtime as your tickets, vendors, and POs**, queryable
  by an AI agent in one prompt

It deliberately does NOT do drafting, redlining, or e-signature. Keep using
the tools you already pay for there.

---

## Quick start

```bash
pnpm install
pnpm --filter @template/contracts dev   # http://localhost:4003
```

Open the URL, finish `_account/setup`, and the seed data (2 parties +
4 contracts spanning all lifecycle states) will be visible in **Contracts**
under the All Contracts tab. The **Renewals at Risk** dashboard is the
landing page.

Reset the local DB:

```bash
rm -rf packages/contracts/.objectstack
```

---

## What's in the box

| | Count |
|---|---|
| Business objects | 3 (`party`, `contract`, `obligation`) + 1 junction |
| Lifecycle state machine | 1 (`contract.status`) |
| AI actions | 1 (`extract_terms` — wire to your LLM of choice) |
| Flows | 2 (renewal alert, signed-contract → create obligations) |
| Dashboards | 1 (Renewals at Risk) |
| Permission sets | 2 (`contract_owner`, `legal_admin`) |
| Locales | 1 (`en`) |
| Seed contracts | 4 (active, expiring soon, in review, expired) |

Total: well under 2,500 LOC. You can read all of it in one afternoon and
delete what you don't need.

---

## The five common changes (and where to make them)

| You want to… | Edit |
|---|---|
| Add a custom field (e.g. `data_export_clause`) | `src/objects/contracts_contract.object.ts` |
| Change the approval threshold | `src/objects/contracts_contract.object.ts` → `approval_required` formula |
| Add a contract type (e.g. `lease`) | `src/objects/contracts_contract.object.ts` → `contract_type` select |
| Add a locale | Create `src/translations/<locale>.ts`, register in `index.ts`, list in `objectstack.config.ts` |
| Wire your own LLM for extraction | `src/actions/extract_terms.action.ts` |

---

## The AI extraction action

`src/actions/extract_terms.action.ts` is intentionally tiny: it accepts a
contract ID, fetches the attached PDF, hands it (with a domain-specific
prompt) to your configured LLM, validates the JSON response against the
schema, and writes the extracted fields back to the contract record.

- The prompt is yours to edit. Add your industry's quirks (e.g. "extract
  whether this DPA includes SCCs", "extract 等保 level if mentioned").
- The model is yours to choose. Default is `gpt-5`, but the action accepts
  any OpenAI-compatible endpoint via env var.
- Re-running is idempotent: extracted fields overwrite, audit log records
  the change.

This is the file you'll want to read first.

---

## What this template is NOT

See [CHARTER.md](./CHARTER.md) for the full non-goals list. Headlines:

- ❌ No Word add-in / online editor / clause library (use Word)
- ❌ No redlining / track-changes UI (use Word + email)
- ❌ No e-signature provider (integrate DocuSign / 法大大)
- ❌ No OCR for scanned paper (text-extractable PDFs only)

If you need any of those at production grade, see "Template vs Product" in
the charter.

---

## License

Apache-2.0
