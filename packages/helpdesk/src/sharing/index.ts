// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Three-tier role hierarchy:
 *   helpdesk_admin   — full control of all objects (parent of manager)
 *   helpdesk_manager — manages teams, SLA policies, KB; reads everything
 *   helpdesk_agent   — handles tickets & messages, reads KB / customers
 *   helpdesk_customer — portal user: sees only their own tickets/messages
 */
export const RoleHierarchy = {
  roles: [
    { name: 'helpdesk_admin', label: 'Helpdesk Admin', parentRole: null as string | null },
    {
      name: 'helpdesk_manager',
      label: 'Support Manager',
      parentRole: 'helpdesk_admin' as string | null,
    },
    {
      name: 'helpdesk_agent',
      label: 'Support Agent',
      parentRole: 'helpdesk_manager' as string | null,
    },
    { name: 'helpdesk_customer', label: 'Customer Portal User', parentRole: null as string | null },
  ],
};
