// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const AssessmentViews = defineView({
  list: {
    type: 'grid',
    name: 'all_assessments',
    label: 'All Assessments',
    data: { provider: 'object', object: 'compliance_assessment' },
    columns: [
      { field: 'title', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'control', width: 200 },
      { field: 'cycle', width: 120, sortable: true },
      { field: 'status', width: 130, sortable: true },
      { field: 'assessed_at', width: 160, sortable: true },
      { field: 'assessor', width: 160 },
      { field: 'remediation_due', width: 150, sortable: true },
    ],
    sort: [{ field: 'assessed_at', order: 'desc' }],
    grouping: { fields: [{ field: 'cycle', order: 'desc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    tabs: [
      { name: 'all', label: 'All', view: 'all_assessments', isDefault: true, pinned: true },
      { name: 'failed', label: 'Failed', icon: 'alert-triangle', view: 'failed_assessments' },
      { name: 'in_progress', label: 'In Progress', icon: 'play', view: 'in_progress_assessments' },
    ],
  },

  listViews: {
    failed_assessments: {
      name: 'failed_assessments',
      type: 'grid',
      label: 'Failed Assessments',
      data: { provider: 'object', object: 'compliance_assessment' },
      columns: ['title', 'control', 'cycle', 'assessed_at', 'remediation_due', 'assessor'],
      filter: [{ field: 'status', operator: 'in', value: ['failed', 'partial'] }],
      sort: [{ field: 'remediation_due', order: 'asc' }],
    },

    in_progress_assessments: {
      name: 'in_progress_assessments',
      type: 'grid',
      label: 'In Progress',
      data: { provider: 'object', object: 'compliance_assessment' },
      columns: ['title', 'control', 'cycle', 'assessor'],
      filter: [{ field: 'status', operator: 'equals', value: 'in_progress' }],
      sort: [{ field: 'cycle', order: 'desc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'compliance_assessment' },
    sections: [
      {
        label: 'Assessment',
        columns: 2,
        fields: [
          { field: 'title', required: true, colSpan: 2 },
          'control',
          'cycle',
          'status',
          'assessor',
          'assessed_at',
        ],
      },
      { label: 'Finding', columns: 1, fields: ['finding'] },
      { label: 'Remediation', columns: 2, fields: ['remediation_due', 'remediation_plan'] },
    ],
  },
});
