// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * English translations for the Project Management template.
 *
 * Shape follows `TranslationData`: per-object label/pluralLabel/description,
 * field labels + select options under `objects.<obj>.fields.<field>`, list-view
 * labels under `objects.<obj>._views.<view>`, and the app shell under `apps.pm`.
 * Field names mirror the `*.object.ts` definitions exactly.
 */
export const en: TranslationData = {
  objects: {
    pm_project: {
      label: 'Project',
      pluralLabel: 'Projects',
      description:
        'A time-bound initiative with milestones, resources, and AI-powered risk prediction.',
      fields: {
        code: { label: 'Project Code' },
        name: { label: 'Project Name' },
        description: { label: 'Description' },
        status: {
          label: 'Status',
          options: {
            planning: 'Planning',
            active: 'Active',
            at_risk: 'At Risk',
            on_hold: 'On Hold',
            completed: 'Completed',
            cancelled: 'Cancelled',
          },
        },
        priority: {
          label: 'Priority',
          options: { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' },
        },
        project_type: {
          label: 'Type',
          options: {
            internal: 'Internal',
            client: 'Client',
            rnd: 'R&D',
            maintenance: 'Maintenance',
          },
        },
        health: {
          label: 'Health',
          options: { on_track: 'On Track', at_risk: 'At Risk', off_track: 'Off Track' },
        },
        start_date: { label: 'Start Date' },
        planned_end_date: { label: 'Planned End Date' },
        actual_end_date: { label: 'Actual End Date' },
        ai_completion_probability: { label: 'AI Completion Probability' },
        ai_delay_days: { label: 'AI Predicted Delay (Days)' },
        ai_risk_score: { label: 'AI Risk Score' },
        ai_budget_variance_forecast: { label: 'AI Budget Variance %' },
        ai_resource_bottleneck: { label: 'AI Resource Bottleneck' },
        ai_recommended_action: { label: 'AI Recommended Actions' },
        ai_last_prediction_at: { label: 'Last AI Prediction' },
        planned_budget: { label: 'Planned Budget' },
        actual_cost: { label: 'Actual Cost' },
        project_manager: { label: 'Project Manager' },
        sponsor: { label: 'Sponsor' },
        progress_percent: { label: 'Progress %' },
      },
      _views: { all_projects: { label: 'All Projects' } },
    },
    pm_milestone: {
      label: 'Milestone',
      pluralLabel: 'Milestones',
      description: 'A key delivery point or decision gate in a project timeline.',
      fields: {
        name: { label: 'Milestone Name' },
        description: { label: 'Description' },
        project: { label: 'Project' },
        status: {
          label: 'Status',
          options: {
            not_started: 'Not Started',
            in_progress: 'In Progress',
            completed: 'Completed',
            missed: 'Missed',
          },
        },
        planned_date: { label: 'Planned Date' },
        actual_date: { label: 'Actual Date' },
        owner: { label: 'Owner' },
        is_critical_path: { label: 'On Critical Path' },
        deliverables: { label: 'Deliverables' },
      },
      _views: { all_milestones: { label: 'All Milestones' } },
    },
    pm_risk: {
      label: 'Risk',
      pluralLabel: 'Risks',
      description: 'A potential threat or uncertainty that could impact project delivery.',
      fields: {
        risk_id: { label: 'Risk ID' },
        name: { label: 'Risk Title' },
        description: { label: 'Description' },
        project: { label: 'Project' },
        status: {
          label: 'Status',
          options: {
            identified: 'Identified',
            assessing: 'Assessing',
            mitigating: 'Mitigating',
            monitoring: 'Monitoring',
            closed: 'Closed',
            realized: 'Realized',
          },
        },
        category: {
          label: 'Category',
          options: {
            technical: 'Technical',
            resource: 'Resource',
            schedule: 'Schedule',
            budget: 'Budget',
            external: 'External',
            scope: 'Scope',
          },
        },
        impact: {
          label: 'Impact (Manual)',
          options: {
            very_low: 'Very Low',
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            very_high: 'Very High',
          },
        },
        likelihood: {
          label: 'Likelihood (Manual)',
          options: {
            very_low: 'Very Low',
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            very_high: 'Very High',
          },
        },
        priority: { label: 'Risk Priority (Impact × Likelihood)' },
        ai_impact_score: { label: 'AI Impact Score' },
        ai_likelihood: { label: 'AI Likelihood' },
        ai_mitigation_suggestion: { label: 'AI Mitigation Suggestion' },
        ai_similar_risks: { label: 'AI Similar Past Risks' },
        response_strategy: {
          label: 'Response Strategy',
          options: {
            avoid: 'Avoid',
            mitigate: 'Mitigate',
            transfer: 'Transfer',
            accept: 'Accept',
          },
        },
        mitigation_plan: { label: 'Mitigation Plan' },
        contingency_plan: { label: 'Contingency Plan' },
        owner: { label: 'Risk Owner' },
      },
      _views: { all_risks: { label: 'All Risks' } },
    },
    pm_issue: {
      label: 'Issue',
      pluralLabel: 'Issues',
      description: 'A current problem that requires resolution.',
      fields: {
        issue_number: { label: 'Issue Number' },
        name: { label: 'Issue Title' },
        description: { label: 'Description' },
        project: { label: 'Project' },
        type: {
          label: 'Type',
          options: {
            bug: 'Bug',
            blocker: 'Blocker',
            task: 'Task',
            question: 'Question',
            other: 'Other',
          },
        },
        status: {
          label: 'Status',
          options: {
            open: 'Open',
            in_progress: 'In Progress',
            blocked: 'Blocked',
            resolved: 'Resolved',
            closed: 'Closed',
          },
        },
        severity: {
          label: 'Severity',
          options: { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' },
        },
        assigned_to: { label: 'Assigned To' },
        related_risk: { label: 'Related Risk' },
        resolution: { label: 'Resolution' },
        reported_at: { label: 'Reported At' },
        resolved_at: { label: 'Resolved At' },
      },
      _views: { all_issues: { label: 'All Issues' } },
    },
    pm_resource: {
      label: 'Resource',
      pluralLabel: 'Resources',
      description: 'Team member or budget allocated to a project.',
      fields: {
        project: { label: 'Project' },
        person: { label: 'Person' },
        job_function: { label: 'Function' },
        allocated_hours_per_week: { label: 'Allocated Hours/Week' },
        start_date: { label: 'Allocation Start' },
        end_date: { label: 'Allocation End' },
      },
    },
    pm_timesheet: {
      label: 'Timesheet Entry',
      pluralLabel: 'Timesheet Entries',
      description: 'Daily time tracking entry for a project.',
      fields: {
        project: { label: 'Project' },
        person: { label: 'Person' },
        work_date: { label: 'Work Date' },
        hours: { label: 'Hours' },
        description: { label: 'Description' },
        billable: { label: 'Billable' },
      },
    },
  },

  dashboards: {
    pmo_overview_dashboard: {
      label: 'PMO Overview',
      description:
        'Portfolio health: active vs at-risk vs off-track projects, risk by category, budget by status.',
      actions: { create_project: { label: 'New Project' } },
      widgets: {
        active_projects: { title: 'Active Projects' },
        at_risk_projects: { title: 'At Risk' },
        off_track_projects: { title: 'Off Track' },
        avg_risk_score: { title: 'Avg AI Risk Score' },
        projects_by_health: { title: 'Projects by Health' },
        risk_by_category: { title: 'Open Risks by Category' },
        budget_by_status: { title: 'Planned Budget by Status' },
      },
    },
    pm_workbench_dashboard: {
      label: 'PM Workbench',
      description: 'Delivery pipeline by stage, project mix by type, and risk by lifecycle stage.',
      widgets: {
        wb_planning: { title: 'In Planning' },
        wb_active: { title: 'Active' },
        wb_completed: { title: 'Completed' },
        wb_open_risks: { title: 'Open Risks' },
        wb_projects_by_type: { title: 'Projects by Type' },
        wb_risks_by_status: { title: 'Risks by Stage' },
      },
    },
  },
  apps: {
    pm: {
      label: 'Project Management',
      description:
        'Portfolio tracking with AI risk prediction, delay forecasting, and resource-conflict detection.',
      navigation: {
        nav_projects: { label: 'Projects' },
        nav_milestones: { label: 'Milestones' },
        nav_risks: { label: 'Risks' },
        nav_issues: { label: 'Issues' },
        nav_resources: { label: 'Resources' },
        nav_timesheets: { label: 'Timesheets' },
        nav_pmo_overview: { label: 'PMO Overview' },
        nav_pm_workbench: { label: 'PM Workbench' },
      },
    },
  },
};
