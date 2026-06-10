// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineStack } from '@objectstack/spec';

import * as objects from './src/objects/index.js';
import * as views from './src/views/index.js';
import * as pages from './src/pages/index.js';
import * as dashboards from './src/dashboards/index.js';
import * as datasets from './src/datasets/index.js';
import * as profiles from './src/profiles/index.js';
import * as apps from './src/apps/index.js';
import { TodoTranslations } from './src/translations/index.js';
import { allFlows } from './src/flows/index.js';
import { allHooks } from './src/hooks/index.js';
import { RoleHierarchy } from './src/sharing/index.js';
import { TodoSeedData } from './src/data/index.js';

export default defineStack({
  manifest: {
    id: 'app.objectstack.template.todo',
    namespace: 'todo',
    version: '0.1.0',
    type: 'app',
    name: 'Todo',
    description: 'Starter template — task management on ObjectStack.',
  },

  // Opt-in capabilities. Foundational services (queue/job/cache/settings/
  // email/storage) are auto-injected by the CLI; we only list the extras.
  requires: ['automation', 'triggers', 'analytics', 'auth', 'ui', 'sharing'],

  objects: Object.values(objects),
  views: Object.values(views),
  pages: Object.values(pages),
  dashboards: Object.values(dashboards),
  datasets: Object.values(datasets),
  permissions: Object.values(profiles),
  apps: Object.values(apps),
  flows: allFlows,
  hooks: allHooks,
  translations: [TodoTranslations],

  sharingRules: [],
  roles: RoleHierarchy.roles.map((r) => ({
    name: r.name,
    label: r.label,
    parent: r.parentRole ?? undefined,
  })),

  data: TodoSeedData,

  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'zh-CN', 'ja-JP', 'es-ES'],
    fallbackLocale: 'en',
    fileOrganization: 'per_locale',
  },
});
