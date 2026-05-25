// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Page } from '@objectstack/spec/ui';

/**
 * Employee detail — slotted page, header override only. The default
 * record-page renderer fills in highlights, related lists (documents,
 * time-off, direct reports via the manager lookup), and feed/history.
 */
export const EmployeeDetailPage = {
  name: 'hr_employee_detail_page',
  label: 'Employee Detail',
  description: 'Slotted detail page for an employee record — header override only.',
  type: 'record',
  object: 'hr_employee',
  kind: 'slotted',
  regions: [],
  slots: {
    header: {
      type: 'page:header',
      id: 'hr_employee_header_slotted',
      label: 'Employee Header',
      properties: {
        title: '{full_name}',
        subtitle: '{job_title} · {department} · Reports to {manager} · {tenure_years}y · {status}',
        eyebrow: 'EMPLOYEE',
        icon: 'user',
        breadcrumb: true,
      },
    },
  },
} as unknown as Page;
