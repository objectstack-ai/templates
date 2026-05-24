import { P } from '@objectstack/spec';
// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Share active projects with the `contributor` role so any team member can
 * see and update them, regardless of ownership.
 */
export const ProjectContributorSharingRule = {
  name: 'project_contributor_sharing',
  label: 'Active Projects → Contributors',
  object: 'project',
  type: 'criteria' as const,
  condition: P`record.status == "active"`,
  accessLevel: 'edit' as const,
  sharedWith: { type: 'role' as const, value: 'contributor' },
};
