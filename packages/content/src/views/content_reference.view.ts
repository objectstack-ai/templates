// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Topic, competitor, and channel grids. Kept compact — the action is in
 * `content_piece` and `content_signal`; these are reference data.
 */
export const TopicViews = defineView({
  list: {
    type: 'grid',
    name: 'all_topics',
    label: 'All Topics',
    data: { provider: 'object', object: 'content_topic' },
    columns: [
      { field: 'title', width: 320, link: true, pinned: 'left' },
      { field: 'pillar', width: 180 },
      { field: 'funnel_stage', width: 150 },
      { field: 'priority', width: 110 },
      { field: 'owner', width: 150 },
      { field: 'visibility', width: 110 },
      { field: 'target_keyword', width: 200 },
    ],
    sort: [{ field: 'priority', order: 'desc' }],
    grouping: { fields: [{ field: 'pillar', order: 'asc' }] },
    pagination: { pageSize: 50 },
    exportOptions: ['csv'],
  },
});

export const CompetitorViews = defineView({
  list: {
    type: 'grid',
    name: 'all_competitors',
    label: 'All Competitors',
    data: { provider: 'object', object: 'content_competitor' },
    columns: [
      { field: 'name', width: 240, link: true, pinned: 'left' },
      { field: 'category', width: 180 },
      { field: 'website', width: 280 },
      { field: 'rss_feed', width: 280 },
    ],
    sort: [{ field: 'name', order: 'asc' }],
    grouping: { fields: [{ field: 'category', order: 'asc' }] },
    pagination: { pageSize: 50 },
  },
});

export const ChannelViews = defineView({
  list: {
    type: 'grid',
    name: 'all_channels',
    label: 'All Channels',
    data: { provider: 'object', object: 'content_channel' },
    columns: [
      { field: 'name', width: 200, link: true, pinned: 'left' },
      { field: 'kind', width: 130 },
      { field: 'default_cta_goal', width: 150 },
      { field: 'base_url', width: 280 },
      { field: 'active', width: 90, align: 'center' },
    ],
    sort: [{ field: 'name', order: 'asc' }],
    pagination: { pageSize: 25 },
  },
});

export const TemplateViews = defineView({
  list: {
    type: 'grid',
    name: 'all_templates',
    label: 'All Templates',
    data: { provider: 'object', object: 'content_template' },
    columns: [
      { field: 'name', width: 240, link: true, pinned: 'left' },
      { field: 'kind', width: 180 },
      { field: 'target_channel', width: 160 },
      { field: 'target_word_count', width: 130, align: 'right' },
    ],
    sort: [{ field: 'name', order: 'asc' }],
    grouping: { fields: [{ field: 'kind', order: 'asc' }] },
    pagination: { pageSize: 25 },
  },
});
