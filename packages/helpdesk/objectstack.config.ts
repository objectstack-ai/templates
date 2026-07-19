// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineStack } from '@objectstack/spec';

import * as objects from './src/objects/index.js';
import * as views from './src/views/index.js';
import * as pages from './src/pages/index.js';
import * as dashboards from './src/dashboards/index.js';
import * as datasets from './src/datasets/index.js';
import * as profiles from './src/profiles/index.js';
import * as apps from './src/apps/index.js';
// portals: declared as metadata (see ./src/portals/index.ts). Wire into
// defineStack({ portals }) once @objectstack/spec ships the Portal kind
// (framework #1294). The import is intentionally side-effect-free until
// then so the portal definition is type-checked but unused at runtime.
import './src/portals/index.js';
import { HelpdeskTranslations } from './src/translations/index.js';
import { allFlows } from './src/flows/index.js';
import { allHooks } from './src/hooks/index.js';
import { RoleHierarchy } from './src/sharing/index.js';
import { HelpdeskSeedData } from './src/data/index.js';

export default defineStack({
  manifest: {
    id: 'app.objectstack.template.helpdesk',
    namespace: 'helpdesk',
    version: '0.1.0',
    type: 'app',
    name: 'Helpdesk',
    description:
      'Customer support starter on ObjectStack: tickets, SLA, sentiment-based escalation, KB, and a customer portal; AI triage fields ship with a deterministic baseline you extend with your own LLM.',
  },

  requires: ['automation', 'triggers', 'analytics', 'auth', 'ui', 'sharing'],

  objects: Object.values(objects),
  views: Object.values(views),
  pages: Object.values(pages),
  dashboards: Object.values(dashboards),
  datasets: Object.values(datasets),
  permissions: Object.values(profiles),
  apps: Object.values(apps),
  // portals: Object.values(portals), // enable after spec@>=6.4 ships kind: 'portal'
  flows: allFlows,
  hooks: allHooks,
  translations: [HelpdeskTranslations],

  sharingRules: [],
  positions: RoleHierarchy.roles.map((r) => ({
    name: r.name,
    label: r.label,
  })),

  data: HelpdeskSeedData,

  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'zh-CN'],
    fallbackLocale: 'en',
    fileOrganization: 'per_locale',
  },
});
