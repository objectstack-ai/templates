// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Milestone } from '../objects/pm_milestone.object';

/**
 * Milestones for the 3 sample projects:
 *   • PRJ-2026-001: 4 milestones (1 completed, 2 active, 1 upcoming)
 *   • PRJ-2026-002: 5 milestones (3 completed, 1 at risk, 1 upcoming)
 *   • PRJ-2026-003: 3 milestones (all upcoming)
 */
export const milestones = defineDataset(Milestone, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    // PRJ-2026-001: Mobile App Redesign
    {
      project: 'PRJ-2026-001',
      name: 'Design System Finalized',
      description: 'Complete component library, color palette, typography, and design tokens',
      status: 'completed',
      due_date: cel`daysAgo(30)`,
      completed_at: cel`daysAgo(32)`,
      is_critical_path: true,
      deliverables: ['Figma component library', 'Design token JSON', 'Brand guidelines PDF'],
    },
    {
      project: 'PRJ-2026-001',
      name: 'iOS App Beta',
      description: 'iOS app with all core screens implemented, ready for internal testing',
      status: 'in_progress',
      due_date: cel`daysFromNow(15)`,
      completed_at: null,
      is_critical_path: true,
      deliverables: ['iOS TestFlight build', 'Test plan document'],
    },
    {
      project: 'PRJ-2026-001',
      name: 'Android App Beta',
      description: 'Android app with all core screens, ready for internal testing',
      status: 'in_progress',
      due_date: cel`daysFromNow(22)`,
      completed_at: null,
      is_critical_path: true,
      deliverables: ['Android APK build', 'Test plan document'],
    },
    {
      project: 'PRJ-2026-001',
      name: 'Production Launch',
      description: 'Both apps approved and released to App Store and Google Play',
      status: 'not_started',
      due_date: cel`daysFromNow(75)`,
      completed_at: null,
      is_critical_path: true,
      deliverables: ['App Store listing', 'Google Play listing', 'Launch announcement', 'User migration guide'],
    },

    // PRJ-2026-002: ERP System Migration
    {
      project: 'PRJ-2026-002',
      name: 'Requirements & Gap Analysis',
      description: 'Complete business requirements and identify gaps between legacy and SAP',
      status: 'completed',
      due_date: cel`daysAgo(75)`,
      completed_at: cel`daysAgo(77)`,
      is_critical_path: true,
      deliverables: ['Requirements doc', 'Gap analysis report'],
    },
    {
      project: 'PRJ-2026-002',
      name: 'Data Migration Pilot',
      description: 'Migrate 10% of master data to validate migration scripts',
      status: 'completed',
      due_date: cel`daysAgo(45)`,
      completed_at: cel`daysAgo(43)`,
      is_critical_path: true,
      deliverables: ['Migration scripts', 'Data quality report'],
    },
    {
      project: 'PRJ-2026-002',
      name: 'UAT Completion',
      description: 'All user acceptance testing scenarios passed by business users',
      status: 'completed',
      due_date: cel`daysAgo(15)`,
      completed_at: cel`daysAgo(12)`,
      is_critical_path: true,
      deliverables: ['UAT sign-off', 'Known issues log'],
    },
    {
      project: 'PRJ-2026-002',
      name: 'Full Data Migration',
      description: 'Complete migration of all production data to SAP',
      status: 'at_risk',
      due_date: cel`daysFromNow(7)`,
      completed_at: null,
      is_critical_path: true,
      deliverables: ['Data migration report', 'Reconciliation report'],
    },
    {
      project: 'PRJ-2026-002',
      name: 'Go-Live',
      description: 'Switch from legacy ERP to SAP in production',
      status: 'not_started',
      due_date: cel`daysFromNow(30)`,
      completed_at: null,
      is_critical_path: true,
      deliverables: ['Go-live checklist', 'Rollback plan', 'Support schedule'],
    },

    // PRJ-2026-003: AI Chatbot MVP
    {
      project: 'PRJ-2026-003',
      name: 'Architecture Sign-off',
      description: 'Finalize tech stack, LLM provider, and system architecture',
      status: 'not_started',
      due_date: cel`daysFromNow(21)`,
      completed_at: null,
      is_critical_path: true,
      deliverables: ['Architecture diagram', 'Tech stack decision doc'],
    },
    {
      project: 'PRJ-2026-003',
      name: 'MVP Feature Complete',
      description: 'Core chatbot features implemented and ready for QA',
      status: 'not_started',
      due_date: cel`daysFromNow(70)`,
      completed_at: null,
      is_critical_path: true,
      deliverables: ['Working chatbot prototype', 'API documentation'],
    },
    {
      project: 'PRJ-2026-003',
      name: 'Pilot Launch',
      description: 'Deploy to 10% of tier-1 support tickets for validation',
      status: 'not_started',
      due_date: cel`daysFromNow(104)`,
      completed_at: null,
      is_critical_path: true,
      deliverables: ['Pilot deployment', 'Monitoring dashboard', 'Feedback collection plan'],
    },
  ],
});
