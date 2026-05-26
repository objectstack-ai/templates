// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Issue } from '../objects/pm_issue.object';

/**
 * Issues (bugs, blockers, questions) for the 3 sample projects:
 *   • PRJ-2026-001: 2 issues (1 open, 1 resolved)
 *   • PRJ-2026-002: 3 issues (2 open, 1 resolved)
 *   • PRJ-2026-003: 1 issue (open)
 */
export const issues = defineDataset(Issue, {
  mode: 'upsert',
  externalId: 'issue_number',
  records: [
    // PRJ-2026-001: Mobile App Redesign
    {
      issue_number: 'ISS-001-001',
      project: 'PRJ-2026-001',
      name: 'iOS app crashes on iPhone SE',
      description: 'App crashes immediately after launch on iPhone SE (1st gen) running iOS 15.7. Stack trace shows UIKit layout issue.',
      type: 'bug',
      status: 'open',
      priority: 'high',
      reported_by: 'admin',
      assigned_to: 'admin',
      reported_at: cel`daysAgo(3)`,
      resolved_at: null,
    },
    {
      issue_number: 'ISS-001-002',
      project: 'PRJ-2026-001',
      name: 'Design tokens missing for dark mode',
      description: 'Figma file has light mode tokens but dark mode colors are incomplete',
      type: 'bug',
      status: 'resolved',
      priority: 'normal',
      reported_by: 'admin',
      assigned_to: 'admin',
      reported_at: cel`daysAgo(25)`,
      resolved_at: cel`daysAgo(23)`,
      resolution: 'Designer added dark mode tokens to design system',
    },

    // PRJ-2026-002: ERP System Migration
    {
      issue_number: 'ISS-002-001',
      project: 'PRJ-2026-002',
      name: 'SAP environment down for 2 days',
      description: 'SAP sandbox environment has been offline since May 24. Vendor investigating.',
      type: 'blocker',
      status: 'open',
      priority: 'urgent',
      reported_by: 'admin',
      assigned_to: null,
      reported_at: cel`daysAgo(1)`,
      resolved_at: null,
    },
    {
      issue_number: 'ISS-002-002',
      project: 'PRJ-2026-002',
      name: 'Missing purchase order data in migration',
      description: 'Discovered 15% of purchase orders are missing the "approved_by" field, causing validation errors',
      type: 'bug',
      status: 'open',
      priority: 'high',
      reported_by: 'admin',
      assigned_to: 'admin',
      reported_at: cel`daysAgo(5)`,
      resolved_at: null,
    },
    {
      issue_number: 'ISS-002-003',
      project: 'PRJ-2026-002',
      name: 'Training video links broken',
      description: 'All 6 training video links in the LMS return 404 errors',
      type: 'bug',
      status: 'resolved',
      priority: 'normal',
      reported_by: 'admin',
      assigned_to: 'admin',
      reported_at: cel`daysAgo(14)`,
      resolved_at: cel`daysAgo(13)`,
      resolution: 'Updated video URLs in LMS, re-uploaded 2 missing videos',
    },

    // PRJ-2026-003: AI Chatbot MVP
    {
      issue_number: 'ISS-003-001',
      project: 'PRJ-2026-003',
      name: 'Which LLM provider should we use?',
      description: 'Need to decide between OpenAI GPT-4, Anthropic Claude, or local Llama 3. Considerations: cost, latency, privacy.',
      type: 'question',
      status: 'open',
      priority: 'high',
      reported_by: 'admin',
      assigned_to: 'admin',
      reported_at: cel`daysAgo(7)`,
      resolved_at: null,
    },
  ],
});
