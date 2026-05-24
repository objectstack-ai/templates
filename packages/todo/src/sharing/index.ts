// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Simple two-tier role hierarchy. Leads inherit Contributors' grants.
 * Used by the urgent-task approval (approvers: 'lead') and the profiles.
 */
export const RoleHierarchy = {
  roles: [
    { name: 'lead', label: 'Lead', parentRole: null as string | null },
    { name: 'contributor', label: 'Contributor', parentRole: 'lead' as string | null },
  ],
};
