// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Milestone } from '../objects/pm_milestone.object';

/**
 * Milestones for the sample projects.
 * Mix of completed, upcoming, and at-risk milestones.
 * `project` references the parent project by its `name` externalId.
 */
export const milestones = defineDataset(Milestone, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    // Mobile App Redesign milestones
    {
      name: 'Design System Complete',
      project: { name: 'Mobile App Redesign' },
      status: 'completed',
      planned_date: cel`daysAgo(20)`,
      actual_date: cel`daysAgo(18)`,
      deliverables: 'Figma design system, component library',
    },
    {
      name: 'Beta Release',
      project: { name: 'Mobile App Redesign' },
      status: 'in_progress',
      planned_date: cel`daysFromNow(30)`,
      deliverables: 'TestFlight beta with core features',
    },
    // ERP System Migration milestones
    {
      name: 'Data Migration Plan Approved',
      project: { name: 'ERP System Migration' },
      status: 'completed',
      planned_date: cel`daysAgo(60)`,
      actual_date: cel`daysAgo(55)`,
      deliverables: 'Approved migration runbook',
    },
    {
      name: 'Phase 1 Data Cutover',
      project: { name: 'ERP System Migration' },
      status: 'in_progress',
      planned_date: cel`daysFromNow(10)`,
      deliverables: 'Core financial data migrated',
    },
    // AI Chatbot MVP milestones
    {
      name: 'LLM Vendor Selected',
      project: { name: 'AI Chatbot MVP' },
      status: 'not_started',
      planned_date: cel`daysFromNow(20)`,
      deliverables: 'Signed vendor contract',
    },
  ],
});
