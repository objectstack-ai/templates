// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

export const RoleHierarchy = {
  roles: [
    { name: 'compliance_admin', label: 'Compliance Admin', parentRole: null as string | null },
    {
      name: 'compliance_control_owner',
      label: 'Control Owner',
      parentRole: 'compliance_admin' as string | null,
    },
  ],
};
