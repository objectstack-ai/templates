// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { App } from '@objectstack/spec/ui';

export const ProcurementApp = App.create({
  name: 'procurement',
  label: 'Procurement',
  description: 'Source-to-pay procurement on ObjectStack.',
  icon: 'shopping-cart',
  branding: { primaryColor: '#16A34A' },

  navigation: [
    {
      id: 'nav_dashboard',
      type: 'dashboard',
      dashboardName: 'spend_at_a_glance_dashboard',
      label: 'Spend at a Glance',
      icon: 'gauge',
    },
    {
      id: 'nav_request',
      type: 'object',
      objectName: 'procurement_request',
      label: 'Requests',
      icon: 'shopping-cart',
    },
    {
      id: 'nav_order',
      type: 'object',
      objectName: 'procurement_order',
      label: 'Orders',
      icon: 'file-check',
    },
    {
      id: 'nav_receipt',
      type: 'object',
      objectName: 'procurement_receipt',
      label: 'Receipts',
      icon: 'package',
    },
    {
      id: 'nav_vendor',
      type: 'object',
      objectName: 'procurement_vendor',
      label: 'Vendors',
      icon: 'building',
    },
  ],
});
