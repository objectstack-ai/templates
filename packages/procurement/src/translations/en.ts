// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * English (en) — Procurement App Translations
 */
export const en: TranslationData = {
  objects: {
    procurement_vendor: {
      label: 'Vendor',
      pluralLabel: 'Vendors',
      description: 'A supplier you place purchase orders against.',
      fields: {
        name: { label: 'Legal Name' },
        vendor_code: { label: 'Vendor Code' },
        category: {
          label: 'Category',
          options: {
            saas: 'Software / SaaS',
            hardware: 'Hardware',
            services: 'Professional Services',
            marketing: 'Marketing',
            facilities: 'Facilities',
            other: 'Other',
          },
        },
        status: {
          label: 'Status',
          options: {
            active: 'Active',
            onboarding: 'Pending Onboarding',
            suspended: 'Suspended',
            archived: 'Archived',
          },
        },
        default_payment_terms: {
          label: 'Default Payment Terms',
          options: {
            net_15: 'Net 15',
            net_30: 'Net 30',
            net_45: 'Net 45',
            net_60: 'Net 60',
            upfront: 'Upfront',
          },
        },
        risk_tier: {
          label: 'Risk Tier',
          options: { low: 'Low', medium: 'Medium', high: 'High' },
        },
        is_preferred: { label: 'Preferred Vendor' },
        country: { label: 'Country' },
        website: { label: 'Website' },
        primary_contact_name: { label: 'Primary Contact' },
        primary_contact_email: { label: 'Primary Contact Email' },
        notes: { label: 'Notes' },
      },
    },

    procurement_request: {
      label: 'Purchase Request',
      pluralLabel: 'Purchase Requests',
      description: 'An employee request to buy something. Approved PRs become POs.',
      fields: {
        title: { label: 'Title' },
        request_number: { label: 'PR Number' },
        requester: { label: 'Requester' },
        vendor: { label: 'Preferred Vendor' },
        category: {
          label: 'Category',
          options: {
            saas: 'Software / SaaS',
            hardware: 'Hardware',
            services: 'Professional Services',
            marketing: 'Marketing',
            facilities: 'Facilities',
            other: 'Other',
          },
        },
        status: {
          label: 'Status',
          options: {
            draft: 'Draft',
            submitted: 'Submitted',
            approved: 'Approved',
            rejected: 'Rejected',
            converted: 'Converted to PO',
          },
        },
        justification: { label: 'Business Justification' },
        estimated_amount: { label: 'Estimated Amount' },
        needed_by: { label: 'Needed By' },
        cost_center: { label: 'Cost Center' },
        approval_required: { label: 'Approval Required' },
        converted_po: { label: 'Converted PO' },
        notes: { label: 'Internal Notes' },
      },
      _views: {
        all_requests: { label: 'All Requests', description: 'Every request, grouped by status' },
        request_pipeline: { label: 'Request Pipeline', description: 'Kanban grouped by status' },
        my_requests: { label: 'My Requests', description: 'Requests where you are the requester' },
        awaiting_approval: {
          label: 'Awaiting Approval',
          description: 'Submitted PRs above the approval threshold',
        },
      },
    },

    procurement_order: {
      label: 'Purchase Order',
      pluralLabel: 'Purchase Orders',
      description:
        'A commitment to a vendor. Created from an approved PR; closed when fully received.',
      fields: {
        po_number: { label: 'PO Number' },
        vendor: { label: 'Vendor' },
        source_request: { label: 'From Request' },
        status: {
          label: 'Status',
          options: {
            draft: 'Draft',
            sent: 'Sent',
            partial: 'Partial Receipt',
            received: 'Received',
            closed: 'Closed',
            cancelled: 'Cancelled',
          },
        },
        owner: { label: 'Buyer' },
        total_amount: { label: 'Total Amount' },
        received_amount: { label: 'Received Amount' },
        payment_terms: {
          label: 'Payment Terms',
          options: {
            net_15: 'Net 15',
            net_30: 'Net 30',
            net_45: 'Net 45',
            net_60: 'Net 60',
            upfront: 'Upfront',
          },
        },
        is_fully_received: { label: 'Fully Received' },
        match_status: { label: 'Match Status' },
        cost_center: { label: 'Cost Center' },
        order_date: { label: 'Order Date' },
        expected_delivery: { label: 'Expected Delivery' },
        actual_delivery: { label: 'Actual Delivery' },
        is_delivery_overdue: { label: 'Delivery Overdue' },
        lines: { label: 'Line Items' },
        notes: { label: 'Internal Notes' },
      },
      _views: {
        all_orders: { label: 'All Orders', description: 'Every PO, grouped by status' },
        order_pipeline: { label: 'Order Pipeline', description: 'Kanban grouped by status' },
        open_orders: { label: 'Open Orders', description: 'Sent and partially-received POs' },
        overdue_orders: { label: 'Overdue Orders', description: 'Open POs past expected_delivery' },
      },
    },

    procurement_receipt: {
      label: 'Goods Receipt',
      pluralLabel: 'Goods Receipts',
      description: 'A receiving event recording what arrived against a PO.',
      fields: {
        receipt_number: { label: 'Receipt Number' },
        purchase_order: { label: 'Purchase Order' },
        received_at: { label: 'Received At' },
        received_by: { label: 'Received By' },
        quality: {
          label: 'Quality',
          options: { accepted: 'Accepted', partial: 'Partial', rejected: 'Rejected' },
        },
        received_value: { label: 'Received Value' },
        notes: { label: 'Notes' },
      },
    },
  },

  apps: {
    procurement: {
      label: 'Procurement',
      description: 'Source-to-pay procurement on ObjectStack.',
      navigation: {
        nav_dashboard: { label: 'Spend at a Glance' },
        nav_request: { label: 'Requests' },
        nav_order: { label: 'Orders' },
        nav_receipt: { label: 'Receipts' },
        nav_vendor: { label: 'Vendors' },
      },
    },
  },

  messages: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'success.saved': 'Saved successfully',
    'success.po_created': 'Purchase order created from request',
    'error.required': 'This field is required',
  },

  validationMessages: {
    submitted_requires_amount: 'Submitted PRs must have an estimated amount.',
    submitted_requires_justification: 'Submitted PRs must include a business justification.',
    sent_requires_order_date: 'Sent POs must have an order_date.',
    received_not_exceed_total: 'received_amount cannot exceed total_amount.',
    rejected_has_zero_value: 'Rejected receipts must have a received_value of 0.',
  },

  dashboards: {
    spend_at_a_glance_dashboard: {
      label: 'Spend at a Glance',
      description: 'Open POs, MTD commitments, requests awaiting approval.',
      actions: { create_request: { label: 'New Request' } },
      widgets: {
        awaiting_approval: {
          title: 'PRs Awaiting Approval',
          description: 'Submitted PRs above the approval threshold',
        },
        open_pos: { title: 'Open Purchase Orders', description: 'Sent or partially-received POs' },
        overdue_pos: {
          title: 'Overdue Deliveries',
          description: 'Open POs past expected_delivery',
        },
        open_commitment: { title: 'Open Commitment ($)', description: 'Total value of open POs' },
        pending_requests_table: {
          title: 'Requests Awaiting Approval',
          description: 'Submitted PRs sorted by amount',
        },
        open_pos_table: {
          title: 'Open Purchase Orders',
          description: 'Open POs sorted by expected delivery',
        },
        po_value_by_month: { title: 'PO Value by Month (last 12 months)' },
        top_vendors_by_spend: { title: 'Top Vendors by Spend' },
      },
    },
  },
};
