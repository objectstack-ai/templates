// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

export { ProjectContributorSharingRule } from './project.sharing';

/**
 * Simple two-tier role hierarchy. Leads inherit Contributors' grants.
 */
export const RoleHierarchy = {
  roles: [
    { name: 'lead',        label: 'Lead',        parentRole: null as string | null },
    { name: 'contributor', label: 'Contributor', parentRole: 'lead' as string | null },
  ],
};
