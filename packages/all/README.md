# `@objectlab/all` — install everything from the marketplace

A throwaway **workspace** that runs *every* template in this repo in **one
runtime**, behind **one app launcher** — as if you had installed all of them
together from the marketplace.

It is not a template. It ships no objects of its own. It is an
**environment compiler**: it gathers the compiled artifact of each template and
composes them into a single environment bundle the runtime serves verbatim.

```bash
# from the repo root — build every template first
pnpm -r build

# then, from this package
pnpm --filter @objectlab/all dev      # compile + boot all apps on :4000
```

Open <http://localhost:4000/_console/> and you'll find all nine apps
(`todo`, `compliance`, `content`, `contracts`, `expense`, `helpdesk`, `hr`,
`procurement`, `pm`) side-by-side, each with its own namespace and seed data.

Seeded admin: `admin@objectos.ai` / `admin123`.

## How it works

This piggy-backs on the runtime's **real** local-install mechanism. When you
install an App from the marketplace, `MarketplaceInstallLocalPlugin` writes it to
`.objectstack/installed-packages/<manifestId>.json` (a wrapper
`{ packageId, manifestId, version, manifest, … }` whose `manifest` is the App's
full compiled artifact) and rehydrates it on boot. The compile command reads
that same folder and composes everything into one static environment artifact.

```
packages/*/dist/objectstack.json             ← each template, compiled & self-contained
        │  (1) install  → wrapper entry, runtime's exact format
        ▼
.objectstack/installed-packages/<id>.json     ← the REAL local-install folder
        │  (2) compile  (scripts/compile-marketplace.mjs)
        ▼
dist/objectstack.json                         ← ONE environment artifact: apps[9]
        │  (3) serve
        ▼
objectstack dev all --artifact dist/objectstack.json
```

1. **install** — populate `.objectstack/installed-packages/` from the workspace
   templates, in the runtime's exact wrapper format, so the folder is
   indistinguishable from a real marketplace install. Already-present entries are
   left untouched — if you installed an App via the marketplace UI (or dropped a
   compiled artifact into the folder), it's picked up as-is.
2. **compile** — unwrap each installed entry to its artifact, concatenate all
   metadata (objects, apps, views, flows, hooks, data…), de-duplicate
   environment-level singletons (`roles` / `permissions` by name, `requires` as a
   set), and synthesize one environment manifest with `apps[N]`.
3. **serve** — `objectstack dev all --artifact …` loads the JSON directly and
   boots a single runtime hosting every app.

Scripts:

| Command | Does |
|---|---|
| `pnpm compile` | (re)build `dist/objectstack.json` from the installed store |
| `pnpm dev` | compile, then boot on `:4000` with a fresh ephemeral DB + seeded admin |
| `pnpm start` | boot the already-compiled artifact (no recompile, persistent DB) |

## Why this does not break ADR-0019 ("one app per package")

ADR-0019 forbids an **authored package** (`type: 'app'`) from defining more than
one app — the banned "suite contains apps" shape — and `defineStack()` enforces
it via `validateSingleApp`.

That rule governs **authoring a package**. It does **not** govern the
**environment** a tenant runs: an environment legitimately hosts many
independently-installed apps, each keeping its own namespace (the runtime keys
namespaces as `Map<namespace, Set<packageId>>`). The cloud control plane does
exactly this when it compiles a tenant environment from its installed packages.

So we compose at the **environment layer** and emit the merged artifact
directly. We never wrap the result in `defineStack()`; the CLI's `compile`/serve
path validates with `ObjectStackDefinitionSchema` (schema only), not the
`defineStack` wrapper — so the single-app and namespace-prefix gates correctly
do not apply. This is the same reason `composeStacks()` exists in
`@objectstack/spec`: composition is an environment-assembly primitive, not a
package-authoring one.

## Caveats

- **Generic role/permission names collide.** `todo` and `content` both ship a
  `lead` / `contributor` role and permission; the compiler keeps the first and
  shadows the rest (logged on compile). Fine for a "see everything" dev
  environment; for production isolation each app would namespace its roles.
- **Throwaway, not a product.** This package is for local exploration, demos,
  and cross-template QA — not something you publish to the marketplace.
- Rebuild a template (`pnpm --filter @objectlab/<name> build`) then
  `pnpm --filter @objectlab/all compile` to pick up its changes.
