// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { DailyAIRiskAssessmentFlow } from './daily_ai_risk_assessment.flow.js';
import { MilestoneDeadlineWarningFlow } from './milestone_deadline_warning.flow.js';
import { ResourceConflictDetectionFlow } from './resource_conflict_detection.flow.js';

export const allFlows = [
  DailyAIRiskAssessmentFlow,
  MilestoneDeadlineWarningFlow,
  ResourceConflictDetectionFlow,
];
