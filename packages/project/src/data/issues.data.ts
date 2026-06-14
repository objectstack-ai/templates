// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineSeed } from '@objectstack/spec/data';
import { Issue } from '../objects/pm_issue.object.js';

/**
 * Issues for the sample projects.
 * Current problems requiring resolution.
 * `project` references the parent project by its `name` externalId.
 */
export const issues = defineSeed(Issue, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    {
      name: 'Login page crashes on Android 12',
      issue_number: 'ISS-001',
      description: 'App crashes when users try to log in on Android 12 devices.',
      project: 'Mobile App Redesign',
      type: 'bug',
      status: 'in_progress',
      severity: 'high',
      assigned_to: null,
      resolution: null,
    },
    {
      name: 'API rate limiting too aggressive',
      issue_number: 'ISS-002',
      description: 'Third-party API rate limits are blocking legitimate requests.',
      project: 'ERP System Migration',
      type: 'bug',
      status: 'open',
      severity: 'medium',
      assigned_to: null,
      resolution: null,
    },
    {
      name: 'Staging environment down — blocks cutover testing',
      issue_number: 'ISS-003',
      description:
        'Shared staging is offline; the team cannot validate the Phase 1 data cutover until it is restored.',
      project: 'ERP System Migration',
      type: 'blocker',
      status: 'open',
      severity: 'critical',
      assigned_to: null,
      resolution: null,
    },
  ],
});
