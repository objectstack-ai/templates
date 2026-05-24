# Contracts Template — Go-to-Market Draft

**Status:** WAITING — this document is parked. Trigger execution only when
graduation criteria in `packages/contracts/CHARTER.md` fire (≥500 GitHub
stars, ≥10 inbound emails for hosting/customization, or ≥5 confirmed
production self-host deployments within 60–90 days of release).

Until then, the template lives inside this repo as one of many; we do **not**
treat it as a product, do **not** stand up a landing page, and do **not**
run paid acquisition.

---

## 1. Ideal Customer Profile (ICP)

**Primary ICP — “Technical mid-market with contract pain”**

- **Size:** 50–500 employees.
- **Industry:** B2B SaaS, infra/devtools, fintech, healthtech, e-commerce
  platforms. Any company that signs many vendor + customer contracts and
  whose legal function is one paralegal + a fractional GC, not a full team.
- **Tech posture:** Already self-hosts something (Postgres, n8n, Plausible,
  Supabase, Cal.com, Outline). Comfortable with Docker / Kubernetes /
  Vercel-style deploys. Has at least one engineer who can run a TypeScript
  app and write a flow.
- **AI posture:** Curious, not afraid. Wants control over which provider
  (OpenAI / Anthropic / Bedrock / on-prem) and what data leaves the
  building.
- **Pain trigger:** Recently missed an auto-renewal, got bitten by a
  surprise data-processing addendum, or failed a SOC 2 audit because
  obligations weren’t tracked.

**Why NOT the Fortune 500:** Ironclad / Icertis / Agiloft already own that
segment. We can’t win on RFP scorecards against 10-year roadmaps.

**Why NOT the 5-person startup:** They’ll just use a Notion table. Our
extra structure is overhead at that scale.

## 2. Positioning

> **Post-signature CLM for teams that ship code.**
>
> Forget drafting and redlining — keep Word + DocuSign for that. The
> moment a contract is signed, you lose visibility: renewal dates, payment
> obligations, indemnities, who owes what to whom. This template gives you
> back that visibility, with AI extraction so the data-entry tax is zero.
>
> Open source. Self-hostable. Forkable in a weekend.

## 3. Messaging Layers (who, what they hear)

| Persona | Headline | Proof point |
| --- | --- | --- |
| Engineer / platform lead | “A CLM you can fork. 3 objects, 1 AI action, ~2500 LOC.” | GitHub stars, `pnpm dev` in 60s |
| In-house counsel / paralegal | “Stop missing renewals. Auto-alert at T-60/30/7.” | Renewals dashboard screenshot |
| CFO / finance ops | “See total active commit value across vendors in one view.” | Portfolio dashboard widget |
| CEO / founder | “Don’t pay $40k/yr for Ironclad before you need it.” | TCO comparison table |

## 4. 90-Day PLG Plan

**Week 0 — launch**
- Tag `packages/contracts@0.1.0`. Add to root README, marketplace.
- Demo video (3 min): import a SaaS subscription PDF → AI fills 80% of the
  fields → renewal alert fires → obligation marked done.
- Show HN post: “Show HN: open-source post-signature CLM (3 objects, AI extraction)”.

**Weeks 1–4 — content**
- Blog post: “Why we built a post-signature CLM instead of competing with Ironclad.”
- Blog post: “Extracting contract terms with an LLM: prompt, schema, failure modes.”
- Blog post: “Self-hosting CLM on a $5/mo VPS.”

**Weeks 4–8 — community**
- Office hours weekly. Public Discord channel.
- Get into 2 newsletters: Console.dev, BetterDev.
- File 3 integration guides: DocuSign webhook ingest, Google Drive watcher,
  Slack renewal-alert channel.

**Weeks 8–12 — signal collection**
- Track in-bound emails / GitHub issues asking for hosted version.
- Track forks that go production (look for `objectstack.config.ts` diffs
  on GitHub code search).
- Survey 10 production users: top 3 missing features, willingness to pay
  for hosted, willingness to pay for support.

## 5. Graduation Triggers → Spin Off Product Repo

Move to `objectstack-contracts` (independent repo, like `hotcrm`) when **any
two** of the following hold:

- ≥500 GitHub stars on `templates` attributable to contracts.
- ≥10 inbound emails for hosted / managed / customization.
- ≥5 confirmed production deploys (case studies, logos, or screenshots).
- Two distinct paying customers willing to pre-pay for a hosted tier.

When that fires:

1. Fork to `objectstack-ai/contracts` (new repo).
2. Add the missing 80%: e-sig adapters, redlining viewer, OCR pipeline,
   SOC2 evidence binder, hosted multi-tenant control plane, billing.
3. Keep the template in `templates/packages/contracts` as the **community
   edition** — always free, always feature-complete for single-tenant
   self-hosting.

## 6. Anti-Goals (what we will NOT do)

- ❌ No paid ads before product-market fit signals.
- ❌ No enterprise sales motion. If a F500 inbound arrives, refer them to
  Ironclad and keep our focus.
- ❌ No closed-source “pro” features inside the template. Pro features
  live in the standalone product repo, not here.
- ❌ No language-specific marketing pages until non-English locales ship.

## 7. Open Questions (revisit at graduation)

- Hosted pricing: per-seat vs per-contract vs flat-rate self-hosting
  support contract?
- Single-tenant per-customer cloud vs multi-tenant SaaS?
- Should the AI extraction action become a billable hosted endpoint
  (BYO-key vs ours)?
- Partner channel: legal-ops consultancies, fractional GC firms, SOC 2
  auditors?
