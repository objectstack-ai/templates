#!/usr/bin/env node
// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.
//
// QA scenario runner for ObjectStack templates.
//
// Runs the Quality-Protocol scenario files (qa/*.test.json, same format the
// bundled `objectstack test` uses) against a running dev server. It exists
// because the `objectstack test` adapter shipped in @objectstack/core 7.4.x
// targets the unversioned path `/api/data/<object>`, while the 7.4.x REST
// plugin serves the versioned `/api/v1/data/<object>` — so the bundled runner
// 404s. This runner hits the versioned path and authenticates via better-auth
// sign-up, so the scenarios actually execute end-to-end.
//
// Usage:
//   node scripts/run-qa.mjs --url http://localhost:4002 [--file qa/*.test.json]
//
// Exit code is non-zero if any scenario fails.

import { readFileSync } from 'node:fs';
import { argv, exit } from 'node:process';

function arg(name, fallback) {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}

const baseUrl = (arg('url', 'http://localhost:4002')).replace(/\/$/, '');
const apiBase = `${baseUrl}/api/v1`;
const file = arg('file', 'qa/business-workflow.test.json');

// ---- tiny helpers (mirror @objectstack/core TestRunner semantics) ----
const getByPath = (obj, path) =>
  !path ? obj : path.split('.').reduce((c, p) => (c == null ? undefined : c[p]), obj);

function interpolate(action, ctx) {
  const s = JSON.stringify(action).replace(/\{\{([^}]+)\}\}/g, (m, p) => {
    const v = getByPath(ctx, p.trim());
    if (v === undefined) return m;
    return typeof v === 'string' ? v : JSON.stringify(v);
  });
  try {
    return JSON.parse(s);
  } catch {
    return action;
  }
}

function assertOne(result, a) {
  const actual = getByPath(result, a.field);
  const expected = a.expectedValue;
  const fail = (msg) => {
    throw new Error(`assertion failed: ${a.field} ${msg} (got ${JSON.stringify(actual)})`);
  };
  switch (a.operator) {
    case 'equals':
      if (actual !== expected) fail(`expected ${JSON.stringify(expected)}`);
      break;
    case 'not_equals':
      if (actual === expected) fail(`expected not ${JSON.stringify(expected)}`);
      break;
    case 'not_null':
      if (actual === null || actual === undefined) fail('expected non-null');
      break;
    case 'is_null':
      if (actual !== null && actual !== undefined) fail('expected null');
      break;
    case 'contains':
      if (Array.isArray(actual)) {
        if (!actual.includes(expected)) fail(`array does not contain ${JSON.stringify(expected)}`);
      } else if (typeof actual === 'string') {
        if (!actual.includes(String(expected))) fail(`string does not contain ${expected}`);
      } else fail('not array/string');
      break;
    default:
      throw new Error(`unknown operator: ${a.operator}`);
  }
}

// better-auth enforces a CSRF Origin check; send the server's own origin.
let headers = { 'Content-Type': 'application/json', Origin: baseUrl };

async function signUp() {
  const email = `qa+${Date.now()}@objectos.ai`;
  const res = await fetch(`${apiBase}/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: baseUrl },
    body: JSON.stringify({ email, password: 'qatest12345', name: 'QA Runner' }),
  });
  const token = res.headers.get('set-auth-token');
  if (!res.ok || !token) {
    throw new Error(`sign-up failed: HTTP ${res.status} ${await res.text()}`);
  }
  headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  return email;
}

async function dataFetch(method, path, body) {
  const res = await fetch(`${apiBase}/data/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
  return json;
}

async function execute(action) {
  const { type, target, payload = {} } = action;
  switch (type) {
    case 'create_record':
      return dataFetch('POST', target, payload);
    case 'update_record': {
      if (!payload.id) throw new Error('update_record requires id');
      const { id, ...rest } = payload;
      return dataFetch('PATCH', `${target}/${id}`, rest);
    }
    case 'read_record':
      if (!payload.id) throw new Error('read_record requires id');
      return dataFetch('GET', `${target}/${payload.id}`);
    case 'delete_record':
      if (!payload.id) throw new Error('delete_record requires id');
      return dataFetch('DELETE', `${target}/${payload.id}`);
    case 'query_records':
      return dataFetch('POST', `${target}/query`, payload);
    case 'wait':
      return new Promise((r) => setTimeout(() => r({ waited: payload.duration || 0 }), payload.duration || 0));
    default:
      throw new Error(`unsupported action type: ${type}`);
  }
}

async function runStep(step, ctx) {
  const result = await execute(interpolate(step.action, ctx));
  if (step.capture) for (const [k, p] of Object.entries(step.capture)) ctx[k] = getByPath(result, p);
  // Interpolate assertions too so expectedValue can reference captured vars.
  if (step.assertions) for (const a of step.assertions) assertOne(result, interpolate(a, ctx));
  return result;
}

async function main() {
  const suite = JSON.parse(readFileSync(file, 'utf8'));
  const email = await signUp();
  console.log(`\n▶ ${suite.name}`);
  console.log(`  server: ${apiBase}   auth: ${email}\n`);

  let passed = 0;
  let failed = 0;
  for (const sc of suite.scenarios) {
    // Seed a per-run id so fixtures can keep unique-constrained fields (e.g.
    // a label name) collision-free across repeated runs on a persistent DB.
    const ctx = { runId: `${Date.now()}${Math.floor(performance.now())}` };
    try {
      for (const step of sc.setup || []) await runStep(step, ctx);
      for (const step of sc.steps) await runStep(step, ctx);
      console.log(`  ✅ ${sc.id} — ${sc.name}`);
      passed++;
    } catch (e) {
      console.log(`  ❌ ${sc.id} — ${sc.name}\n       ${e.message}`);
      failed++;
    }
  }
  console.log(`\n${failed === 0 ? '✅ PASS' : '❌ FAIL'}: ${passed} passed, ${failed} failed.\n`);
  exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(`\n❌ runner error: ${e.message}\n`);
  exit(1);
});
