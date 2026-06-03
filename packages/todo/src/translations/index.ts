// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationBundle } from '@objectstack/spec/system';
import { en } from './en';
import { zhCN } from './zh-CN';
import { jaJP } from './ja-JP';
import { esES } from './es-ES';

/**
 * Todo App — Internationalization (i18n)
 *
 * Per-locale file convention: each language lives in its own file (`en.ts`,
 * `zh-CN.ts`, `ja-JP.ts`, `es-ES.ts`) and is assembled into a single
 * `TranslationBundle` here. Fork the template and add more languages by
 * importing them and listing each one under `supportedLocales` in
 * `objectstack.config.ts`.
 *
 * Supported locales: en, zh-CN, ja-JP, es-ES
 */
export const TodoTranslations: TranslationBundle = {
  en,
  'zh-CN': zhCN,
  'ja-JP': jaJP,
  'es-ES': esES,
};
