#!/usr/bin/env node
// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.
//
// Marketplace environment compiler — compile whatever is installed locally.
//
// When you install Apps from the marketplace, the runtime's
// `MarketplaceInstallLocalPlugin` persists each one to disk:
//
//     <cwd>/.objectstack/installed-packages/<manifestId>.json
//
// …as a wrapper entry `{ packageId, manifestId, version, manifest, … }` where
// `manifest` is the App's full compiled artifact. The runtime rehydrates these
// at boot. This command does the offline equivalent: it reads that same folder
// and composes every installed App into ONE environment artifact
// (`dist/objectstack.json`) that `objectstack dev all --artifact …` serves as a
// single runtime hosting every app — "install everything from the marketplace".
//
// Two verbs, both idempotent:
//   • install  — populate `.objectstack/installed-packages/` from the workspace
//                templates, in the EXACT wrapper format the runtime writes, so
//                the folder is indistinguishable from a real local install.
//                (Skipped automatically if the folder is already populated —
//                e.g. you installed via the marketplace UI.)
//   • compile  — read every installed entry and compose → dist/objectstack.json
//
// WHY THIS IS NOT A PROTOCOL VIOLATION (ADR-0019)
// -----------------------------------------------
// ADR-0019 bans an *authored package* (`type:'app'`) from defining more than one
// app (the "suite contains apps" shape), enforced by `defineStack`'s
// `validateSingleApp`. That rule governs *authoring a package*. It does NOT
// govern the *environment* a tenant runs: an environment legitimately hosts many
// independently-installed Apps, each keeping its own namespace (the runtime keys
// namespaces as `Map<namespace, Set<packageId>>`) — which is exactly what the
// rehydrate-at-boot path above already does. We compose at the ENVIRONMENT layer
// and emit the merged artifact directly; we never wrap it in `defineStack()`,
// and the CLI's serve path validates with `ObjectStackDefinitionSchema` (schema
// only), so the single-app / namespace-prefix gates correctly do not apply.

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ALL_DIR = resolve(HERE, '..'); // packages/all (the runtime cwd for `dev all`)
const PACKAGES_DIR = resolve(ALL_DIR, '..'); // packages

// The real on-disk location the runtime's MarketplaceInstallLocalPlugin uses:
//   storageDir = resolve(process.cwd(), '.objectstack/installed-packages')
const INSTALLED_DIR = join(ALL_DIR, '.objectstack', 'installed-packages');
const OUT = join(ALL_DIR, 'dist', 'objectstack.json');

// Mirror MarketplaceInstallLocalPlugin.safeFilename so files we write are
// byte-identical to a real local install.
const safeFilename = (manifestId) => `${manifestId.replace(/[^a-zA-Z0-9._-]/g, '_')}.json`;

// Arrays concatenated at the environment layer (mirrors `composeStacks`'
// CONCAT_ARRAY_FIELDS, minus the singletons we de-dupe below).
const CONCAT_FIELDS = [
  'translations', 'objectExtensions', 'objects', 'apps', 'views', 'pages',
  'dashboards', 'reports', 'actions', 'themes', 'flows', 'jobs',
  'emailTemplates', 'sharingRules', 'policies', 'apis', 'webhooks', 'agents',
  'skills', 'hooks', 'mappings', 'analyticsCubes', 'connectors', 'datasources',
  'portals', 'data',
];

// Environment-level singletons keyed by `name`. Two installed apps can each ship
// a generic "lead"/"contributor" role/permission — keep the first, shadow the
// rest, so the runtime never double-registers.
const DEDUP_BY_NAME = ['roles', 'permissions'];

const log = (msg) => process.stdout.write(`${msg}\n`);

/**
 * `install` — populate `.objectstack/installed-packages/` from the workspace
 * templates, in the runtime's wrapper format. No-op for templates already
 * present (so a real marketplace install is never clobbered).
 */
function installFromWorkspace() {
  mkdirSync(INSTALLED_DIR, { recursive: true });
  const installed = [];
  for (const name of readdirSync(PACKAGES_DIR).sort()) {
    if (name === 'all') continue;
    const artifactPath = join(PACKAGES_DIR, name, 'dist', 'objectstack.json');
    if (!existsSync(artifactPath)) {
      log(`  · skip ${name} (no dist/objectstack.json — run \`pnpm -r build\` first)`);
      continue;
    }
    const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
    const manifestId = artifact?.manifest?.id ?? `app.objectstack.template.${name}`;
    const dest = join(INSTALLED_DIR, safeFilename(manifestId));
    if (existsSync(dest)) {
      installed.push(`${name} (already installed)`);
      continue;
    }
    const entry = {
      packageId: manifestId,
      versionId: artifact?.manifest?.version ?? '0.0.0',
      manifestId,
      version: artifact?.manifest?.version ?? '0.0.0',
      manifest: artifact, // the App's full compiled artifact
      installedAt: '1970-01-01T00:00:00.000Z', // fixed → deterministic compile
      installedBy: 'compile-marketplace',
      withSampleData: false,
    };
    writeFileSync(dest, `${JSON.stringify(entry, null, 2)}\n`, 'utf8');
    installed.push(name);
  }
  return installed;
}

