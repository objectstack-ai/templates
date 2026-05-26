// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Project } from '../objects/pm_project.object';

/**
 * 3 sample projects covering different states and risk profiles:
 *   • Mobile App Redesign - active project, on track
 *   • ERP System Migration - at risk, delayed
 *   • AI Chatbot MVP - planning phase
 */
export const projects = defineDataset(Project, {
  mode: 'upsert',
  externalId: 'code',
  records: [
    {
      code: 'PRJ-2026-001',
      name: 'Mobile App Redesign',
      description: 'Complete redesign of iOS and Android apps with new brand identity and improved UX. Target Q3 launch.',
      status: 'active',
      priority: 'high',
      health: 'on_track',
      start_date: cel`daysAgo(45)`,
      target_end_date: cel`daysFromNow(75)`,
      actual_end_date: null,
      progress_percent: 38,
      // AI predictions
      ai_completion_probability: 82,
      ai_delay_days: 0,
      ai_risk_score: 25,
      ai_budget_variance_percent: -5,
      ai_resource_bottleneck: 'UI designer availability in August',
      ai_recommended_action: 'Consider hiring freelance designer for August sprint',
      ai_last_updated: cel`daysAgo(0)`,
      // Budget
      planned_budget: 280000,
      actual_cost: 105000,
      forecast_cost: 265000,
      // Team
      project_manager: 'admin',
      sponsor: 'admin',
      team_size: 8,
    },
    {
      code: 'PRJ-2026-002',
      name: 'ERP System Migration',
      description: 'Migrate from legacy ERP to SAP S/4HANA. Includes data migration, custom integration, and user training.',
      status: 'active',
      priority: 'urgent',
      health: 'at_risk',
      start_date: cel`daysAgo(90)`,
      target_end_date: cel`daysFromNow(30)`,
      actual_end_date: null,
      progress_percent: 62,
      // AI predictions - showing high risk
      ai_completion_probability: 45,
      ai_delay_days: 21,
      ai_risk_score: 78,
      ai_budget_variance_percent: 18,
      ai_resource_bottleneck: 'SAP consultant availability and data quality issues',
      ai_recommended_action: 'URGENT: Schedule executive review. Consider extending timeline by 3 weeks and adding QA resources.',
      ai_last_updated: cel`daysAgo(0)`,
      // Budget
      planned_budget: 850000,
      actual_cost: 720000,
      forecast_cost: 1003000,
      // Team
      project_manager: 'admin',
      sponsor: 'admin',
      team_size: 12,
    },
    {
      code: 'PRJ-2026-003',
      name: 'AI Chatbot MVP',
      description: 'Build AI-powered customer service chatbot with RAG and multi-language support. Initial deployment for tier-1 support.',
      status: 'planning',
      priority: 'normal',
      health: 'on_track',
      start_date: cel`daysFromNow(14)`,
      target_end_date: cel`daysFromNow(104)`,
      actual_end_date: null,
      progress_percent: 5,
      // AI predictions - early stage, moderate confidence
      ai_completion_probability: 68,
      ai_delay_days: 7,
      ai_risk_score: 42,
      ai_budget_variance_percent: 3,
      ai_resource_bottleneck: 'ML engineer onboarding and LLM API selection',
      ai_recommended_action: 'Finalize tech stack selection before sprint 1. Consider proof-of-concept phase.',
      ai_last_updated: cel`daysAgo(0)`,
      // Budget
      planned_budget: 180000,
      actual_cost: 8000,
      forecast_cost: 185400,
      // Team
      project_manager: 'admin',
      sponsor: 'admin',
      team_size: 5,
    },
  ],
});
