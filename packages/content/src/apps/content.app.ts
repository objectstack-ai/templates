// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { App } from '@objectstack/spec/ui';

export const ContentApp = App.create({
  name: 'content',
  label: 'Content',
  description: 'Content marketing engine — pipeline, publish, measure.',
  icon: 'file-text',
  branding: {
    primaryColor: '#8B5CF6',
  },

  navigation: [
    {
      id: 'nav_today',
      type: 'dashboard',
      dashboardName: 'today_workbench_dashboard',
      label: 'Today',
      icon: 'gauge',
    },
    {
      id: 'nav_calendar',
      type: 'dashboard',
      dashboardName: 'editorial_calendar_dashboard',
      label: 'Calendar',
      icon: 'calendar',
    },
    {
      id: 'nav_roi',
      type: 'dashboard',
      dashboardName: 'roi_by_channel_dashboard',
      label: 'ROI',
      icon: 'trending-up',
    },
    {
      id: 'nav_piece',
      type: 'object',
      objectName: 'content_piece',
      label: 'Pieces',
      icon: 'file-text',
    },
    {
      id: 'nav_topic',
      type: 'object',
      objectName: 'content_topic',
      label: 'Topics',
      icon: 'lightbulb',
    },
    {
      id: 'nav_signal',
      type: 'object',
      objectName: 'content_signal',
      label: 'Signals',
      icon: 'rss',
    },
    {
      id: 'nav_publication',
      type: 'object',
      objectName: 'content_publication',
      label: 'Publications',
      icon: 'send',
    },
    {
      id: 'nav_competitor',
      type: 'object',
      objectName: 'content_competitor',
      label: 'Competitors',
      icon: 'eye',
    },
    {
      id: 'nav_channel',
      type: 'object',
      objectName: 'content_channel',
      label: 'Channels',
      icon: 'megaphone',
    },
    {
      id: 'nav_template',
      type: 'object',
      objectName: 'content_template',
      label: 'Templates',
      icon: 'layout-template',
    },
  ],
});
