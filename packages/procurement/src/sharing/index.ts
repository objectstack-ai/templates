// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Two-tier role hierarchy. Procurement Admin inherits Buyer's grants.
 */
export const RoleHierarchy = {
  roles: [
    { name: 'procurement_admin', label: 'Procurement Admin', parentRole: null as string | null },
    { name: 'procurement_buyer', label: 'Buyer', parentRole: 'procurement_admin' as string | null },
  ],
};
