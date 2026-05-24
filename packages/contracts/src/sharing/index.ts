// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Two-tier role hierarchy. Legal Admins inherit Contract Owners' grants.
 */
export const RoleHierarchy = {
  roles: [
    { name: 'legal_admin', label: 'Legal Admin', parentRole: null as string | null },
    { name: 'contract_owner', label: 'Contract Owner', parentRole: 'legal_admin' as string | null },
  ],
};
