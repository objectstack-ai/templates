#!/usr/bin/env node
// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * publish-template.mjs
 *
 * Publish one or more template packages to the ObjectStack marketplace
 * (cloud control plane). Used by `.github/workflows/publish.yml` and
 * locally via `pnpm publish:templates`.
 *
 * Flow per template:
 *   1. Read `packages/<name>/package.json`               → version
 *   2. Read `packages/<name>/objectstack.manifest.json`  → marketplace meta
 *      (matches `TemplateManifestSchema` in @objectstack/spec/cloud)
 *   3. Read `packages/<name>/dist/objectstack.json`      → compiled bundle
 *   4. POST {OS_CLOUD_URL}/api/v1/cloud/packages         → idempotent upsert of sys_package
 *      (sets visibility=marketplace + display/description/icon/readme/category)
 *   5. POST {OS_CLOUD_URL}/api/v1/cloud/packages/:id/versions
 *      → creates sys_package_version. 409 (duplicate) is treated as SUCCESS
 *        so re-running the workflow is a no-op when nothing changed.
 *
 * Auth: `Authorization: Bearer ${OS_CLOUD_API_KEY}` (service mode).
 *
 * Required env:
 *   OS_CLOUD_URL       e.g. https://cloud.objectos.app
 *   OS_CLOUD_API_KEY   shared service token (see apps/cloud/.env.cloudflare.secrets)
 *
 * Optional env:
 *   PUBLISH_TEMPLATES  comma-separated package names to publish (default: all)
 *                      e.g. "@objectlab/todo,@objectlab/helpdesk"
 *   DRY_RUN=1          print payloads, don't POST
 *
 * Marketplace metadata is read from `packages/<name>/objectstack.manifest.json`
 * (canonical Zod schema: TemplateManifestSchema in @objectstack/spec/cloud):
 *   {
 *     "name": "todo",
 *     "specVersion": "^6.1.0",
 *     "manifestId": "app.objectstack.template.todo",
 *     "displayName": "Todo",
 *     "description": "Universal task & project management starter…",
 *     "category": "starter",
 *     "isStarter": true,
 *     "publisher": "objectstack",
 *     "license": "Apache-2.0",
 *     "iconUrl": "https://cdn.objectos.app/icons/todo.svg",
 *     "homepageUrl": "https://github.com/objectstack-ai/templates",
 *     "tags": ["tasks","projects"],
 *     "skills": ["objectstack-platform","objectstack-data"],
 *     "readmePath": "README.md"
 *   }
 *
 * Exit codes:
 *   0  one or more templates published, or all were already up-to-date
 *   1  any template failed (network / 4xx other than 409 / policy)
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PKG_DIR = join(ROOT, 'packages');

