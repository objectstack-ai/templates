// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineStack } from '@objectstack/spec';

import * as objects from './src/objects/index.js';
import * as views from './src/views/index.js';
import * as pages from './src/pages/index.js';
import * as dashboards from './src/dashboards/index.js';
import * as profiles from './src/profiles/index.js';
import * as apps from './src/apps/index.js';
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
    name: 'AI Helpdesk',
    description:
      'AI-first customer support: native AI triage, suggested replies, KB recall, sentiment-driven escalation, customer portal via permissions.',
  },

  requires: ['automation', 'analytics', 'auth', 'ui', 'sharing'],

  objects: Object.values(objects),
  views: Object.values(views),
  pages: Object.values(pages),
  dashboards: Object.values(dashboards),
  permissions: Object.values(profiles),
  apps: Object.values(apps),
  flows: allFlows,
  hooks: allHooks,
  translations: [HelpdeskTranslations],

  sharingRules: [],
  roles: RoleHierarchy.roles.map((r) => ({
    name: r.name,
    label: r.label,
    parent: r.parentRole ?? undefined,
  })),

  data: HelpdeskSeedData,

  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'zh-CN'],
    fallbackLocale: 'en',
    fileOrganization: 'per_locale',
  },
});
