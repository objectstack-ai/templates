// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * **Forward-compat shim — DELETE WHEN `@objectstack/spec@>=6.4` SHIPS.**
 *
 * This file mirrors the Portal types added in
 *   framework/packages/spec/src/ui/portal.zod.ts
 * (PR for objectstack-ai/framework#1294).
 *
 * Until that version is published, the template cannot import
 * `definePortal` from `@objectstack/spec/ui`. We re-declare the input
 * type and a pass-through `definePortal` so the template compiles
 * exactly as it will once spec ships.
 *
 * When spec lands, replace this with:
 *   import { definePortal } from '@objectstack/spec/ui';
 */

export type I18nLabel = string;

export interface PortalTheme {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  fontFamily?: string;
  customCss?: string;
}

export interface PortalRateLimit {
  rule: string;
  scope?: 'ip' | 'tenant' | 'route';
}

export interface PortalAnonymousRoute {
  path: string;
  viewRef?: string;
  actionRef?: string;
  rateLimit?: PortalRateLimit;
  captcha?: boolean;
  bindIdentityFromField?: string;
}

export interface PortalAnonymousEntry {
  routes: PortalAnonymousRoute[];
  defaultRateLimit?: PortalRateLimit;
}

export interface PortalSeo {
  title?: string;
  description?: string;
  openGraphImage?: string;
  robots?: 'index' | 'noindex';
}

type BasePortalNavItem = {
  id: string;
  label: I18nLabel;
  icon?: string;
  order?: number;
  badge?: string | number;
};

export type PortalNavItem =
  | (BasePortalNavItem & { type: 'view'; viewRef: string })
  | (BasePortalNavItem & { type: 'action'; actionRef: string })
  | (BasePortalNavItem & { type: 'dashboard'; dashboardName: string })
  | (BasePortalNavItem & { type: 'url'; url: string; target?: '_self' | '_blank' });

export type PortalAuthMode = 'authenticated' | 'magic-link' | 'anonymous' | `sso:${string}`;

export type PortalLayout = 'console' | 'minimal' | 'embedded' | `custom:${string}`;

export interface PortalInput {
  kind: 'portal';
  id: string;
  label: I18nLabel;
  description?: I18nLabel;

  routePrefix: string;
  domain?: string;

  layout?: PortalLayout;
  theme?: PortalTheme;
  locale?: 'auto' | string;
  seo?: PortalSeo;

  authMode?: PortalAuthMode;
  profiles: string[];
  anonymousEntry?: PortalAnonymousEntry;

  navigation: PortalNavItem[];
  defaultRoute?: { viewRef?: string; actionRef?: string; dashboardName?: string };

  embeddable?: boolean;
  allowedEmbedOrigins?: string[];

  active?: boolean;
}

export type Portal = PortalInput;

/**
 * Pass-through definePortal — the real spec runs Zod validation; this
 * shim only provides the type contract.
 */
export function definePortal(config: PortalInput): Portal {
  return config;
}
