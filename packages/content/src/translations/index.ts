// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationBundle } from '@objectstack/spec/system';
import { en } from './en';
import { zhCN } from './zh-CN';

/**
 * Content App — Internationalization (i18n).
 * Ships `en` (default) and `zh-CN`. Add more by creating `ja-JP.ts`,
 * importing it here, and listing it under `supportedLocales` in
 * `objectstack.config.ts`.
 */
export const ContentTranslations: TranslationBundle = {
  en,
  'zh-CN': zhCN,
};
