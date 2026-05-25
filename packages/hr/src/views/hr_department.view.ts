// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const DepartmentViews = defineView({
  list: {
    type: 'grid',
    name: 'all_departments',
    label: 'All Departments',
    data: { provider: 'object', object: 'hr_department' },
    columns: [
      { field: 'name', width: 240, link: true, pinned: 'left', sortable: true },
      { field: 'code', width: 120 },
      { field: 'parent', width: 220 },
      { field: 'head', width: 220 },
    ],
    sort: [{ field: 'name', order: 'asc' }],
    pagination: { pageSize: 50 },
    exportOptions: ['csv'],
    appearance: { allowedVisualizations: ['grid'] },
  },

  form: {
    type: 'simple',
    data: { provider: 'object', object: 'hr_department' },
    sections: [
      {
        label: 'Department',
        columns: 2,
        fields: ['name', 'code', 'parent', 'head', 'description'],
      },
    ],
  },
});
