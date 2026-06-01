import { defineStack } from '@objectstack/spec';

import * as objects from './src/objects/index.js';
import * as views from './src/views/index.js';
import * as apps from './src/apps/index.js';
import { ProjectTranslations } from './src/translations/index.js';
import { allFlows } from './src/flows/index.js';
import { ProjectSeedData } from './src/data/index.js';

export default defineStack({
  manifest: {
    id: 'app.objectstack.template.project',
    namespace: 'pm',
    version: '0.1.0',
    type: 'app',
    name: 'AI Project Management',
    description: 'Project portfolio management with AI-powered risk prediction and resource optimization.',
  },

  requires: ['automation', 'analytics', 'auth', 'ui'],

  objects: Object.values(objects),
  views: Object.values(views),
  apps: Object.values(apps),
  translations: [ProjectTranslations],

  flows: allFlows,

  data: ProjectSeedData,

  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'zh-CN'],
    fallbackLocale: 'en',
    fileOrganization: 'per_locale',
  },
});
