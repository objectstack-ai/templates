// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { App } from '@objectstack/spec/ui';

export const HelpdeskApp = App.create({
  name: 'helpdesk',
  label: 'AI Helpdesk',
  description: 'AI-first customer support on ObjectStack.',
  icon: 'life-buoy',
  branding: { primaryColor: '#A855F7' },

  navigation: [
    {
      id: 'nav_workbench',
      type: 'dashboard',
      dashboardName: 'agent_workbench_dashboard',
      label: 'My Workbench',
      icon: 'sparkles',
    },
    {
      id: 'nav_manager',
      type: 'dashboard',
      dashboardName: 'manager_overview_dashboard',
      label: 'Manager Overview',
      icon: 'bar-chart-3',
    },
    { id: 'nav_tickets', type: 'object', objectName: 'helpdesk_ticket', label: 'Tickets', icon: 'life-buoy' },
    { id: 'nav_messages', type: 'object', objectName: 'helpdesk_message', label: 'Messages', icon: 'message-circle' },
    { id: 'nav_customers', type: 'object', objectName: 'helpdesk_customer', label: 'Customers', icon: 'user' },
    { id: 'nav_kb', type: 'object', objectName: 'helpdesk_kb_article', label: 'Knowledge Base', icon: 'book-open' },
    { id: 'nav_teams', type: 'object', objectName: 'helpdesk_team', label: 'Teams', icon: 'users' },
    { id: 'nav_sla', type: 'object', objectName: 'helpdesk_sla_policy', label: 'SLA Policies', icon: 'clock' },
  ],
});
