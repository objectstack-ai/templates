// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Issue views — grid by type
 */
export const IssueViews = defineView({
  list: {
    type: 'grid',
    name: 'all_issues',
    label: 'All Issues',
    data: { provider: 'object', object: 'pm_issue' },
    columns: [
      { field: 'issue_number', width: 130, link: true, pinned: 'left', sortable: true },
      { field: 'name', width: 280, sortable: true },
      { field: 'project', width: 160, sortable: true },
      { field: 'type', width: 100, sortable: true },
      { field: 'status', width: 100, sortable: true },
      { field: 'severity', width: 100, sortable: true },
      { field: 'assigned_to', width: 140 },
      { field: 'reported_at', width: 120, sortable: true },
      { field: 'resolved_at', width: 120 },
    ],
    sort: [
      { field: 'severity', order: 'desc' },
      { field: 'reported_at', order: 'desc' },
    ],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    selection: { type: 'multiple' },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: {
      allowedVisualizations: ['grid', 'kanban'],
    },
    tabs: [
      { name: 'all', label: 'All Issues', view: 'all_issues', isDefault: true, pinned: true },
      { name: 'open', label: 'Open', icon: 'circle', view: 'open_issues' },
      { name: 'bugs', label: 'Bugs', icon: 'bug', view: 'bug_issues' },
      { name: 'blockers', label: 'Blockers', icon: 'octagon', view: 'blocker_issues' },
    ],
  },

  listViews: {
    open_issues: {
      name: 'open_issues',
      type: 'grid',
      label: 'Open Issues',
      data: { provider: 'object', object: 'pm_issue' },
      filter: [{ field: 'status', operator: 'equals', value: 'open' }],
      columns: [
        { field: 'issue_number', width: 130, link: true, pinned: 'left' },
        { field: 'name', width: 280 },
        { field: 'project', width: 160 },
        { field: 'type', width: 100 },
        { field: 'severity', width: 100 },
        { field: 'assigned_to', width: 140 },
        { field: 'reported_at', width: 120 },
      ],
      sort: [{ field: 'severity', order: 'desc' }],
    },

    bug_issues: {
      name: 'bug_issues',
      type: 'grid',
      label: 'Bugs',
      data: { provider: 'object', object: 'pm_issue' },
      filter: [{ field: 'type', operator: 'equals', value: 'bug' }],
      columns: [
        { field: 'issue_number', width: 130, link: true, pinned: 'left' },
        { field: 'name', width: 280 },
        { field: 'project', width: 160 },
        { field: 'status', width: 100 },
        { field: 'severity', width: 100 },
        { field: 'assigned_to', width: 140 },
      ],
      sort: [
        { field: 'status', order: 'asc' },
        { field: 'severity', order: 'desc' },
      ],
    },

    blocker_issues: {
      name: 'blocker_issues',
      type: 'grid',
      label: 'Blockers',
      data: { provider: 'object', object: 'pm_issue' },
      filter: [
        { field: 'type', operator: 'equals', value: 'blocker' },
        { field: 'status', operator: 'equals', value: 'open' },
      ],
      columns: [
        { field: 'issue_number', width: 130, link: true, pinned: 'left' },
        { field: 'name', width: 280 },
        { field: 'project', width: 160 },
        { field: 'severity', width: 100 },
        { field: 'description', width: 350 },
        { field: 'assigned_to', width: 140 },
      ],
      sort: [{ field: 'reported_at', order: 'asc' }],
    },
  },
});
