// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
import { cel } from '@objectstack/spec';
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
  description: 'Alert project managers when milestones are approaching or overdue.',
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
      id: 'query_open',
      type: 'get_record',
      label: 'Find Open Milestones',
      config: {
        objectName: 'pm_milestone',
        // Open milestones; the deadline window (due ≤ 7 days / overdue) is
        // refined downstream against planned_date.
        filter: { status: { $in: ['not_started', 'in_progress'] } },
        limit: 500,
        outputVariable: 'openMilestones',
      },
    },
    {
      id: 'notify_upcoming',
      type: 'notify',
      label: 'Notify PM of Upcoming Milestones',
      config: {
        recipients: ['{openMilestones.records[*].project.project_manager}'],
        title: 'Milestones approaching their planned date',
        body: 'One or more milestones you own are due within the next 7 days. Review the milestone board.',
        actionUrl: '/objects/pm_milestone',
      },
    },
    {
      id: 'mark_missed',
      type: 'update_record',
      label: 'Mark Overdue as Missed',
      config: {
        objectName: 'pm_milestone',
        // Bulk-update: every still-open milestone whose planned date has passed.
        // (update_record applies `fields` to all rows matching `filter`.)
        filter: {
          status: { $in: ['not_started', 'in_progress'] },
          planned_date: { $lt: cel`today()` },
        },
        fields: {
          status: 'missed',
        },
      },
    },
    {
      id: 'escalate_overdue',
      type: 'notify',
      label: 'Escalate to PMO',
      config: {
        to: 'pmo_team',
        message: 'OVERDUE: Milestone "{milestone.name}" in project {milestone.project.name}',
      },
    },
    {
      id: 'end',
      type: 'end',
      label: 'End',
    },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_open', type: 'default' },
    { id: 'e2', source: 'query_open', target: 'notify_upcoming', type: 'default' },
    { id: 'e3', source: 'notify_upcoming', target: 'mark_missed', type: 'default' },
    { id: 'e4', source: 'mark_missed', target: 'escalate_overdue', type: 'default' },
    { id: 'e5', source: 'escalate_overdue', target: 'end', type: 'default' },
  ],
};
