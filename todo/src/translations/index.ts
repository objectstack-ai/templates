// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationBundle } from '@objectstack/spec/system';
import { en } from './en';

/**
 * Single-locale bundle. Fork the template and add languages by importing
 * them here and listing each under `supportedLocales` in
 * `objectstack.config.ts`.
 */
export const TodoTranslations: TranslationBundle = {
  en,
};
