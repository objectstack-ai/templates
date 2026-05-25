// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationBundle } from '@objectstack/spec/system';
import { en } from './en';

/**
 * HR Template — Internationalization (i18n).
 *
 * Ships with English only; fork and add more locales as needed by
 * importing them here and listing them under `supportedLocales` in
 * `objectstack.config.ts`.
 */
export const HrTranslations: TranslationBundle = {
  en,
};
