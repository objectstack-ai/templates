# Publishing templates to the marketplace

Auto-publish on push to `main` is wired via `.github/workflows/publish.yml`.
This doc covers what the workflow does, the per-template metadata it
requires, and how to test or backfill locally.

## At a glance

Publishing is **explicit** — there is no auto-publish on push. Two ways
to trigger:

```
1. Actions UI → Run workflow                  (manual, supports dry-run)
2. GitHub Release published (tag e.g. todo-v0.2.0)   (release-driven)
                                          │
                                          ├─ pnpm install
                                          ├─ pnpm -r build            (every template emits dist/objectstack.json)
                                          └─ node scripts/publish-template.mjs
                                                │
                                                ├─ POST /api/v1/cloud/packages           (idempotent upsert)
                                                └─ POST /api/v1/cloud/packages/:id/versions
                                                       └─ 409 (dup version) → treated as success
```

When triggered via a release whose tag matches `<name>-v<semver>` (e.g.
`todo-v0.2.0`), the workflow narrows the publish to that one template.
Otherwise (or via manual dispatch with an empty filter) it walks every
package — but each is idempotent, so unchanged versions return 409 and
the script reports `skipped`.

## Required GitHub Actions config

In **Repo Settings → Secrets and variables → Actions**:

| Type     | Name               | Value                                                      |
| -------- | ------------------ | ---------------------------------------------------------- |
| Variable | `OS_CLOUD_URL`     | `https://cloud.objectos.app` (prod control plane)          |
| Secret   | `OS_CLOUD_API_KEY` | Service token — copy `OS_CLOUD_API_KEY` from `cloud` repo `apps/cloud/.env.cloudflare.secrets` |

The workflow guards `if: github.repository == 'objectstack-ai/templates'`
so PRs from forks never see the secret.

## Per-template metadata

The publish script reads `packages/<name>/package.json` and expects an
`objectstack.marketplace` block:

```jsonc
{
  "name": "@template/todo",
  "version": "0.1.0",
  "license": "Apache-2.0",
  "objectstack": {
    "marketplace": {
      "manifestId": "app.objectstack.template.todo",
      "displayName": "Todo",                  // 3–64 chars
      "description": "Universal task & project management starter…", // 30–512 chars
      "category": "starter",                  // shown in catalog facets
      "iconUrl":  "https://cdn.objectos.app/icons/todo.svg",
      "homepageUrl": "https://github.com/objectstack-ai/templates/tree/main/packages/todo",
      "readmePath": "README.md"               // file read at publish time (≥ 200 chars)
    }
  }
}
```

Marketplace policy (see `marketplace-policy.ts` in cloud) enforces:

- `display_name` 3–64 chars
- `description` 30–512 chars
- `readme` ≥ 200 chars (markdown)
- `icon_url` https(s)
- `category` non-empty

Bundle size cap: **50 MB** (`MAX_MARKETPLACE_BUNDLE_BYTES`).

### Manifest-id prefix policy

Reserved prefixes (require platform-admin to publish):

- `app.objectstack.*`
- `com.objectstack.*`
- `com.objectos.*`
- `sys.*`

Our service token (`OS_CLOUD_API_KEY`) authenticates in **service mode**,
which the publish route treats as implicitly trusted — first-party
`app.objectstack.template.*` templates publish without an admin review
round-trip.

## Versioning

The version POSTed comes straight from `package.json.version`. To ship a
new release of an existing template:

1. Bump `packages/<name>/package.json` `version` (semver).
2. Optionally set `objectstack.marketplace.releaseNotes` to a short string.
3. Commit + push to `main` (nothing publishes yet — the workflow no longer
   triggers on push).
4. Cut the release. Two equivalent options:
   - **Actions → Publish to marketplace → Run workflow** — optionally tick
     `dry_run` first to inspect the payload, then run again without it.
   - **GitHub Releases → Draft a new release** with tag `<name>-v<version>`
     (e.g. `todo-v0.2.0`). When the release is published the workflow
     fires automatically and narrows the publish to that template via the
     tag pattern.

If the version wasn't bumped, the version POST returns 409 and the script
reports `skipped` — safe to ignore.

## Local dry-run

```bash
# Inspect what would be POSTed, with no network calls
pnpm publish:templates:dry-run

# Filter to one template
PUBLISH_TEMPLATES=@template/todo pnpm publish:templates:dry-run
```

## Local live publish (rare — use the workflow instead)

```bash
export OS_CLOUD_URL=https://cloud.objectos.app
export OS_CLOUD_API_KEY=…   # from apps/cloud/.env.cloudflare.secrets
pnpm -r build
pnpm publish:templates
```

For staging:

```bash
export OS_CLOUD_URL=https://staging-cloud.objectos.app
export OS_CLOUD_API_KEY=…   # staging service token
```

## Manual / hotfix dispatch

Actions → **Publish to marketplace** → **Run workflow**:

- `templates`: leave empty to publish all, or comma-separated subset.
- `dry_run`: tick to print payloads without writing.

## Release-driven publish

GitHub Releases → **Draft a new release**:

- **Tag** `<template>-v<version>` (e.g. `todo-v0.2.0`) → the workflow
  narrows the publish to `@template/<template>`.
- Any other tag shape → workflow runs but evaluates every template (each
  is idempotent — unchanged versions are skipped).
- Use the release body as a public changelog. It is **not** posted to the
  marketplace listing; set `objectstack.marketplace.releaseNotes` in
  `package.json` if you want notes attached to the published version row.

## Failure modes

| HTTP | Meaning                                                                                  | Action                                                                       |
| ---- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 400  | Marketplace policy violation (display name too short, missing icon, etc.)                | Fix `package.json.objectstack.marketplace`, re-push.                         |
| 401  | `OS_CLOUD_API_KEY` missing/wrong                                                         | Rotate the secret, ensure repo setting points at the live key.               |
| 403  | Trying to publish a reserved-prefix `manifestId` without service-mode auth               | Should not happen with the canonical workflow. Check the auth header chain.  |
| 409  | `(package, version)` already exists                                                      | Bump `package.json.version` — or accept the `skipped` summary and move on.   |
| 503  | Control plane control-driver unavailable (cold start race or outage)                     | Re-run the workflow.                                                         |

## Adding a new template

1. `mkdir packages/<name>/` and scaffold it (see `packages/todo/` as the
   reference layout).
2. Add the `objectstack.marketplace` block to its `package.json` with a
   fresh `manifestId` (e.g. `app.objectstack.template.helpdesk`).
3. Ensure `pnpm build` emits `dist/objectstack.json`.
4. Cut a release tagged `<name>-v0.1.0` (or run the workflow manually).
   The script auto-discovers any directory under `packages/` that has a
   `package.json` with a marketplace block.