const OS_CLOUD_URL = (process.env.OS_CLOUD_URL ?? '').replace(/\/+$/, '');
const OS_CLOUD_API_KEY = process.env.OS_CLOUD_API_KEY ?? '';
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
const FILTER = (process.env.PUBLISH_TEMPLATES ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (!DRY_RUN) {
  if (!OS_CLOUD_URL) die('OS_CLOUD_URL is required (e.g. https://cloud.objectos.app)');
  if (!OS_CLOUD_API_KEY) die('OS_CLOUD_API_KEY is required (service token)');
}

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function log(msg) {
  console.log(msg);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function discoverTemplates() {
  const entries = await readdir(PKG_DIR);
  const out = [];
  for (const name of entries) {
    const pkgDir = join(PKG_DIR, name);
    const pkgJsonPath = join(pkgDir, 'package.json');
    if (!existsSync(pkgJsonPath)) continue;
    const st = await stat(pkgDir);
    if (!st.isDirectory()) continue;
    const pkg = await readJson(pkgJsonPath);
    if (FILTER.length && !FILTER.includes(pkg.name)) continue;
    out.push({ dir: pkgDir, pkg });
  }
  return out;
}

async function readReadme(dir, relPath) {
  if (!relPath) return undefined;
  const abs = join(dir, relPath);
  if (!existsSync(abs)) return undefined;
  return await readFile(abs, 'utf8');
}

async function postJson(path, body) {
  const url = `${OS_CLOUD_URL}${path}`;
  if (DRY_RUN) {
    log(`  [dry-run] POST ${url}`);
    log(`  [dry-run] body keys: ${Object.keys(body).join(', ')}`);
    return {
      ok: true,
      status: 200,
      json: { success: true, data: { id: 'dry-run', created: true } },
    };
  }
  // Per-request timeout + retry. The control plane is a singleton that can be
  // cold (it isn't kept warm), so the first heavy POST after idle can take far
  // longer than undici's default 5-min headers timeout — which previously threw
  // and killed the whole run. We use an explicit AbortController timeout and
  // retry transient failures (timeout / network / 5xx). 4xx (incl. 409) returns
  // immediately — those are deterministic, not worth retrying.
  const TIMEOUT_MS = Number(process.env.PUBLISH_TIMEOUT_MS ?? 240_000);
  const MAX_ATTEMPTS = Number(process.env.PUBLISH_RETRIES ?? 4);
  let lastErr;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OS_CLOUD_API_KEY}`,
        },
        body: JSON.stringify(body),
        signal: ac.signal,
      });
      clearTimeout(timer);
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text };
      }
      // Retry server errors (5xx) — a cold/overloaded singleton often 502/503s
      // before it warms up. Client errors (4xx) are returned as-is.
      if (res.status >= 500 && attempt < MAX_ATTEMPTS) {
        log(`  ↻ ${path} → ${res.status}, retry ${attempt}/${MAX_ATTEMPTS - 1}…`);
        await sleep(backoffMs(attempt));
        continue;
      }
      return { ok: res.ok, status: res.status, json };
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      const reason = err?.name === 'AbortError' ? `timeout after ${TIMEOUT_MS}ms` : (err?.message ?? String(err));
      if (attempt < MAX_ATTEMPTS) {
        log(`  ↻ ${path} → ${reason}, retry ${attempt}/${MAX_ATTEMPTS - 1}…`);
        await sleep(backoffMs(attempt));
        continue;
      }
      // Exhausted retries — surface a structured failure, don't throw (so one
      // stuck template doesn't kill the whole run).
      return { ok: false, status: 0, json: { error: `request failed: ${reason}` } };
    }
  }
  return { ok: false, status: 0, json: { error: `request failed: ${lastErr?.message ?? 'unknown'}` } };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Backoff with a cap: 3s, 6s, 12s, 24s, 30s… — gives a cold singleton time to
// spin up between attempts.
function backoffMs(attempt) {
  return Math.min(3000 * 2 ** (attempt - 1), 30_000);
}

/**
 * Publish a single template. Returns 'created' | 'updated' | 'skipped' | 'failed'.
 */
async function publishOne({ dir, pkg }) {
  const name = pkg.name;
  const ver = pkg.version;

  log(`\n── ${name} @ ${ver}`);

  const manifestPath = join(dir, 'objectstack.manifest.json');
  if (!existsSync(manifestPath)) {
    log(`  ⚠ skipped: no objectstack.manifest.json at ${manifestPath}`);
    return 'skipped';
  }
  const mp = await readJson(manifestPath);

  const distPath = join(dir, 'dist', 'objectstack.json');
  if (!existsSync(distPath)) {
    log(`  ✗ missing ${distPath} — did you run "pnpm build"?`);
    return 'failed';
  }
  const bundle = await readJson(distPath);

  const manifestId = mp.manifestId ?? bundle?.manifest?.id;
  if (!manifestId) {
    log(
      '  ✗ no manifestId resolved (set manifestId in objectstack.manifest.json or ensure bundle.manifest.id)',
    );
    return 'failed';
  }

  const readme = await readReadme(dir, mp.readmePath ?? 'README.md');

  // Step 1 — upsert sys_package (marketplace visibility).
  const upsertBody = {
    manifest_id: manifestId,
    visibility: 'marketplace',
    display_name: mp.displayName,
    description: mp.description,
    category: mp.category,
    tags: mp.tags,
    is_starter: mp.isStarter,
    publisher: mp.publisher,
    icon_url: mp.iconUrl,
    homepage_url: mp.homepageUrl,
    license: mp.license ?? pkg.license,
    readme,
  };

  const upsertRes = await postJson('/api/v1/cloud/packages', upsertBody);
  if (!upsertRes.ok) {
    log(`  ✗ upsert failed (${upsertRes.status}): ${JSON.stringify(upsertRes.json).slice(0, 400)}`);
    return 'failed';
  }
  const pkgId = upsertRes.json?.data?.id;
  const wasCreated = upsertRes.json?.data?.created === true;
  log(`  ${wasCreated ? '✓ created' : '✓ patched'} sys_package id=${pkgId}`);

  // Step 2 — create sys_package_version (idempotent by 409).
  // `auto_approve: true` is honoured for service-mode callers (= our CI's
  // OS_CLOUD_API_KEY). Without it the version lands as `draft` and the
  // public marketplace endpoint hides it forever.
  const versionBody = {
    version: ver,
    bundle,
    release_notes: mp.releaseNotes,
    auto_approve: true,
  };
  const verRes = await postJson(
    `/api/v1/cloud/packages/${encodeURIComponent(pkgId)}/versions`,
    versionBody,
  );
  if (verRes.status === 409) {
    log(`  = version ${ver} already published — no-op`);
    return 'skipped';
  }
  if (!verRes.ok) {
    log(`  ✗ version POST failed (${verRes.status}): ${JSON.stringify(verRes.json).slice(0, 400)}`);
    return 'failed';
  }
  log(`  ✓ published version ${ver}`);
  return wasCreated ? 'created' : 'updated';
}

async function main() {
  const templates = await discoverTemplates();
  if (!templates.length) {
    log('No templates discovered under packages/.');
    process.exit(0);
  }
  log(`Discovered ${templates.length} template(s): ${templates.map((t) => t.pkg.name).join(', ')}`);
  if (DRY_RUN) log('DRY_RUN=1 — no HTTP calls will be made.');

  const results = { created: 0, updated: 0, skipped: 0, failed: 0 };
  const failures = [];
  for (const t of templates) {
    // One template's failure must NOT abort the others — publish is per-package
    // and idempotent, so we attempt every template and report at the end.
    let r;
    try {
      r = await publishOne(t);
    } catch (err) {
      log(`  ✗ ${t.pkg.name} threw: ${err?.message ?? err}`);
      r = 'failed';
    }
    results[r] = (results[r] ?? 0) + 1;
    if (r === 'failed') failures.push(t.pkg.name);
  }
  log('\n── Summary ──');
  log(JSON.stringify(results, null, 2));
  if (failures.length) log(`Failed: ${failures.join(', ')}`);
  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
