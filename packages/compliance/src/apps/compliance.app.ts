// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { App } from '@objectstack/spec/ui';

export const ComplianceApp = App.create({
  name: 'compliance',
  label: 'Compliance',
  description: 'Compliance posture & evidence management on ObjectStack.',
  icon: 'shield-check',
  branding: { primaryColor: '#7C3AED' },

  navigation: [
    {
      id: 'nav_dashboard',
      type: 'dashboard',
      dashboardName: 'control_posture_dashboard',
      label: 'Control Posture',
      icon: 'gauge',
    },
    {
      id: 'nav_framework',
      type: 'object',
      objectName: 'compliance_framework',
      label: 'Frameworks',
      icon: 'shield-check',
    },
    {
      id: 'nav_control',
      type: 'object',
      objectName: 'compliance_control',
      label: 'Controls',
      icon: 'shield',
    },
    {
      id: 'nav_evidence',
      type: 'object',
      objectName: 'compliance_evidence',
      label: 'Evidence',
      icon: 'paperclip',
    },
    {
      id: 'nav_assessment',
      type: 'object',
      objectName: 'compliance_assessment',
      label: 'Assessments',
      icon: 'clipboard-check',
    },
  ],
});
