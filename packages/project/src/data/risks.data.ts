// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Risk } from '../objects/pm_risk.object';

/**
 * Risk register entries for the 3 sample projects:
 *   • PRJ-2026-001: 2 risks (1 medium, 1 low)
 *   • PRJ-2026-002: 3 risks (1 critical, 1 high, 1 medium)
 *   • PRJ-2026-003: 2 risks (both medium)
 */
export const risks = defineDataset(Risk, {
  mode: 'upsert',
  externalId: 'risk_id',
  records: [
    // PRJ-2026-001: Mobile App Redesign
    {
      risk_id: 'RISK-001-001',
      project: 'PRJ-2026-001',
      name: 'App Store Rejection',
      description: 'Apple or Google may reject app due to new design guidelines or compliance issues',
      category: 'external',
      status: 'identified',
      // Manual assessment
      impact: 'high',
      likelihood: 'low',
      priority: 'medium',
      // AI assessment
      ai_impact_score: 4,
      ai_likelihood: 0.25,
      ai_mitigation_suggestion: 'Pre-submission review with App Store consultant. Budget 2 weeks buffer for resubmission.',
      ai_similar_risks: 'Similar rejection happened in PRJ-2025-007 due to privacy disclosure',
      ai_last_updated: cel`daysAgo(1)`,
      // Response plan
      response_strategy: 'mitigate',
      response_plan: 'Engage App Store consultant for pre-submission review in week of June 15',
      response_owner: 'admin',
      identified_at: cel`daysAgo(20)`,
    },
    {
      risk_id: 'RISK-001-002',
      project: 'PRJ-2026-001',
      name: 'Designer Availability in August',
      description: 'Lead UI designer has planned vacation in August, may delay final polish phase',
      category: 'resource',
      status: 'monitoring',
      // Manual assessment
      impact: 'low',
      likelihood: 'high',
      priority: 'low',
      // AI assessment
      ai_impact_score: 2,
      ai_likelihood: 0.85,
      ai_mitigation_suggestion: 'Hire freelance designer for 2 weeks in August OR adjust timeline to complete design-heavy work by July 31',
      ai_similar_risks: 'PRJ-2025-012 successfully used freelance designer during leave period',
      ai_last_updated: cel`daysAgo(0)`,
      // Response plan
      response_strategy: 'mitigate',
      response_plan: 'Recruiting freelance designer, interviews scheduled for week of June 1',
      response_owner: 'admin',
      identified_at: cel`daysAgo(5)`,
    },

    // PRJ-2026-002: ERP System Migration
    {
      risk_id: 'RISK-002-001',
      project: 'PRJ-2026-002',
      name: 'Data Quality Issues Blocking Migration',
      description: 'Legacy data contains inconsistencies, duplicates, and missing values that prevent clean migration',
      category: 'technical',
      status: 'mitigating',
      // Manual assessment
      impact: 'very_high',
      likelihood: 'very_high',
      priority: 'critical',
      // AI assessment
      ai_impact_score: 5,
      ai_likelihood: 0.92,
      ai_mitigation_suggestion: 'CRITICAL: Add 2 data analysts for cleanup sprint. Extend timeline by 3 weeks. Consider phased migration by department.',
      ai_similar_risks: 'PRJ-2024-003 ERP migration delayed 6 weeks due to similar data issues',
      ai_last_updated: cel`daysAgo(0)`,
      // Response plan
      response_strategy: 'mitigate',
      response_plan: 'Emergency data cleanup sprint, hired 2 contractors, extended deadline to June 28',
      response_owner: 'admin',
      response_cost: 45000,
      identified_at: cel`daysAgo(12)`,
    },
    {
      risk_id: 'RISK-002-002',
      project: 'PRJ-2026-002',
      name: 'SAP Consultant Unavailable During Go-Live',
      description: 'Lead SAP consultant may be pulled to another client emergency during our go-live week',
      category: 'external',
      status: 'identified',
      // Manual assessment
      impact: 'high',
      likelihood: 'medium',
      priority: 'high',
      // AI assessment
      ai_impact_score: 4,
      ai_likelihood: 0.35,
      ai_mitigation_suggestion: 'Negotiate contract clause for go-live exclusivity. Train internal team on rollback procedures.',
      ai_similar_risks: 'No similar historical risks found',
      ai_last_updated: cel`daysAgo(2)`,
      // Response plan
      response_strategy: 'mitigate',
      response_plan: 'Negotiating contract amendment. Scheduling shadow training for internal team.',
      response_owner: 'admin',
      identified_at: cel`daysAgo(8)`,
    },
    {
      risk_id: 'RISK-002-003',
      project: 'PRJ-2026-002',
      name: 'User Training Completion Low',
      description: 'Only 60% of users completed mandatory training, may lead to adoption issues',
      category: 'organizational',
      status: 'monitoring',
      // Manual assessment
      impact: 'medium',
      likelihood: 'medium',
      priority: 'medium',
      // AI assessment
      ai_impact_score: 3,
      ai_likelihood: 0.55,
      ai_mitigation_suggestion: 'Executive mandate for training completion by June 10. Add 2 drop-in training sessions.',
      ai_similar_risks: 'PRJ-2025-001 had similar issue, resolved with executive email',
      ai_last_updated: cel`daysAgo(3)`,
      // Response plan
      response_strategy: 'mitigate',
      response_plan: 'Sponsor sending reminder email. Scheduling 2 additional training sessions June 5 and June 12.',
      response_owner: 'admin',
      identified_at: cel`daysAgo(10)`,
    },

    // PRJ-2026-003: AI Chatbot MVP
    {
      risk_id: 'RISK-003-001',
      project: 'PRJ-2026-003',
      name: 'LLM API Cost Overrun',
      description: 'OpenAI/Anthropic API costs may exceed budget if usage is higher than estimated',
      category: 'financial',
      status: 'identified',
      // Manual assessment
      impact: 'medium',
      likelihood: 'medium',
      priority: 'medium',
      // AI assessment
      ai_impact_score: 3,
      ai_likelihood: 0.45,
      ai_mitigation_suggestion: 'Implement aggressive caching and prompt optimization. Set hard API rate limits during pilot.',
      ai_similar_risks: 'PRJ-2025-022 AI project had 40% cost overrun due to unoptimized prompts',
      ai_last_updated: cel`daysAgo(0)`,
      // Response plan
      response_strategy: 'mitigate',
      response_plan: 'Will implement semantic cache and prompt compression. Rate limit: 100 req/min during pilot.',
      response_owner: 'admin',
      identified_at: cel`daysAgo(2)`,
    },
    {
      risk_id: 'RISK-003-002',
      project: 'PRJ-2026-003',
      name: 'ML Engineer Onboarding Delay',
      description: 'New ML engineer may take longer to onboard than planned, delaying sprint 1',
      category: 'resource',
      status: 'monitoring',
      // Manual assessment
      impact: 'medium',
      likelihood: 'low',
      priority: 'medium',
      // AI assessment
      ai_impact_score: 2,
      ai_likelihood: 0.30,
      ai_mitigation_suggestion: 'Assign senior engineer as mentor. Prepare detailed onboarding checklist and sandbox environment.',
      ai_similar_risks: 'PRJ-2025-018 had slow ML onboarding, resolved with pair programming',
      ai_last_updated: cel`daysAgo(1)`,
      // Response plan
      response_strategy: 'accept',
      response_plan: 'Already assigned mentor. If delay > 1 week, will consider extending sprint.',
      response_owner: 'admin',
      identified_at: cel`daysAgo(5)`,
    },
  ],
});
