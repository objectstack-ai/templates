// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { SharingRule } from '@objectstack/spec/security';

/**
 * Two-tier role hierarchy:
 *
 *   hr_admin → hr_employee
 *
 * `hr_admin` inherits everything `hr_employee` can do, plus visibility into
 * sensitive fields and approver capabilities.
 */
export const RoleHierarchy = {
  roles: [
    { name: 'hr_admin', label: 'HR Admin', parentRole: null as string | null },
    { name: 'hr_employee', label: 'Employee', parentRole: 'hr_admin' as string | null },
  ],
};

/**
 * time_off_hr_admin_visibility — time-off requests are visible only to the
 * requester and HR Admins. Manager review happens through the notification
 * + the polymorphic record-detail page; widening visibility to the whole
 * company would leak medical/personal context.
 *
 * Owner-only access is the default per-row behaviour. We grant HR Admins
 * (the `hr_admin` role explicitly — NOT `role_and_subordinates`, because in
 * this template `hr_admin` is the root of the hierarchy with `hr_employee`
 * as a child, so subordinates would mean "every employee").
 */
export const TimeOffPrivacyRule: SharingRule = {
  name: 'time_off_hr_admin_visibility',
  label: 'HR Admins See All Time-Off Requests',
  description:
    'Time-off requests are owner-private by default; HR Admins also get edit access so they can audit and intervene.',
  object: 'hr_time_off_request',
  type: 'criteria',
  sharedWith: { type: 'role', value: 'hr_admin' },
  accessLevel: 'edit',
  condition: { dialect: 'cel', source: 'true' },
  active: true,
};

export const allSharingRules: SharingRule[] = [TimeOffPrivacyRule];
