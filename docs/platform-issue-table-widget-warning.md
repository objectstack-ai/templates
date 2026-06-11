# Build-time warning: `table`/`pivot` dashboard widget bound to a count-only dataset binding (likely a record list that should be a ListView)

> Upstream target: **`objectstack-ai/framework`** (the `@objectstack/*` platform packages — `@objectstack/spec`, `@objectstack/cli`, `@objectstack/core` all resolve to `git+https://github.com/objectstack-ai/framework.git`).
> Suggested labels: `enhancement`, `analytics`
> Downstream context / manual fix: [objectstack-ai/templates#27](https://github.com/objectstack-ai/templates/pull/27)

## Problem

After the v9 single-form cutover (ADR-0021), a `DashboardWidget` is analytics-only: it binds to a `dataset` and selects `values` (measures) + optional `dimensions`. A widget whose binding resolves to **only `count` measures with no `dimensions`** asks the analytics service for a single grouped row — one number.

That is exactly the right shape for a `type:'metric'` widget. It is the **wrong** shape for a `type:'table'` (or `type:'pivot'`) widget, which the author almost always intends as a **flat list of individual records**. The table renders, but it collapses to a single summary row containing the count — the per-record detail the author wanted is silently gone.

Per the v9 release notes: *"a flat record listing is not an analytics dataset — model it as an object-bound ListView (ADR-0017)."* But `objectstack build` emits **no error and no warning** for this configuration, so the mistake is invisible until the page renders in a browser.

## Impact

- In one downstream template repo this bit **19 `type:'table'` widgets across 11 dashboards** — every one a record listing that silently collapsed to a single count after the ADR-0021 cutover. See [objectstack-ai/templates#27](https://github.com/objectstack-ai/templates/pull/27), which removed them and rebuilt the listings as ADR-0017 object ListViews by hand.
- The build was **green the entire time** — `zod` schema validation, `tsc`, and marketplace compose all passed. Nothing flagged it. The regression only surfaced through manual page inspection.
- This is a predictable migration trap, not a one-off authoring slip: any pre-v9 dashboard that used a `table` widget as a record list converts into exactly this broken shape during the single-form cutover. Every team migrating to v9 is exposed to it.

## Minimal reproduction

A `table` widget bound to a binding that selects only the `count` measure and groups by no dimension:

```ts
// dataset — has a count measure (the only one this widget selects)
export const ExpenseReportDataset = defineDataset({
  name: 'expense_report_metrics',
  object: 'expense_report',
  measures: [
    { name: 'report_count', label: 'report_count', aggregate: 'count' },
    // (a sum measure also exists, but the widget below does not select it)
  ],
  dimensions: [/* ... */],
});

// widget — INTENDS a per-record list, but binds count-only with no dimensions
{
  id: 'pending_reports_table',
  type: 'table',
  dataset: 'expense_report_metrics',
  values: ['report_count'],          // ← resolves to a single count measure
  // (no `dimensions`)                // ← no grouping → one row
  filter: { status: 'submitted' },
  options: {
    columns: ['title', 'requester', 'total_amount', 'cost_center', 'submitted_at'],
    pageSize: 10,
    sort: [{ field: 'total_amount', order: 'desc' }],
  },
}
```

**Observed:** `objectstack build` succeeds with no diagnostic. At runtime the table shows **one row** holding the count value — not the list of submitted reports.

**Note on the heuristic:** the signal lives on the **widget's binding**, not the dataset alone. Here the dataset *does* have a `sum` measure and a dimension, yet the widget is still broken because *it* selects only `report_count` and declares no `dimensions`. A rule keyed purely on "the dataset's measures are all count" would miss this case. Key the check on what the widget actually requests.

## Expected behavior

`objectstack build` should emit a **warning** (non-fatal — does not break existing builds) when, for a single `DashboardWidget`:

1. `type` is `'table'` or `'pivot'`, **and**
2. the `values` it selects resolve to measures that are **all `aggregate: 'count'`**, **and**
3. the widget declares **no `dimensions`** (no grouping).

Suggested message:

```
warning  dashboard "expenses_overview_dashboard" › widget "pending_reports_table":
         a 'table' widget bound to dataset "expense_report_metrics" selects only
         count measure(s) (report_count) and no dimensions, so it renders a single
         summary row — not a per-record list.

         A flat record listing is not an analytics dataset. Model it as an
         object-bound ListView (ADR-0017) surfaced through app navigation, and use
         a 'metric' widget here if you only need the count.

         If a single-row table is intentional, add an explicit dimension or
         suppress with: // objectstack-disable-next-line table-count-only
```

Emitting it as a **warning** (not an error) keeps it non-breaking and lets teams suppress intentional cases, while making the trap visible in CI logs and local builds. Teams that want it to be fatal can promote it to an error via lint config.

## Implementation notes

- Place the check in the **build/validation pipeline**, in the pass that runs *after* dataset references are resolved — i.e. once each widget's `dataset` name is linked to its `defineDataset` and each entry in `values` is resolved to a concrete measure with a known `aggregate`. The check needs the resolved measure `aggregate` types, so it cannot run on the raw widget literal during pure `zod` schema validation; it belongs in the semantic/cross-reference validation stage (alongside the existing "widget requires `dataset` + `values`" analytics-only check), not in schema parsing.
- This is a pure static analysis over already-loaded metadata — no runtime query needed. Per widget: resolve `values` → measures, check `every(m => m.aggregate === 'count')`, and check `!widget.dimensions?.length`. Gate on `type ∈ {'table','pivot'}`.
- Consider a registry entry (e.g. rule id `table-count-only`) so it can be configured/suppressed consistently with other build diagnostics, and so the suppression comment in the message is real.
- A coarser dataset-level variant ("dataset has only count measures and no usable dimensions, yet a table widget binds it") is easier to compute but less precise — it both misses widgets like the repro above (dataset has other measures) and risks false positives. Prefer the widget-binding-level rule.

## Downstream reference

[objectstack-ai/templates#27](https://github.com/objectstack-ai/templates/pull/27) — *"fix(ui): migrate dashboard record-listing tables to ListViews (ADR-0017)"* — is the manual downstream remediation: it removed all 19 collapsed table widgets and rebuilt the genuine record listings as object-bound ListViews. A build-time warning like the one proposed here would have caught all 19 at migration time instead of at render time.
