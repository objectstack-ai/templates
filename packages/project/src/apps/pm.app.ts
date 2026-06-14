// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { App } from '@objectstack/spec/ui';

/**
 * Project Management app — navigation structure for the PM workspace.
 */
export const ProjectApp = App.create({
  name: 'pm',
  label: 'Project Management',
  icon: 'briefcase',
  branding: {
    primaryColor: '#3B82F6',
  },

  navigation: [
    {
      id: 'nav_projects',
      type: 'object',
      objectName: 'pm_project',
      label: 'Projects',
      icon: 'folder',
    },
    {
      id: 'nav_milestones',
      type: 'object',
      objectName: 'pm_milestone',
      label: 'Milestones',
      icon: 'flag',
    },
    {
      id: 'nav_risks',
      type: 'object',
      objectName: 'pm_risk',
      label: 'Risks',
      icon: 'alert-triangle',
    },
    {
      id: 'nav_issues',
      type: 'object',
      objectName: 'pm_issue',
      label: 'Issues',
      icon: 'circle',
    },
    {
      id: 'nav_resources',
      type: 'object',
      objectName: 'pm_resource',
      label: 'Resources',
      icon: 'users',
    },
    {
      id: 'nav_timesheets',
      type: 'object',
      objectName: 'pm_timesheet',
      label: 'Timesheets',
      icon: 'clock',
    },
    {
      id: 'nav_pmo_overview',
      type: 'dashboard',
      dashboardName: 'pmo_overview_dashboard',
      label: 'PMO Overview',
      icon: 'layout-dashboard',
    },
    {
      id: 'nav_pm_workbench',
      type: 'dashboard',
      dashboardName: 'pm_workbench_dashboard',
      label: 'PM Workbench',
      icon: 'gauge',
    },
  ],
});
