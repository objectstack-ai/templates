// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
type Flow = Automation.Flow;

/**
 * PO Overdue Delivery — alerts the buyer about every sent / partially-received
 * PO that is past its `expected_delivery` date without full receipt.
 *
 * Why a SCHEDULED flow, not record-change (#1874): "past its delivery date" is
 * time-relative. A record-change trigger only fires on row mutation, so an
 * untouched PO would never cross the boundary. The daily schedule re-evaluates
 * the open POs against `today()`.
 *
 * Idempotency is declarative via status: the query is scoped to
 * `status in (sent, partial)`, so a PO drops out once it is received or closed.
 * (Still-open overdue POs are re-alerted daily on purpose.)
 */
export const POOverdueFlow: Flow = {
  name: 'procurement_order_overdue_delivery',
  label: 'Alert Buyer When PO Delivery Overdue',
  description:
    'Daily scheduled job: alerts the buyer about open POs past their expected_delivery date.',
  type: 'schedule',

  variables: [],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start (Scheduled)',
      config: {
        schedule: 'cron:0 9 * * *', // Daily at 9am
      },
    },
    {
      id: 'query_overdue',
      type: 'get_record',
      label: 'Find Overdue Open POs',
      config: {
        objectName: 'procurement_order',
        filter: {
          status: { $in: ['sent', 'partial'] },
          expected_delivery: { $lt: cel`today()` },
        },
        limit: 500,
        outputVariable: 'overduePOs',
      },
    },
    {
      id: 'foreach_po',
      type: 'loop',
      label: 'For Each Overdue PO',
      config: {
        collection: '{overduePOs.records}',
        iteratorVar: 'po',
      },
    },
    {
      id: 'notify_buyer',
      type: 'notify',
      label: 'Notify Buyer',
      config: {
        recipients: ['{po.owner}'],
        title: 'PO overdue: {po.po_number}',
        body: 'PO "{po.po_number}" with {po.vendor} was expected on {po.expected_delivery} but is still {po.status}. Follow up with the vendor.',
        actionUrl: '/objects/procurement_order/{po.id}',
      },
    },
    { id: 'end_loop', type: 'end', label: 'End Loop Iteration' },
    { id: 'end', type: 'end', label: 'End Flow' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_overdue', type: 'default' },
    { id: 'e2', source: 'query_overdue', target: 'foreach_po', type: 'default' },
    { id: 'e3', source: 'foreach_po', target: 'notify_buyer', type: 'default' },
    { id: 'e4', source: 'notify_buyer', target: 'end_loop', type: 'default' },
    { id: 'e5', source: 'end_loop', target: 'end', type: 'default' },
  ],
};
