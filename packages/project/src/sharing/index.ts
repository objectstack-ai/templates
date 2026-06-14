// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { SharingRule } from '@objectstack/spec/security';

/**
 * Two-tier role hierarchy:
 *
 *   project_manager → viewer
 *
 * `project_manager` inherits everything a `viewer` can see, plus create/edit.
 * Row visibility is open across the portfolio by default (small PMO scale,
 * 5–20 projects); fork in a criteria sharing rule (e.g. `project_manager ==
 * currentUser`) if you need to wall projects off per manager.
 */
export const RoleHierarchy = {
  roles: [
    { name: 'project_manager', label: 'Project Manager', parentRole: null as string | null },
    { name: 'viewer', label: 'Viewer', parentRole: 'project_manager' as string | null },
  ],
};

export const allSharingRules: SharingRule[] = [];
