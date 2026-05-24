// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

/**
 * Contract views — grid (primary), pipeline kanban (by status), expiring,
 * and high-value-pending-approval.
 */
export const ContractViews = defineView({
  list: {
    type: 'grid',
    name: 'all_contracts',
    label: 'All Contracts',
    data: { provider: 'object', object: 'contracts_contract' },
    columns: [
      { field: 'title', width: 280, link: true, pinned: 'left', sortable: true },
      { field: 'party', width: 200 },
      { field: 'contract_type', width: 120, sortable: true },
      { field: 'status', width: 120, sortable: true },
      { field: 'total_value', width: 140, align: 'right', sortable: true },
      { field: 'end_date', width: 130, sortable: true },
      { field: 'is_expiring_soon', width: 130, align: 'center' },
      { field: 'auto_renew', width: 100, align: 'center' },
      { field: 'owner', width: 160 },
    ],
    sort: [{ field: 'end_date', order: 'asc' }],
    grouping: { fields: [{ field: 'status', order: 'asc', collapsed: false }] },
    selection: { type: 'multiple' },
    pagination: { pageSize: 50, pageSizeOptions: [25, 50, 100] },
    exportOptions: ['csv', 'xlsx'],
    appearance: {
      allowedVisualizations: ['grid', 'kanban'],
    },
    tabs: [
      { name: 'all', label: 'All', view: 'all_contracts', isDefault: true, pinned: true },
      { name: 'mine', label: 'My Contracts', icon: 'user', view: 'my_contracts' },
      { name: 'expiring', label: 'Expiring ≤ 60d', icon: 'clock', view: 'expiring_contracts' },
      { name: 'pending', label: 'Pending Approval', icon: 'check', view: 'pending_approval_contracts' },
    ],
    bulkActionDefs: [
      {
        name: 'reassign_owner',
        label: 'Reassign Owner',
        icon: 'user-check',
        operation: 'update',
        params: [
          {
            name: 'owner',
            label: 'New Owner',
            type: 'lookup',
            object: 'user',
            required: true,
          },
        ],
        confirmText: 'Reassign {{count}} contract(s)?',
      },
    ],
  },

  listViews: {
    contract_pipeline: {
      name: 'contract_pipeline',
      type: 'kanban',
      label: 'Contract Pipeline',
      data: { provider: 'object', object: 'contracts_contract' },
      columns: ['title', 'party', 'total_value', 'end_date'],
      kanban: {
        groupByField: 'status',
        columns: ['title', 'party', 'total_value', 'end_date'],
      },
    },

    my_contracts: {
      name: 'my_contracts',
      type: 'grid',
      label: 'My Contracts',
      data: { provider: 'object', object: 'contracts_contract' },
      columns: ['title', 'party', 'contract_type', 'status', 'end_date', 'total_value'],
      filter: [
        { field: 'owner', operator: 'equals', value: '{current_user_id}' },
        { field: 'status', operator: 'in', value: ['draft', 'in_review', 'signed', 'active'] },
      ],
      sort: [{ field: 'end_date', order: 'asc' }],
    },

    expiring_contracts: {
      name: 'expiring_contracts',
      type: 'grid',
      label: 'Expiring Soon',
      data: { provider: 'object', object: 'contracts_contract' },
      columns: ['title', 'party', 'end_date', 'is_expiring_soon', 'auto_renew', 'owner'],
      filter: [
        { field: 'status', operator: 'equals', value: 'active' },
        { field: 'end_date', operator: 'lte', value: '{60_days_from_now}' },
        { field: 'end_date', operator: 'gte', value: '{today}' },
      ],
      sort: [{ field: 'end_date', order: 'asc' }],
    },

    pending_approval_contracts: {
      name: 'pending_approval_contracts',
      type: 'grid',
      label: 'Pending Approval',
      data: { provider: 'object', object: 'contracts_contract' },
      columns: ['title', 'party', 'contract_type', 'total_value', 'owner'],
      filter: [
        { field: 'status', operator: 'equals', value: 'in_review' },
        { field: 'total_value', operator: 'gte', value: 50000 },
      ],
      sort: [{ field: 'total_value', order: 'desc' }],
    },
  },

  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'contracts_contract' },
    sections: [
      {
        label: 'Contract',
        columns: 2,
        fields: [
          { field: 'title', required: true, colSpan: 2 },
          'party',
          'contract_type',
          'status',
          'owner',
          { field: 'contract_number', colSpan: 2 },
        ],
      },
      {
        label: 'Commercial',
        columns: 2,
        fields: ['total_value', 'payment_terms', 'approval_required'],
      },
      {
        label: 'Dates & Renewal',
        columns: 2,
        fields: ['effective_date', 'end_date', 'signed_date', 'auto_renew', 'renewal_notice_days'],
      },
      {
        label: 'AI Extracted',
        columns: 1,
        fields: ['extracted_clauses', 'extraction_confidence', 'extracted_at'],
      },
      {
        label: 'Notes',
        columns: 1,
        fields: ['tags', 'notes'],
      },
    ],
  },
});
