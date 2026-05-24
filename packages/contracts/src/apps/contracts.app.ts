// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { App } from '@objectstack/spec/ui';

export const ContractsApp = App.create({
  name: 'contracts',
  label: 'Contracts',
  description: 'Post-signature contract lifecycle on ObjectStack.',
  icon: 'file-text',
  branding: {
    primaryColor: '#0EA5E9',
  },

  navigation: [
    {
      id: 'nav_dashboard',
      type: 'dashboard',
      dashboardName: 'renewals_at_risk_dashboard',
      label: 'Renewals at Risk',
      icon: 'gauge',
    },
    {
      id: 'nav_contract',
      type: 'object',
      objectName: 'contracts_contract',
      label: 'Contracts',
      icon: 'file-text',
    },
    {
      id: 'nav_party',
      type: 'object',
      objectName: 'contracts_party',
      label: 'Parties',
      icon: 'building',
    },
    {
      id: 'nav_obligation',
      type: 'object',
      objectName: 'contracts_obligation',
      label: 'Obligations',
      icon: 'check-circle',
    },
  ],
});
