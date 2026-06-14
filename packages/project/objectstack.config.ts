import { defineStack } from '@objectstack/spec';

import * as objects from './src/objects/index.js';
import * as views from './src/views/index.js';
import * as dashboards from './src/dashboards/index.js';
import * as datasets from './src/datasets/index.js';
import * as profiles from './src/profiles/index.js';
import * as apps from './src/apps/index.js';
import { ProjectTranslations } from './src/translations/index.js';
import { allFlows } from './src/flows/index.js';
import { allHooks } from './src/hooks/index.js';
import { RoleHierarchy, allSharingRules } from './src/sharing/index.js';
import { ProjectSeedData } from './src/data/index.js';

export default defineStack({
  manifest: {
    id: 'app.objectstack.template.project',
    namespace: 'pm',
    version: '0.1.0',
    type: 'app',
    name: 'AI Project Management',
    description:
      'Project portfolio management with AI-powered risk prediction and resource optimization.',
  },

  requires: ['automation', 'triggers', 'job', 'analytics', 'auth', 'ui', 'sharing'],

  objects: Object.values(objects),
  views: Object.values(views),
  dashboards: Object.values(dashboards),
  datasets: Object.values(datasets),
  permissions: Object.values(profiles),
  apps: Object.values(apps),
  translations: [ProjectTranslations],

  flows: allFlows,
  hooks: allHooks,

  sharingRules: allSharingRules,
  roles: RoleHierarchy.roles.map((r) => ({
    name: r.name,
    label: r.label,
    parent: r.parentRole ?? undefined,
  })),

  data: ProjectSeedData,

  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'zh-CN'],
    fallbackLocale: 'en',
    fileOrganization: 'per_locale',
  },
});
