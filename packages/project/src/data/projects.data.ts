// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Project } from '../objects/pm_project.object.js';

/**
 * 3 sample projects covering different states and risk profiles:
 *   • Mobile App Redesign - active project, on track
 *   • ERP System Migration - at risk, delayed
 *   • AI Chatbot MVP - planning phase
 *
 * `name` is the externalId — it is also used by milestones / risks / issues /
 * resources to reference their parent project via `{ name: '…' }`.
 */
export const projects = defineDataset(Project, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    {
      name: 'Mobile App Redesign',
      description:
        'Complete redesign of iOS and Android apps with new brand identity and improved UX. Target Q3 launch.',
      status: 'active',
      priority: 'high',
      project_type: 'client',
      start_date: cel`daysAgo(45)`,
      planned_end_date: cel`daysFromNow(75)`,
      actual_end_date: null,
      progress_percent: 38,
      // AI predictions
      ai_completion_probability: 82,
      ai_delay_days: 0,
      ai_risk_score: 25,
      ai_budget_variance_forecast: -5,
      ai_resource_bottleneck: 'UI designer availability in August',
      ai_recommended_action: 'Consider hiring freelance designer for August sprint',
      ai_last_prediction_at: cel`daysAgo(0)`,
      // Budget
      planned_budget: 280000,
      actual_cost: 105000,
    },
    {
      name: 'ERP System Migration',
      description:
        'Migrate legacy ERP to cloud-based solution. Complex data migration with high business risk.',
      status: 'at_risk',
      priority: 'critical',
      project_type: 'internal',
      start_date: cel`daysAgo(90)`,
      planned_end_date: cel`daysFromNow(30)`,
      actual_end_date: null,
      progress_percent: 55,
      ai_completion_probability: 45,
      ai_delay_days: 21,
      ai_risk_score: 78,
      ai_budget_variance_forecast: 18,
      ai_resource_bottleneck: 'Backend engineers overallocated across 3 projects',
      ai_recommended_action: 'Delay non-critical features; add 2 contractors for data migration',
      ai_last_prediction_at: cel`daysAgo(0)`,
      planned_budget: 500000,
      actual_cost: 340000,
    },
    {
      name: 'AI Chatbot MVP',
      description: 'Build customer service AI chatbot MVP with LLM integration.',
      status: 'planning',
      priority: 'medium',
      project_type: 'rnd',
      start_date: cel`daysFromNow(7)`,
      planned_end_date: cel`daysFromNow(97)`,
      actual_end_date: null,
      progress_percent: 0,
      ai_completion_probability: 70,
      ai_delay_days: 0,
      ai_risk_score: 35,
      ai_budget_variance_forecast: 0,
      ai_resource_bottleneck: null,
      ai_recommended_action: 'Validate LLM vendor pricing before committing to architecture',
      ai_last_prediction_at: cel`daysAgo(0)`,
      planned_budget: 150000,
      actual_cost: 0,
    },
  ],
});
