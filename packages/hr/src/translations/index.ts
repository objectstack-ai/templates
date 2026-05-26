// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationBundle } from '@objectstack/spec/system';
import { en } from './en';
import { zhCN } from './zh-CN';

/**
 * HR Template — Internationalization (i18n).
 *
 * Supported locales: en, zh-CN. Fork and add more by importing them
 * here and listing each one under `supportedLocales` in
 * `objectstack.config.ts`.
 */
export const HrTranslations: TranslationBundle = {
  en,
  'zh-CN': zhCN,
};
