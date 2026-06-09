// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineSeed } from '@objectstack/spec/data';
import { Risk } from '../objects/pm_risk.object.js';

/**
 * Risks for the sample projects.
 * Includes AI-scored risks with mitigation plans.
 * `project` references the parent project by its `name` externalId.
 */
export const risks = defineSeed(Risk, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    {
      name: 'Backend team overallocation',
      description: 'Backend engineers are split across 3 concurrent projects, risking delays.',
      project: 'ERP System Migration',
      status: 'mitigating',
      category: 'resource',
      impact: 'high',
      likelihood: 'high',
      ai_impact_score: 4,
      ai_likelihood: 0.75,
      ai_mitigation_suggestion: 'Hire 2 contractors or delay non-critical features.',
      mitigation_plan: 'Add contractors for data migration phase.',
      owner: null,
    },
    {
      name: 'LLM vendor pricing uncertainty',
      description: 'LLM API costs may exceed budget at scale.',
      project: 'AI Chatbot MVP',
      status: 'identified',
      category: 'budget',
      impact: 'medium',
      likelihood: 'medium',
      ai_impact_score: 3,
      ai_likelihood: 0.5,
      ai_mitigation_suggestion: 'Negotiate volume discounts; build cost monitoring.',
      mitigation_plan: 'Set up usage caps and alerts.',
      owner: null,
    },
    {
      name: 'Data integrity during migration',
      description: 'Risk of data loss or corruption during ERP cutover.',
      project: 'ERP System Migration',
      status: 'assessing',
      category: 'technical',
      impact: 'very_high',
      likelihood: 'medium',
      ai_impact_score: 5,
      ai_likelihood: 0.4,
      ai_mitigation_suggestion: 'Implement parallel-run validation and rollback procedures.',
      mitigation_plan: 'Full backup + staged migration with validation gates.',
      owner: null,
    },
  ],
});
