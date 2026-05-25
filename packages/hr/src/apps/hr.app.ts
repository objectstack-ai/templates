// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { App } from '@objectstack/spec/ui';

export const HrApp = App.create({
  name: 'hr',
  label: 'HR',
  description: 'People directory, time-off, and document expiry on ObjectStack.',
  icon: 'users',
  branding: { primaryColor: '#0EA5E9' },

  navigation: [
    {
      id: 'nav_dashboard',
      type: 'dashboard',
      dashboardName: 'hr_admin_dashboard',
      label: 'HR Dashboard',
      icon: 'gauge',
    },
    { id: 'nav_employee', type: 'object', objectName: 'hr_employee', label: 'Employees', icon: 'user' },
    { id: 'nav_department', type: 'object', objectName: 'hr_department', label: 'Departments', icon: 'building' },
    { id: 'nav_time_off', type: 'object', objectName: 'hr_time_off_request', label: 'Time-Off', icon: 'calendar-off' },
    { id: 'nav_document', type: 'object', objectName: 'hr_document', label: 'Documents', icon: 'file-text' },
  ],
});
