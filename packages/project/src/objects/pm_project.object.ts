// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';

/**
 * Project — the central object for project portfolio management.
 * The `ai_*` fields (ai_completion_probability, ai_delay_days, ai_risk_score,
 * ai_budget_variance_forecast …) are first-class in the SCHEMA but populated
 * by a stub today — see `flows/daily_ai_risk_assessment.flow.ts`. Wire your
 * own LLM/ML to make them live; seed values are illustrative, not computed.
 *
 * Unlike the `todo` template (task-level), this template operates at
 * project level (weeks-months) with project-level planning for PMOs.
 */
export const Project = ObjectSchema.create({
  name: 'pm_project',
  label: 'Project',
  pluralLabel: 'Projects',
  icon: 'folder-kanban',
  description:
    'A time-bound initiative with milestones, resources, and scaffolded AI risk fields (bring your own LLM).',

  fieldGroups: [
    { key: 'core', label: 'Project Details', icon: 'folder', defaultExpanded: true },
    { key: 'dates', label: 'Timeline', icon: 'calendar' },
    { key: 'ai', label: 'AI Predictions (scaffolded)', icon: 'sparkles' },
    { key: 'budget', label: 'Budget', icon: 'dollar-sign' },
    { key: 'people', label: 'Team', icon: 'users' },
    { key: 'meta', label: 'Metadata', icon: 'info', defaultExpanded: false },
  ],

  fields: {
    code: Field.text({
      label: 'Project Code',
      required: false,
      readonly: true,
      maxLength: 20,
      searchable: true,
      group: 'core',
      description: 'Short human-readable code (PRJ-NNN), auto-assigned on create.',
    }),
    name: Field.text({
      label: 'Project Name',
      required: true,
      maxLength: 200,
      searchable: true,
      group: 'core',
      description: 'Short, descriptive project name.',
    }),
    description: Field.markdown({
      label: 'Description',
      required: false,
      group: 'core',
      description: 'Project goals, scope, and success criteria.',
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Planning', value: 'planning', color: '#94A3B8', default: true },
        { label: 'Active', value: 'active', color: '#3B82F6' },
        { label: 'At Risk', value: 'at_risk', color: '#F59E0B' },
        { label: 'On Hold', value: 'on_hold', color: '#6B7280' },
        { label: 'Completed', value: 'completed', color: '#10B981' },
        { label: 'Cancelled', value: 'cancelled', color: '#EF4444' },
      ],
    }),
    priority: Field.select({
      label: 'Priority',
      required: true,
      group: 'core',
      options: [
        { label: 'Low', value: 'low', color: '#94A3B8' },
        { label: 'Medium', value: 'medium', color: '#3B82F6', default: true },
        { label: 'High', value: 'high', color: '#F59E0B' },
        { label: 'Critical', value: 'critical', color: '#EF4444' },
      ],
    }),
    project_type: Field.select({
      label: 'Type',
      required: true,
      group: 'core',
      options: [
        { label: 'Internal', value: 'internal' },
        { label: 'Client', value: 'client' },
        { label: 'R&D', value: 'rnd' },
        { label: 'Maintenance', value: 'maintenance' },
      ],
    }),
    health: Field.select({
      label: 'Health',
      required: false,
      readonly: true,
      group: 'core',
      description: 'RAG status auto-derived from AI risk score and schedule by the project hook.',
      options: [
        { label: 'On Track', value: 'on_track', color: '#10B981', default: true },
        { label: 'At Risk', value: 'at_risk', color: '#F59E0B' },
        { label: 'Off Track', value: 'off_track', color: '#EF4444' },
      ],
    }),

    // Timeline
    start_date: Field.date({
      label: 'Start Date',
      required: true,
      group: 'dates',
    }),
    planned_end_date: Field.date({
      label: 'Planned End Date',
      required: true,
      group: 'dates',
    }),
    actual_end_date: Field.date({
      label: 'Actual End Date',
      required: false,
      group: 'dates',
      description: 'Set when project completes.',
    }),

    // AI Predictions
    ai_completion_probability: Field.number({
      label: 'AI Completion Probability',
      required: false,
      group: 'ai',
      min: 0,
      max: 100,
      description:
        'AI-predicted likelihood of on-time completion (0-100%). Scaffolded — sample value until you wire an LLM.',
    }),
    ai_delay_days: Field.number({
      label: 'AI Predicted Delay (Days)',
      required: false,
      group: 'ai',
      description: 'Predicted schedule variance in days. Negative = early, positive = late.',
    }),
    ai_risk_score: Field.number({
      label: 'AI Risk Score',
      required: false,
      group: 'ai',
      min: 0,
      max: 100,
      description: 'Composite risk score (0-100). >70 = high risk.',
    }),
    ai_budget_variance_forecast: Field.number({
      label: 'AI Budget Variance %',
      required: false,
      group: 'ai',
      description: 'Predicted budget overrun/underrun as percentage.',
    }),
    ai_resource_bottleneck: Field.text({
      label: 'AI Resource Bottleneck',
      required: false,
      maxLength: 500,
      group: 'ai',
      description: 'AI-identified resource constraints (e.g., "Frontend team overallocated").',
    }),
    ai_recommended_action: Field.markdown({
      label: 'AI Recommended Actions',
      required: false,
      group: 'ai',
      description: 'AI-generated suggestions to mitigate risks.',
    }),
    ai_last_prediction_at: Field.datetime({
      label: 'Last AI Prediction',
      required: false,
      group: 'ai',
      description: 'Timestamp of last AI analysis.',
    }),

    // Budget
    planned_budget: Field.currency({
      label: 'Planned Budget',
      required: false,
      group: 'budget',
    }),
    actual_cost: Field.currency({
      label: 'Actual Cost',
      required: false,
      group: 'budget',
      description:
        'Cost to date. Maintained by seed/client or an out-of-sandbox worker — NOT a live ' +
        'hook rollup (a nested write from a timesheet hook crashes the QuickJS sandbox).',
    }),

    // Team
    project_manager: Field.lookup('sys_user', {
      label: 'Project Manager',
      required: false,
      group: 'people',
    }),
    sponsor: Field.lookup('sys_user', {
      label: 'Sponsor',
      required: false,
      group: 'people',
    }),

    // Computed progress (from milestones)
    progress_percent: Field.number({
      label: 'Progress %',
      required: false,
      readonly: true,
      group: 'core',
      min: 0,
      max: 100,
      description:
        'Share of completed milestones. Maintained by seed/client (not a live hook ' +
        'rollup — see actual_cost note).',
    }),
  },

  enable: {
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['start_date'] },
    { fields: ['planned_end_date'] },
    { fields: ['project_manager'] },
  ],

  displayNameField: 'name',
  compactLayout: [
    'code',
    'name',
    'status',
    'health',
    'priority',
    'project_manager',
    'planned_end_date',
  ],
  validations: [
    {
      type: 'state_machine',
      name: 'project_lifecycle',
      field: 'status',
      transitions: {
        planning: ['active', 'cancelled'],
        active: ['at_risk', 'on_hold', 'completed', 'cancelled'],
        at_risk: ['active', 'on_hold', 'completed', 'cancelled'],
        on_hold: ['active', 'cancelled'],
        completed: [],
        cancelled: [],
      },
      message: 'Illegal status transition.',
    },
  ],
});
