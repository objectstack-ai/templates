// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Content piece views — the editorial calendar's heart.
 *
 *   • all_pieces            — default grid, grouped by status
 *   • piece_board           — kanban auto-derived from status select
 *   • my_drafts             — assignee = me AND status in (backlog, drafting)
 *   • in_review_queue       — status = in_review (lead's queue)
 *   • editorial_calendar    — calendar view on publish_at
 *   • scheduled_pieces      — status = scheduled, sorted by publish_at
 *   • published_pieces      — status = published, sorted by published_at DESC
 *   • top_performers        — published, sorted by total_signups DESC, limited
 */
export const PieceViews = defineView({
  list: {
    type: 'grid',
    name: 'all_pieces',
    label: 'All Pieces',
    data: { provider: 'object', object: 'content_piece' },
    columns: [
      { field: 'title', width: 320, link: true, pinned: 'left', sortable: true },
      { field: 'status', width: 120, sortable: true },
      { field: 'format', width: 130, sortable: true },
      { field: 'topic', width: 180 },
      { field: 'assignee', width: 150 },
      { field: 'editor', width: 150 },
      { field: 'publish_at', width: 140, sortable: true },
      { field: 'total_views', width: 100, align: 'right' },
      { field: 'total_signups', width: 110, align: 'right' },
      { field: 'is_overdue', width: 90, align: 'center' },
    ],
    sort: [{ field: 'publish_at', order: 'asc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    selection: { type: 'multiple' },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: {
      allowedVisualizations: ['grid', 'kanban', 'calendar'],
    },
    tabs: [
      { name: 'all', label: 'All Pieces', view: 'all_pieces', isDefault: true, pinned: true },
      { name: 'my_drafts', label: 'My Drafts', icon: 'pen-tool', view: 'my_drafts' },
      { name: 'in_review', label: 'In Review', icon: 'check-circle', view: 'in_review_queue' },
      { name: 'calendar', label: 'Calendar', icon: 'calendar', view: 'editorial_calendar' },
      { name: 'scheduled', label: 'Scheduled', icon: 'clock', view: 'scheduled_pieces' },
      { name: 'published', label: 'Published', icon: 'send', view: 'published_pieces' },
      { name: 'top', label: 'Top Performers', icon: 'trophy', view: 'top_performers' },
      { name: 'board', label: 'Board', icon: 'columns', view: 'piece_board' },
    ],
    bulkActionDefs: [
      {
        name: 'reassign_writer',
        label: 'Reassign Writer',
        icon: 'user-check',
        operation: 'update',
        params: [
          {
            name: 'assignee',
            label: 'New Writer',
            type: 'lookup',
            object: 'sys_user',
            required: true,
          },
        ],
        confirmText: 'Reassign {{count}} piece(s)?',
      },
      {
        name: 'set_editor',
        label: 'Set Editor',
        icon: 'user',
        operation: 'update',
        params: [
          {
            name: 'editor',
            label: 'Editor',
            type: 'lookup',
            object: 'sys_user',
            required: true,
          },
        ],
      },
    ],
  },

  listViews: {
    piece_board: {
      name: 'piece_board',
      type: 'kanban',
      label: 'Piece Board',
      data: { provider: 'object', object: 'content_piece' },
      columns: ['title', 'format', 'assignee', 'publish_at'],
      kanban: {
        groupByField: 'status',
        columns: ['title', 'format', 'assignee', 'publish_at'],
      },
    },

    my_drafts: {
      name: 'my_drafts',
      type: 'grid',
      label: 'My Drafts',
      data: { provider: 'object', object: 'content_piece' },
      columns: ['title', 'topic', 'format', 'status', 'publish_at'],
      filter: [
        { field: 'assignee', operator: 'equals', value: '{current_user_id}' },
        { field: 'status', operator: 'in', value: ['backlog', 'drafting'] },
      ],
      sort: [{ field: 'publish_at', order: 'asc' }],
    },

    in_review_queue: {
      name: 'in_review_queue',
      type: 'grid',
      label: 'In Review',
      data: { provider: 'object', object: 'content_piece' },
      columns: ['title', 'topic', 'assignee', 'editor', 'submitted_at', 'publish_at'],
      filter: [{ field: 'status', operator: 'equals', value: 'in_review' }],
      sort: [{ field: 'submitted_at', order: 'asc' }],
    },

    editorial_calendar: {
      name: 'editorial_calendar',
      type: 'calendar',
      label: 'Editorial Calendar',
      data: { provider: 'object', object: 'content_piece' },
      columns: ['title', 'status', 'format'],
      filter: [{ field: 'publish_at', operator: 'is_not_null', value: null }],
      calendar: {
        startDateField: 'publish_at',
        titleField: 'title',
        colorField: 'status',
      },
    },

    scheduled_pieces: {
      name: 'scheduled_pieces',
      type: 'grid',
      label: 'Scheduled',
      data: { provider: 'object', object: 'content_piece' },
      columns: ['title', 'topic', 'format', 'assignee', 'publish_at', 'target_channels'],
      filter: [{ field: 'status', operator: 'equals', value: 'scheduled' }],
      sort: [{ field: 'publish_at', order: 'asc' }],
    },

    published_pieces: {
      name: 'published_pieces',
      type: 'grid',
      label: 'Published',
      data: { provider: 'object', object: 'content_piece' },
      columns: [
        'title',
        'topic',
        'format',
        'published_at',
        'total_views',
        'total_clicks',
        'total_signups',
      ],
      filter: [{ field: 'status', operator: 'equals', value: 'published' }],
      sort: [{ field: 'published_at', order: 'desc' }],
    },

    top_performers: {
      name: 'top_performers',
      type: 'grid',
      label: 'Top Performers',
      data: { provider: 'object', object: 'content_piece' },
      columns: ['title', 'topic', 'format', 'total_views', 'total_signups', 'total_revenue'],
      filter: [{ field: 'status', operator: 'equals', value: 'published' }],
      sort: [{ field: 'total_signups', order: 'desc' }],
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'content_piece' },
    sections: [
      {
        label: 'Piece',
        columns: 2,
        fields: [
          { field: 'title', required: true, colSpan: 2 },
          'topic',
          'template',
          'status',
          'format',
          'assignee',
          'editor',
          { field: 'target_channels', colSpan: 2 },
        ],
      },
      {
        label: 'Planning',
        columns: 2,
        fields: ['publish_at', 'word_count_target', 'submitted_at', 'approved_at', 'published_at'],
      },
      {
        label: 'Body',
        columns: 1,
        fields: ['summary', 'body_outline', 'body_draft'],
      },
      {
        label: 'Performance',
        columns: 4,
        fields: ['total_views', 'total_clicks', 'total_signups', 'total_revenue'],
      },
      {
        label: 'Metadata',
        columns: 2,
        fields: ['slug', 'tags', 'is_overdue', 'is_top_performer'],
      },
    ],
  },
});
