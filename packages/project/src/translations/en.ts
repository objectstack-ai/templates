// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * English translations for Project Management template.
 *
 * Shape follows `TranslationData`: field labels live under
 * `objects.<obj>.fields.<field>`, plural labels use `pluralLabel`, and the app
 * shell is translated under `apps.<app>`.
 */
export const en: TranslationData = {
  objects: {
    pm_project: {
      label: 'Project',
      pluralLabel: 'Projects',
      fields: {
        code: { label: 'Project Code' },
        name: { label: 'Project Name' },
        description: { label: 'Description' },
        status: { label: 'Status' },
        priority: { label: 'Priority' },
        health: { label: 'Health' },
        start_date: { label: 'Start Date' },
        target_end_date: { label: 'Target End Date' },
        actual_end_date: { label: 'Actual End Date' },
        progress_percent: { label: 'Progress %' },
        ai_completion_probability: { label: 'AI Completion Probability %' },
        ai_delay_days: { label: 'AI Delay Days' },
        ai_risk_score: { label: 'AI Risk Score' },
        ai_budget_variance_percent: { label: 'AI Budget Variance %' },
        ai_resource_bottleneck: { label: 'AI Resource Bottleneck' },
        ai_recommended_action: { label: 'AI Recommended Action' },
        planned_budget: { label: 'Planned Budget' },
        actual_cost: { label: 'Actual Cost' },
        forecast_cost: { label: 'Forecast Cost' },
        project_manager: { label: 'Project Manager' },
        sponsor: { label: 'Sponsor' },
        team_size: { label: 'Team Size' },
      },
    },
    pm_milestone: {
      label: 'Milestone',
      pluralLabel: 'Milestones',
      fields: {
        name: { label: 'Milestone Name' },
        description: { label: 'Description' },
        project: { label: 'Project' },
        status: { label: 'Status' },
        due_date: { label: 'Due Date' },
        completed_at: { label: 'Completed At' },
        is_critical_path: { label: 'Critical Path' },
        deliverables: { label: 'Deliverables' },
      },
    },
    pm_risk: {
      label: 'Risk',
      pluralLabel: 'Risks',
      fields: {
        risk_id: { label: 'Risk ID' },
        name: { label: 'Risk Name' },
        description: { label: 'Description' },
        project: { label: 'Project' },
        category: { label: 'Category' },
        status: { label: 'Status' },
        impact: { label: 'Impact' },
        likelihood: { label: 'Likelihood' },
        priority: { label: 'Priority' },
        ai_impact_score: { label: 'AI Impact Score' },
        ai_likelihood: { label: 'AI Likelihood' },
        ai_mitigation_suggestion: { label: 'AI Mitigation Suggestion' },
        ai_similar_risks: { label: 'AI Similar Risks' },
        response_strategy: { label: 'Response Strategy' },
        response_plan: { label: 'Response Plan' },
        response_owner: { label: 'Response Owner' },
        response_cost: { label: 'Response Cost' },
      },
    },
    pm_issue: {
      label: 'Issue',
      pluralLabel: 'Issues',
      fields: {
        issue_number: { label: 'Issue #' },
        name: { label: 'Issue Name' },
        description: { label: 'Description' },
        project: { label: 'Project' },
        type: { label: 'Type' },
        status: { label: 'Status' },
        priority: { label: 'Priority' },
        reported_by: { label: 'Reported By' },
        assigned_to: { label: 'Assigned To' },
        reported_at: { label: 'Reported At' },
        resolved_at: { label: 'Resolved At' },
        resolution: { label: 'Resolution' },
      },
    },
    pm_resource: { label: 'Resource', pluralLabel: 'Resources' },
    pm_timesheet: { label: 'Timesheet', pluralLabel: 'Timesheets' },
  },

  apps: {
    pm: {
      label: 'AI Project Management',
      description: 'Portfolio tracking with AI risk prediction, delay forecasting, and resource-conflict detection.',
      navigation: {
        nav_projects: { label: 'Projects' },
        nav_milestones: { label: 'Milestones' },
        nav_risks: { label: 'Risks' },
        nav_issues: { label: 'Issues' },
        nav_resources: { label: 'Resources' },
      },
    },
  },
};