/** Read every installed entry; unwrap to the App's full artifact. */
function readInstalledArtifacts() {
  if (!existsSync(INSTALLED_DIR)) return [];
  const out = [];
  for (const file of readdirSync(INSTALLED_DIR).filter((f) => f.endsWith('.json')).sort()) {
    let entry;
    try {
      entry = JSON.parse(readFileSync(join(INSTALLED_DIR, file), 'utf8'));
    } catch {
      log(`  ! ${file}: invalid JSON, skipped`);
      continue;
    }
    // Accept either the runtime wrapper ({ manifest: <artifact> }) or a bare
    // artifact dropped straight into the folder.
    const artifact = entry?.manifest?.objects || entry?.manifest?.apps ? entry.manifest : entry;
    const source = artifact?.manifest?.namespace || entry?.manifestId || file.replace(/\.json$/, '');
    out.push({ source, artifact });
  }
  return out;
}

/** `compile` — compose installed Apps into one environment artifact. */
function compile(store) {
  const env = {
    manifest: {
      id: 'app.objectstack.environment.all',
      name: 'All Templates',
      version: '0.1.0',
      type: 'app',
      description:
        'Local environment with every installed App composed together — the "install everything from the marketplace" workspace.',
    },
  };

  const requires = new Set();
  const supportedLocales = new Set();
  let defaultLocale = 'en';
  const dedup = Object.fromEntries(DEDUP_BY_NAME.map((k) => [k, new Map()]));
  const objectOwner = new Map();

  for (const { artifact, source } of store) {
    for (const obj of artifact.objects ?? []) {
      if (objectOwner.has(obj.name)) {
        throw new Error(
          `object '${obj.name}' is defined by both '${objectOwner.get(obj.name)}' and '${source}'. ` +
            `Apps must prefix every object with their namespace (see TEMPLATE_GUIDE.md).`,
        );
      }
      objectOwner.set(obj.name, source);
    }

    for (const field of CONCAT_FIELDS) {
      const value = artifact[field];
      if (Array.isArray(value) && value.length > 0) (env[field] ??= []).push(...value);
    }

    for (const field of DEDUP_BY_NAME) {
      for (const item of artifact[field] ?? []) {
        if (!dedup[field].has(item.name)) dedup[field].set(item.name, item);
        else log(`  ! ${field.slice(0, -1)} '${item.name}' from '${source}' shadowed (already installed)`);
      }
    }

    for (const token of artifact.requires ?? []) requires.add(token);

    if (artifact.i18n) {
      if (artifact.i18n.defaultLocale) defaultLocale = artifact.i18n.defaultLocale;
      for (const locale of artifact.i18n.supportedLocales ?? []) supportedLocales.add(locale);
    }
  }

  for (const field of DEDUP_BY_NAME) {
    const items = [...dedup[field].values()];
    if (items.length > 0) env[field] = items;
  }
  if (requires.size > 0) env.requires = [...requires];

  supportedLocales.add(defaultLocale);
  env.i18n = { defaultLocale, supportedLocales: [...supportedLocales], fallbackLocale: defaultLocale };

  return env;
}

// ── main ────────────────────────────────────────────────────────────
log('▶ Compiling marketplace environment (install-all)\n');

const justInstalled = installFromWorkspace();
if (justInstalled.length > 0) log(`  installed-packages: ${justInstalled.join(', ')}`);

const store = readInstalledArtifacts();
if (store.length === 0) {
  log('\n✗ No installed packages found in .objectstack/installed-packages/.');
  log('  Build the templates first:  pnpm -r build');
  log('  Or install Apps via the marketplace, then re-run this command.');
  process.exit(1);
}

const env = compile(store);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(env, null, 2)}\n`);

log('');
log(`✓ Composed ${store.length} apps · ${env.objects?.length ?? 0} objects · ${env.flows?.length ?? 0} flows`);
log(`  apps: ${(env.apps ?? []).map((a) => a.name).join(', ')}`);
log(`  installed-packages: ${INSTALLED_DIR.replace(`${PACKAGES_DIR}/`, '')}`);
log(`  → ${OUT.replace(`${PACKAGES_DIR}/`, '')}`);
log('');
log('Run it:  objectstack dev all --artifact dist/objectstack.json -p 4000 --fresh');
