// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Helpdesk Customer Portal
 *
 * The **external-user** UI surface for the helpdesk template, declared
 * entirely as metadata against `@objectstack/spec`'s Portal protocol
 * (framework #1294).
 *
 * Mental model:
 *   - Same objects, same fields, same flows as the internal `helpdesk`
 *     app — no duplicated data plane.
 *   - The Portal is a UI projection: a route prefix, a stripped-down
 *     shell, a custom navigation, and a profile gate.
 *   - Permissions are enforced by the `helpdesk_customer` profile and
 *     sharing rules in the data layer. The portal does not (and cannot)
 *     widen visibility.
 *
 * Surfaces exposed:
 *   - Authenticated: `/portal/helpdesk` → My Tickets, Submit, KB.
 *   - Anonymous:
 *       `/portal/helpdesk/submit` — rate-limited + captcha, captures
 *       `customer_email` and triggers a magic-link bind so the new
 *       ticket is later attributed to the verified user.
 *       `/portal/helpdesk/kb`     — rate-limited, public read of
 *       published KB articles.
 */

import { definePortal } from './_portal-spec-shim.js';

export const HelpdeskCustomerPortal = definePortal({
  kind: 'portal',
  id: 'helpdesk_customer',
  label: 'Help Center',
  description: 'Customer-facing help center for the Helpdesk template.',

  // -------- Routing --------
  routePrefix: '/portal/helpdesk',
  // domain: 'support.example.com', // opt-in vanity domain (M3)

  // -------- Shell --------
  layout: 'minimal',
  theme: {
    primaryColor: '#A855F7',
    accentColor: '#F472B6',
    backgroundColor: '#FAFAFA',
    surfaceColor: '#FFFFFF',
    textColor: '#111827',
    logoUrl: '/static/helpdesk/customer-logo.svg',
    faviconUrl: '/static/helpdesk/favicon.png',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
  locale: 'auto',
  seo: {
    title: 'Help Center',
    description: 'Get help, submit a ticket, or search our knowledge base.',
    robots: 'index',
  },

  // -------- Auth --------
  authMode: 'magic-link',
  profiles: ['helpdesk_customer'],

  anonymousEntry: {
    routes: [
      {
        path: '/submit',
        actionRef: 'helpdesk_ticket.create',
        rateLimit: { rule: '5/hour/ip', scope: 'ip' },
        captcha: true,
        bindIdentityFromField: 'customer_email',
      },
      {
        path: '/kb',
        viewRef: 'helpdesk_kb_article.published_articles',
        rateLimit: { rule: '100/hour/ip', scope: 'ip' },
      },
    ],
    defaultRateLimit: { rule: '200/hour/ip', scope: 'ip' },
  },

  // -------- Navigation (authenticated) --------
  navigation: [
    {
      id: 'nav_my_tickets',
      type: 'view',
      label: 'My Tickets',
      icon: 'ticket',
      order: 1,
      viewRef: 'helpdesk_ticket.my_tickets',
    },
    {
      id: 'nav_submit',
      type: 'action',
      label: 'Submit a Ticket',
      icon: 'plus-circle',
      order: 2,
      actionRef: 'helpdesk_ticket.create',
    },
    {
      id: 'nav_kb',
      type: 'view',
      label: 'Knowledge Base',
      icon: 'book-open',
      order: 3,
      viewRef: 'helpdesk_kb_article.published_articles',
    },
  ],

  defaultRoute: { viewRef: 'helpdesk_ticket.my_tickets' },

  // -------- Embedding --------
  embeddable: true,
  allowedEmbedOrigins: ['https://*.example.com'],

  active: true,
});
