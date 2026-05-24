// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const ObligationViews = defineView({
  list: {
    type: 'grid',
    name: 'all_obligations',
    label: 'All Obligations',
    data: { provider: 'object', object: 'contracts_obligation' },
    columns: [
      { field: 'summary', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'contract', width: 200 },
      { field: 'obligor', width: 120 },
      { field: 'kind', width: 130, sortable: true },
      { field: 'status', width: 110, sortable: true },
      { field: 'due_date', width: 130, sortable: true },
      { field: 'amount', width: 130, align: 'right' },
      { field: 'assignee', width: 160 },
      { field: 'is_overdue', width: 100, align: 'center' },
    ],
    sort: [{ field: 'due_date', order: 'asc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    tabs: [
      { name: 'all', label: 'All', view: 'all_obligations', isDefault: true, pinned: true },
      { name: 'mine_open', label: 'My Open', icon: 'user', view: 'my_open_obligations' },
      { name: 'overdue', label: 'Overdue', icon: 'clock', view: 'overdue_obligations' },
    ],
  },

  listViews: {
    my_open_obligations: {
      name: 'my_open_obligations',
      type: 'grid',
      label: 'My Open Obligations',
      data: { provider: 'object', object: 'contracts_obligation' },
      columns: ['summary', 'contract', 'kind', 'due_date', 'amount'],
      filter: [
        { field: 'assignee', operator: 'equals', value: '{current_user_id}' },
        { field: 'status', operator: 'equals', value: 'open' },
      ],
      sort: [{ field: 'due_date', order: 'asc' }],
    },

    overdue_obligations: {
      name: 'overdue_obligations',
      type: 'grid',
      label: 'Overdue Obligations',
      data: { provider: 'object', object: 'contracts_obligation' },
      columns: ['summary', 'contract', 'assignee', 'kind', 'due_date', 'amount'],
      filter: [
        { field: 'status', operator: 'equals', value: 'open' },
        { field: 'due_date', operator: 'less_than', value: '{today}' },
      ],
      sort: [{ field: 'due_date', order: 'asc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'contracts_obligation' },
    sections: [
      {
        label: 'Obligation',
        columns: 2,
        fields: [
          { field: 'summary', required: true, colSpan: 2 },
          'contract',
          'obligor',
          'kind',
          'status',
          'due_date',
          'amount',
          'assignee',
        ],
      },
      {
        label: 'Notes',
        columns: 1,
        fields: ['notes'],
      },
    ],
  },
});
