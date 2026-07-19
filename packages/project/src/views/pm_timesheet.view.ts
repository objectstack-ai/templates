// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Timesheet views — daily effort entries, grouped by project, with a billable
 * tab. Timesheets record effort (hours); the project's actual_cost is computed
 * externally (hours × rate), not rolled up from these rows.
 */
export const TimesheetViews = defineView({
  list: {
    type: 'grid',
    name: 'all_timesheets',
    label: 'All Time Entries',
    data: { provider: 'object', object: 'pm_timesheet' },
    columns: [
      { field: 'work_date', width: 130, link: true, pinned: 'left', sortable: true },
      { field: 'person', width: 160, sortable: true },
      { field: 'project', width: 200, sortable: true },
      { field: 'hours', width: 100, align: 'right', sortable: true },
      { field: 'billable', width: 100, align: 'center', sortable: true },
      { field: 'description', width: 320 },
    ],
    sort: [{ field: 'work_date', order: 'desc' }],
    grouping: { fields: [{ field: 'project', order: 'asc', collapsed: false }] },
    selection: { type: 'multiple' },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: { allowedVisualizations: ['grid'] },
    tabs: [
      {
        name: 'all',
        label: 'All Time Entries',
        view: 'all_timesheets',
        isDefault: true,
        pinned: true,
      },
      { name: 'billable', label: 'Billable', icon: 'dollar-sign', view: 'billable_timesheets' },
    ],
  },

  listViews: {
    billable_timesheets: {
      name: 'billable_timesheets',
      type: 'grid',
      label: 'Billable Time',
      data: { provider: 'object', object: 'pm_timesheet' },
      filter: [{ field: 'billable', operator: 'equals', value: true }],
      columns: [
        { field: 'work_date', width: 130, link: true, pinned: 'left' },
        { field: 'person', width: 160 },
        { field: 'project', width: 200 },
        { field: 'hours', width: 100, align: 'right' },
      ],
      sort: [{ field: 'work_date', order: 'desc' }],
    },
  },
});
