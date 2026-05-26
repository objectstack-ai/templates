// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Milestone Deadline Warning — alerts when a milestone is approaching or missed.
 *
 * Runs daily to check:
 * - Milestones due in next 7 days (warn)
 * - Milestones past due and not completed (escalate)
 */
export const MilestoneDeadlineWarningFlow: Flow = {
  name: 'pm_milestone_deadline_warning',
  label: 'Milestone Deadline Warning',
  description:
    'Alert project managers when milestones are approaching or overdue.',
  type: 'scheduled',

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
      id: 'query_upcoming',
      type: 'query',
      label: 'Find Upcoming Milestones (7 days)',
      config: {
        objectName: 'pm_milestone',
        filter: 'status IN ["not_started", "in_progress"] AND planned_date BETWEEN TODAY() AND DATE_ADD(TODAY(), 7)',
        filterDialect: 'objectql',
      },
    },
    {
      id: 'notify_upcoming',
      type: 'script',
      label: 'Notify PM of Upcoming Milestones',
      config: {
        actionType: 'send_notification',
        to: '{query_upcoming.records[*].project.project_manager}',
        message: 'Milestone "{{milestone.name}}" due {{milestone.planned_date}}',
      },
    },
    {
      id: 'query_overdue',
      type: 'query',
      label: 'Find Overdue Milestones',
      config: {
        objectName: 'pm_milestone',
        filter: 'status IN ["not_started", "in_progress"] AND planned_date < TODAY()',
        filterDialect: 'objectql',
      },
    },
    {
      id: 'mark_missed',
      type: 'update_record',
      label: 'Mark as Missed',
      config: {
        objectName: 'pm_milestone',
        recordIds: '{query_overdue.records[*].id}',
        values: {
          status: 'missed',
        },
      },
    },
    {
      id: 'escalate_overdue',
      type: 'script',
      label: 'Escalate to PMO',
      config: {
        actionType: 'send_notification',
        to: 'pmo_team',
        message: 'OVERDUE: Milestone "{{milestone.name}}" in project {{milestone.project.name}}',
      },
    },
    {
      id: 'end',
      type: 'end',
      label: 'End',
    },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_upcoming', type: 'default' },
    { id: 'e2', source: 'query_upcoming', target: 'notify_upcoming', type: 'default' },
    { id: 'e3', source: 'notify_upcoming', target: 'query_overdue', type: 'default' },
    { id: 'e4', source: 'query_overdue', target: 'mark_missed', type: 'default' },
    { id: 'e5', source: 'mark_missed', target: 'escalate_overdue', type: 'default' },
    { id: 'e6', source: 'escalate_overdue', target: 'end', type: 'default' },
  ],
};
