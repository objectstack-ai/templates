// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Risk — potential threats to project success.
 * AI fields: ai_impact_score, ai_likelihood, ai_mitigation_suggestion.
 */
export const Risk = ObjectSchema.create({
  name: 'pm_risk',
  label: 'Risk',
  pluralLabel: 'Risks',
  icon: 'alert-triangle',
  description: 'A potential threat or uncertainty that could impact project delivery.',

  fieldGroups: [
    { key: 'core', label: 'Risk Details', icon: 'alert-triangle', defaultExpanded: true },
    { key: 'assessment', label: 'Assessment', icon: 'bar-chart' },
    { key: 'ai', label: 'AI Analysis', icon: 'sparkles' },
    { key: 'response', label: 'Response Plan', icon: 'shield' },
  ],

  fields: {
    name: Field.text({
      label: 'Risk Title',
      required: true,
      maxLength: 200,
      searchable: true,
      group: 'core',
    }),
    description: Field.markdown({
      label: 'Description',
      required: true,
      group: 'core',
      description: 'What is the risk and what triggers it?',
    }),
    project: Field.lookup('pm_project', {
      label: 'Project',
      required: true,
      group: 'core',
    }),
    status: Field.select({
      label: 'Status',
      required: true,
      group: 'core',
      options: [
        { label: 'Identified', value: 'identified', color: '#F59E0B', default: true },
        { label: 'Assessing', value: 'assessing', color: '#3B82F6' },
        { label: 'Mitigating', value: 'mitigating', color: '#8B5CF6' },
        { label: 'Monitoring', value: 'monitoring', color: '#06B6D4' },
        { label: 'Closed', value: 'closed', color: '#10B981' },
        { label: 'Realized', value: 'realized', color: '#EF4444' },
      ],
    }),
    category: Field.select({
      label: 'Category',
      required: true,
      group: 'core',
      options: [
        { label: 'Technical', value: 'technical' },
        { label: 'Resource', value: 'resource' },
        { label: 'Schedule', value: 'schedule' },
        { label: 'Budget', value: 'budget' },
        { label: 'External', value: 'external' },
        { label: 'Scope', value: 'scope' },
      ],
    }),

    // Manual Assessment
    impact: Field.select({
      label: 'Impact (Manual)',
      required: false,
      group: 'assessment',
      options: [
        { label: 'Very Low', value: 'very_low', color: '#10B981' },
        { label: 'Low', value: 'low', color: '#3B82F6' },
        { label: 'Medium', value: 'medium', color: '#F59E0B' },
        { label: 'High', value: 'high', color: '#EF4444' },
        { label: 'Very High', value: 'very_high', color: '#DC2626' },
      ],
    }),
    likelihood: Field.select({
      label: 'Likelihood (Manual)',
      required: false,
      group: 'assessment',
      options: [
        { label: 'Very Low', value: 'very_low', color: '#10B981' },
        { label: 'Low', value: 'low', color: '#3B82F6' },
        { label: 'Medium', value: 'medium', color: '#F59E0B' },
        { label: 'High', value: 'high', color: '#EF4444' },
        { label: 'Very High', value: 'very_high', color: '#DC2626' },
      ],
    }),
    priority: Field.number({
      label: 'Risk Priority (Impact × Likelihood)',
      required: false,
      readonly: true,
      group: 'assessment',
      min: 1,
      max: 25,
      description: 'Calculated as impact × likelihood.',
    }),

    // AI Assessment
    ai_impact_score: Field.number({
      label: 'AI Impact Score',
      required: false,
      group: 'ai',
      min: 1,
      max: 5,
      description: 'AI-predicted impact (1-5).',
    }),
    ai_likelihood: Field.number({
      label: 'AI Likelihood',
      required: false,
      group: 'ai',
      min: 0,
      max: 1,
      step: 0.01,
      description: 'AI-predicted probability (0-1).',
    }),
    ai_mitigation_suggestion: Field.markdown({
      label: 'AI Mitigation Suggestion',
      required: false,
      group: 'ai',
      description: 'AI-generated mitigation strategies.',
    }),
    ai_similar_risks: Field.json({
      label: 'AI Similar Past Risks',
      required: false,
      group: 'ai',
      description: 'Array of similar risks from historical projects.',
    }),

    // Response Plan
    mitigation_plan: Field.markdown({
      label: 'Mitigation Plan',
      required: false,
      group: 'response',
      description: 'How we will reduce likelihood or impact.',
    }),
    contingency_plan: Field.markdown({
      label: 'Contingency Plan',
      required: false,
      group: 'response',
      description: 'What to do if risk is realized.',
    }),
    owner: Field.lookup('sys_user', {
      label: 'Risk Owner',
      required: false,
      group: 'response',
    }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    files: true,
    feeds: true,
    trash: true,
  },

  indexes: [{ fields: ['project'] }, { fields: ['status'] }, { fields: ['category'] }],

  titleFormat: tmpl`{{record.name}}`,
  displayNameField: 'name',
  compactLayout: ['name', 'project', 'status', 'category', 'priority'],
  validations: [
    {
      type: 'state_machine',
      name: 'risk_lifecycle',
      field: 'status',
      transitions: {
        identified: ['assessing', 'closed'],
        assessing: ['mitigating', 'monitoring', 'closed'],
        mitigating: ['monitoring', 'realized'],
        monitoring: ['mitigating', 'closed', 'realized'],
        closed: [],
        realized: [],
      },
      message: 'Illegal status transition.',
    },
  ],
});
