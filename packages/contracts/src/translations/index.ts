// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationBundle } from '@objectstack/spec/system';
import { en } from './en';
import { zhCN } from './zh-CN';

/**
 * Contracts App — Internationalization (i18n)
 *
 * Ships `en` (default) and `zh-CN`. Fork to add more: create `ja-JP.ts`,
 * import it here, list it under `supportedLocales` in `objectstack.config.ts`.
 */
export const ContractsTranslations: TranslationBundle = {
  en,
  'zh-CN': zhCN,
};
