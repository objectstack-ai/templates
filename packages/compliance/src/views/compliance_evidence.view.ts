// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const EvidenceViews = defineView({
  list: {
    type: 'grid',
    name: 'all_evidence',
    label: 'All Evidence',
    data: { provider: 'object', object: 'compliance_evidence' },
    columns: [
      { field: 'title', width: 300, link: true, pinned: 'left', sortable: true },
      { field: 'control', width: 200 },
      { field: 'evidence_type', width: 160, sortable: true },
      { field: 'status', width: 130, sortable: true },
      { field: 'collected_on', width: 130, sortable: true },
      { field: 'expires_on', width: 130, sortable: true },
      { field: 'is_expiring_soon', width: 130, align: 'center' },
      { field: 'is_expired', width: 110, align: 'center' },
      { field: 'collected_by', width: 160 },
    ],
    sort: [{ field: 'expires_on', order: 'asc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    tabs: [
      { name: 'all', label: 'All', view: 'all_evidence', isDefault: true, pinned: true },
      { name: 'pending', label: 'Pending Review', icon: 'inbox', view: 'pending_evidence' },
      { name: 'expiring', label: 'Expiring ≤ 30d', icon: 'clock', view: 'expiring_evidence' },
    ],
  },

  listViews: {
    pending_evidence: {
      name: 'pending_evidence',
      type: 'grid',
      label: 'Pending Review',
      data: { provider: 'object', object: 'compliance_evidence' },
      columns: ['title', 'control', 'evidence_type', 'collected_on', 'collected_by'],
      filter: [{ field: 'status', operator: 'equals', value: 'submitted' }],
      sort: [{ field: 'collected_on', order: 'asc' }],
    },

    expiring_evidence: {
      name: 'expiring_evidence',
      type: 'grid',
      label: 'Expiring ≤ 30 Days',
      data: { provider: 'object', object: 'compliance_evidence' },
      columns: ['title', 'control', 'evidence_type', 'expires_on', 'collected_by'],
      filter: [
        { field: 'status', operator: 'equals', value: 'approved' },
        { field: 'expires_on', operator: 'gte', value: '{today}' },
        { field: 'expires_on', operator: 'lte', value: '{30_days_from_now}' },
      ],
      sort: [{ field: 'expires_on', order: 'asc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'compliance_evidence' },
    sections: [
      {
        label: 'Evidence',
        columns: 2,
        fields: [
          { field: 'title', required: true, colSpan: 2 },
          'control',
          'evidence_type',
          'status',
          { field: 'description', colSpan: 2 },
        ],
      },
      {
        label: 'Lifecycle',
        columns: 2,
        fields: [
          'collected_on',
          'expires_on',
          'collected_by',
          'approved_by',
          'is_expiring_soon',
          'is_expired',
        ],
      },
      { label: 'Source / Notes', columns: 1, fields: ['source_url', 'notes'] },
    ],
  },
});
