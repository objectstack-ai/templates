// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * PO Overdue Delivery — when a sent or partially-received PO is past its
 * expected_delivery date, alert the buyer. Daily scheduler re-evaluates
 * criteria so the flow fires once the boundary is crossed.
 */
export const POOverdueFlow: Flow = {
  name: 'procurement_order_overdue_delivery',
  label: 'Alert Buyer When PO Delivery Overdue',
  description:
    'When an open PO passes its expected_delivery date without full receipt, alert the buyer.',
  type: 'record_change',

  variables: [{ name: 'poId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'procurement_order',
        triggerType: 'record-after-update',
        condition:
          '(status == "sent" || status == "partial") && expected_delivery != null && expected_delivery == daysAgo(1)',
      },
    },
    {
      id: 'get_po',
      type: 'get_record',
      label: 'Load PO',
      config: {
        objectName: 'procurement_order',
        filter: { id: '{record.id}' },
        outputVariable: 'po',
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
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_po', type: 'default' },
    { id: 'e2', source: 'get_po', target: 'notify_buyer', type: 'default' },
    { id: 'e3', source: 'notify_buyer', target: 'end', type: 'default' },
  ],
};
