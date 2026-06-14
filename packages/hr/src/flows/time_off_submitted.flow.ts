// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Time-off submitted → notify the requester's manager. The actual approval
 * decision is recorded via the state machine (APPROVE / REJECT / KICKBACK
 * events); this flow only routes the notification.
 */
export const TimeOffSubmittedFlow: Flow = {
  name: 'hr_time_off_submitted_notify',
  label: 'Notify Manager When Time-Off Submitted',
  description: 'When a time-off request moves to submitted, notify the employee’s manager.',
  type: 'record_change',

  variables: [{ name: 'requestId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'hr_time_off_request',
        triggerType: 'record-after-update',
        condition: "record.status == 'submitted' && previous.status != 'submitted'",
      },
    },
    {
      id: 'get_request',
      type: 'get_record',
      label: 'Load Request',
      config: {
        objectName: 'hr_time_off_request',
        filter: { id: '{record.id}' },
        outputVariable: 'req',
      },
    },
    {
      id: 'get_employee',
      type: 'get_record',
      label: 'Load Employee',
      config: {
        objectName: 'hr_employee',
        filter: { id: '{req.employee}' },
        outputVariable: 'emp',
      },
    },
    {
      id: 'route_to_manager',
      type: 'update_record',
      label: 'Route to Manager',
      config: {
        objectName: 'hr_time_off_request',
        filter: { id: '{record.id}' },
        // Record the approver so the "My Pending Approvals" surfaces resolve.
        fields: { approver: '{emp.manager}' },
      },
    },
    {
      id: 'notify_manager',
      type: 'notify',
      label: 'Notify Manager',
      config: {
        recipients: ['{emp.manager.user}'],
        title: 'Time-off request from {emp.full_name}',
        body: '{emp.full_name} requested {req.leave_type} from {req.start_date} to {req.end_date}. Open to review.',
        actionUrl: '/objects/hr_time_off_request/{req.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_request', type: 'default' },
    { id: 'e2', source: 'get_request', target: 'get_employee', type: 'default' },
    { id: 'e3', source: 'get_employee', target: 'route_to_manager', type: 'default' },
    { id: 'e4', source: 'route_to_manager', target: 'notify_manager', type: 'default' },
    { id: 'e5', source: 'notify_manager', target: 'end', type: 'default' },
  ],
};
