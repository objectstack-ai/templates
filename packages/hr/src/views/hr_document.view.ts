// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const EmployeeDocumentViews = defineView({
  list: {
    type: 'grid',
    name: 'all_documents',
    label: 'All Documents',
    data: { provider: 'object', object: 'hr_document' },
    columns: [
      { field: 'name', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'employee', width: 200 },
      { field: 'doc_type', width: 160, sortable: true },
      { field: 'issued_on', width: 130, sortable: true },
      { field: 'expires_at', width: 130, sortable: true },
      { field: 'is_expiring_soon', width: 130, align: 'center' },
      { field: 'is_expired', width: 110, align: 'center' },
    ],
    sort: [{ field: 'expires_at', order: 'asc' }],
    grouping: { fields: [{ field: 'doc_type', order: 'asc', collapsed: false }] },
    pagination: { pageSize: 50 },
    exportOptions: ['csv'],
    appearance: { allowedVisualizations: ['grid'] },
    tabs: [
      { name: 'all', label: 'All', view: 'all_documents', isDefault: true, pinned: true },
      {
        name: 'expiring',
        label: 'Expiring Soon',
        icon: 'alert-triangle',
        view: 'expiring_documents',
      },
      { name: 'expired', label: 'Expired', icon: 'x-circle', view: 'expired_documents' },
    ],
  },

  listViews: {
    expiring_documents: {
      name: 'expiring_documents',
      type: 'grid',
      label: 'Expiring Soon',
      data: { provider: 'object', object: 'hr_document' },
      columns: ['name', 'employee', 'doc_type', 'expires_at'],
      filter: [
        { field: 'expires_at', operator: 'greater_than_or_equal', value: '{today}' },
        { field: 'expires_at', operator: 'less_than_or_equal', value: '{today+30}' },
      ],
      sort: [{ field: 'expires_at', order: 'asc' }],
    },
    expired_documents: {
      name: 'expired_documents',
      type: 'grid',
      label: 'Expired',
      data: { provider: 'object', object: 'hr_document' },
      columns: ['name', 'employee', 'doc_type', 'expires_at'],
      filter: [{ field: 'expires_at', operator: 'less_than', value: '{today}' }],
      sort: [{ field: 'expires_at', order: 'desc' }],
    },
  },

  form: {
    type: 'simple',
    data: { provider: 'object', object: 'hr_document' },
    sections: [
      {
        label: 'Document',
        columns: 2,
        fields: ['name', 'employee', 'doc_type', 'issued_on', 'expires_at'],
      },
      { label: 'Notes', columns: 1, fields: ['notes'] },
    ],
  },
});
