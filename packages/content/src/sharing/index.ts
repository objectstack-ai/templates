// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { SharingRule } from '@objectstack/spec/security';

/**
 * Three-tier role hierarchy. Higher tiers inherit lower-tier grants.
 *
 *   lead → contributor → viewer
 */
export const RoleHierarchy = {
  roles: [
    { name: 'lead', label: 'Lead', parentRole: null as string | null },
    { name: 'contributor', label: 'Contributor', parentRole: 'lead' as string | null },
    { name: 'viewer', label: 'Viewer', parentRole: 'contributor' as string | null },
  ],
};

/**
 * topic_team_scope — share a topic to the team when `visibility = "team"`.
 * Private topics stay owner-only (the default per-row access). Pieces
 * inherit their parent topic's visibility through the lookup chain — no
 * extra rule needed.
 *
 * Criteria-based rule: any record matching the predicate is shared at the
 * configured access level to every role in the hierarchy.
 */
export const TopicTeamScopeRule: SharingRule = {
  name: 'topic_team_scope',
  label: 'Team-Visible Topics',
  description:
    'Topics marked visibility=team are readable+editable by every team member. Private topics remain owner-only.',
  object: 'content_topic',
  type: 'criteria',
  // The role hierarchy puts `lead` at the top, so role_and_subordinates(lead)
  // grants edit access to lead → contributor → viewer in one shot.
  sharedWith: { type: 'role_and_subordinates', value: 'lead' },
  accessLevel: 'edit',
  condition: { dialect: 'cel', source: 'record.visibility == "team"' },
  active: true,
};

export const allSharingRules: SharingRule[] = [TopicTeamScopeRule];
