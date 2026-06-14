// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Role hierarchy. Procurement Admin inherits Buyer's grants. `finance_approver`
 * is the recipient of the high-value PR approval alert (pr_approval_required
 * flow) — kept distinct from the buyer who raised the request.
 */
export const RoleHierarchy = {
  roles: [
    { name: 'procurement_admin', label: 'Procurement Admin', parentRole: null as string | null },
    { name: 'procurement_buyer', label: 'Buyer', parentRole: 'procurement_admin' as string | null },
    {
      name: 'finance_approver',
      label: 'Finance Approver',
      parentRole: 'procurement_admin' as string | null,
    },
  ],
};
