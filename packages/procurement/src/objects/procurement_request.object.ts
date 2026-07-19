// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F } from '@objectstack/spec';
/**
 * Purchase Request — what someone wants to buy. Goes through approval,
 * then is converted into one Purchase Order by the
 * `procurement_pr_to_po` flow.
 *
 * Approval is threshold-driven: `approval_required` flips true when
 * `estimated_amount >= 5000`. Below that, a PR may go straight to PO once
 * "submitted" (the conversion flow honors the threshold). Tune in your fork.
 */
export const PurchaseRequest = ObjectSchema.create({
  name: 'procurement_request',
  sharingModel: 'private',
  label: 'Purchase Request',
  pluralLabel: 'Purchase Requests',
  icon: 'shopping-cart',
  description:
    'An employee request to buy something. Approved PRs are converted into POs sent to a vendor.',

  fieldGroups: [
    { key: 'core', label: 'Request', icon: 'shopping-cart' },
    { key: 'commercial', label: 'Commercial', icon: 'dollar-sign' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    title: Field.text({
      label: 'Title',
      required: true,
      searchable: true,
      maxLength: 200,
      group: 'core',
      description: 'One-line summary. e.g. "10x Dell P2723D monitors".',
    }),
    request_number: Field.text({
      label: 'PR Number',
      unique: true,
      maxLength: 40,
      group: 'core',
    }),
    requester: Field.lookup('sys_user', {
      label: 'Requester',
      group: 'core',
      description: 'Person making the request. Defaults to created_by.',
    }),
    vendor: Field.lookup('procurement_vendor', {
      label: 'Preferred Vendor',
      group: 'core',
    }),
    category: Field.select({
      label: 'Category',
      group: 'core',
      options: [
        { label: 'Software / SaaS', value: 'saas', default: true },
        { label: 'Hardware', value: 'hardware' },
        { label: 'Professional Services', value: 'services' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Facilities', value: 'facilities' },
        { label: 'Other', value: 'other' },
      ],
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Draft', value: 'draft', color: '#94A3B8', default: true },
        { label: 'Submitted', value: 'submitted', color: '#F59E0B' },
        { label: 'Approved', value: 'approved', color: '#10B981' },
        { label: 'Rejected', value: 'rejected', color: '#EF4444' },
        { label: 'Converted to PO', value: 'converted', color: '#3B82F6' },
      ],
    }),
    justification: Field.markdown({
      label: 'Business Justification',
      group: 'core',
      description: 'Why we need this. Visible to approvers.',
    }),
    estimated_amount: Field.currency({
      label: 'Estimated Amount',
      group: 'commercial',
      min: 0,
    }),
    needed_by: Field.date({
      label: 'Needed By',
      group: 'commercial',
    }),
    cost_center: Field.text({
      label: 'Cost Center',
      maxLength: 60,
      group: 'commercial',
    }),
    approval_required: Field.formula({
      label: 'Approval Required',
      group: 'commercial',
      expression: F`record.estimated_amount != null && record.estimated_amount >= 5000`,
    }),
    converted_po: Field.lookup('procurement_order', {
      label: 'Converted PO',
      group: 'meta',
      description: 'Set by the PR→PO conversion flow once approved.',
    }),
    notes: Field.markdown({ label: 'Internal Notes', group: 'meta' }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['status'] },
    { fields: ['vendor'] },
    { fields: ['requester'] },
    { fields: ['needed_by'] },
  ],

  nameField: 'title',
  highlightFields: ['title', 'vendor', 'estimated_amount', 'status', 'needed_by'],

  validations: [
    {
      type: 'state_machine',
      name: 'pr_lifecycle',
      field: 'status',
      transitions: {
        draft: ['submitted'],
        submitted: ['approved', 'rejected', 'draft'],
        approved: ['converted'],
        rejected: ['draft'],
        converted: [],
      },
      message: 'Illegal status transition.',
    },
    {
      name: 'submitted_requires_amount',
      type: 'script',
      severity: 'error',
      message: 'Submitted PRs must have an estimated amount.',
      condition: P`record.status == "submitted" && record.estimated_amount == null`,
    },
    {
      name: 'submitted_requires_justification',
      type: 'script',
      severity: 'error',
      message: 'Submitted PRs must include a business justification.',
      condition: P`record.status == "submitted" && (record.justification == null || record.justification == "")`,
    },
  ],
});
