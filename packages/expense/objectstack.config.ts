// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineStack } from '@objectstack/spec';

import * as objects from './src/objects/index.js';
import * as views from './src/views/index.js';
import * as pages from './src/pages/index.js';
import * as dashboards from './src/dashboards/index.js';
import * as datasets from './src/datasets/index.js';
import * as profiles from './src/profiles/index.js';
import * as apps from './src/apps/index.js';
import { ExpenseTranslations } from './src/translations/index.js';
import { allFlows } from './src/flows/index.js';
import { allHooks } from './src/hooks/index.js';
import { ExpensePositions } from './src/sharing/index.js';
import { ExpenseSeedData } from './src/data/index.js';

export default defineStack({
  manifest: {
    id: 'app.objectstack.template.expense',
    namespace: 'expense',
    version: '0.1.0',
    type: 'app',
    name: 'Expense',
    description: 'Starter template — employee expense & reimbursement management on ObjectStack.',
  },

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
  translations: [ExpenseTranslations],

  sharingRules: [],
  positions: ExpensePositions,

  data: ExpenseSeedData,

  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'zh-CN'],
    fallbackLocale: 'en',
    fileOrganization: 'per_locale',
  },
});
