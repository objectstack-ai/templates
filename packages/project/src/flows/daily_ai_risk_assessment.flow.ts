// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Daily AI Risk Assessment — runs daily for active projects.
 *
 * This flow calls an AI service (stub in v0.1) to:
 * - Predict completion probability
 * - Estimate delay days
 * - Calculate composite risk score
 * - Identify resource bottlenecks
 * - Recommend mitigation actions
 *
 * To plug in real AI (OpenAI/Anthropic/custom model):
 * 1. Replace the `ai_prediction` script node with HTTP call to your ML service
 * 2. Pass project data (milestones, resources, timesheet, historical)
 * 3. Map response to ai_* fields on pm_project
 * 4. Optionally trigger alert if ai_risk_score > 70
 */
export const DailyAIRiskAssessmentFlow: Flow = {
  name: 'pm_daily_ai_risk_assessment',
  label: 'Daily AI Risk Assessment',
  description:
    'Run AI predictions for active projects: completion probability, delay forecast, risk score.',
  type: 'scheduled',

  variables: [
    { name: 'projectId', type: 'text', isInput: true, isOutput: false },
  ],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start (Scheduled)',
      config: {
        schedule: 'cron:0 8 * * *', // Daily at 8am
      },
    },
    {
      id: 'query_active_projects',
      type: 'query',
      label: 'Find Active Projects',
      config: {
        objectName: 'pm_project',
        filter: 'status IN ["active", "at_risk"]',
        filterDialect: 'objectql',
      },
    },
    {
      id: 'foreach_project',
      type: 'foreach',
      label: 'For Each Project',
      config: {
        collection: '{query_active_projects.records}',
        iteratorVar: 'project',
      },
    },
    {
      id: 'ai_prediction',
      type: 'script',
      label: 'AI Prediction (STUB — replace with LLM call)',
      config: {
        // STUB: In production, call external AI service here
        // Input: project data, milestones, resources, timesheet history
        // Output: ai_completion_probability, ai_delay_days, ai_risk_score, etc.
        actionType: 'invoke_function',
        functionName: 'pm.aiRiskAssessmentStub',
        inputs: {
          projectId: '{project.id}',
        },
      },
    },
    {
      id: 'update_project',
      type: 'update_record',
      label: 'Update Project AI Fields',
      config: {
        objectName: 'pm_project',
        recordId: '{project.id}',
        values: {
          ai_last_prediction_at: '{now()}',
          // Other ai_* fields set by the stub/LLM function
        },
      },
    },
    {
      id: 'check_high_risk',
      type: 'condition',
      label: 'Risk Score > 70?',
      config: {
        condition: 'project.ai_risk_score > 70',
        conditionDialect: 'cel',
      },
    },
    {
      id: 'notify_pmo',
      type: 'script',
      label: 'Notify PMO of High Risk',
      config: {
        actionType: 'send_notification',
        to: 'pmo_team',
        message: 'Project {{project.name}} has high risk score: {{project.ai_risk_score}}',
      },
    },
    {
      id: 'end_loop',
      type: 'end',
      label: 'End Loop Iteration',
    },
    {
      id: 'end',
      type: 'end',
      label: 'End Flow',
    },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'query_active_projects', type: 'default' },
    { id: 'e2', source: 'query_active_projects', target: 'foreach_project', type: 'default' },
    { id: 'e3', source: 'foreach_project', target: 'ai_prediction', type: 'default' },
    { id: 'e4', source: 'ai_prediction', target: 'update_project', type: 'default' },
    { id: 'e5', source: 'update_project', target: 'check_high_risk', type: 'default' },
    { id: 'e6', source: 'check_high_risk', target: 'notify_pmo', type: 'true' },
    { id: 'e7', source: 'check_high_risk', target: 'end_loop', type: 'false' },
    { id: 'e8', source: 'notify_pmo', target: 'end_loop', type: 'default' },
    { id: 'e9', source: 'end_loop', target: 'end', type: 'default' },
  ],
};
