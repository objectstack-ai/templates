// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * HR Dashboard — landing pane for HR Admins. Surfaces pending time-off
 * approvals, recent joiners, expiring documents, and a directory snapshot.
 *
 * Trend overlay: "New Hires (30d)" carries `compareTo: 'previousPeriod'`
 * (this 30d vs. prior 30d) so the HR admin lands on a hiring-velocity
 * delta. The new "Hires by Month" line uses `categoryGranularity:
 * 'month'` + `compareTo: 'previousYear'` to expose YoY hiring patterns
 * — the question every comp-cycle planning meeting opens with.
 */
export const HrAdminDashboard: Dashboard = {
  name: 'hr_admin_dashboard',
  label: 'HR Dashboard',
  description: 'Pending approvals, recent joiners, and document expiries at a glance.',

  columns: 12,
  gap: 4,
  refreshInterval: 300,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [
      { label: 'New Employee', icon: 'Plus', actionType: 'modal', actionUrl: 'create_employee' },
    ],
  },

  widgets: [
    {
      id: 'headcount',
      title: 'Active Headcount',
      type: 'metric',
      object: 'hr_employee',
      filter: { status: 'active' },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'Users', format: '0,0' },
    },
    {
      id: 'on_leave',
      title: 'On Leave',
      type: 'metric',
      object: 'hr_employee',
      filter: { status: 'on_leave' },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'CalendarOff', format: '0,0' },
    },
    {
      id: 'new_hires_30d',
      title: 'New Hires (30d)',
      type: 'metric',
      object: 'hr_employee',
      filter: { hire_date: { $gte: '{30_days_ago}' }, status: { $ne: 'terminated' } },
      aggregate: 'count',
      compareTo: 'previousPeriod',
      colorVariant: 'success',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'UserPlus', format: '0,0' },
    },
    {
      id: 'pending_time_off',
      title: 'My Pending Approvals',
      type: 'metric',
      object: 'hr_time_off_request',
      filter: { status: 'submitted', approver: '{current_user_id}' },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'expiring_docs',
      title: 'Documents Expiring (30d)',
      type: 'metric',
      object: 'hr_document',
      filter: {
        expires_at: { $gte: '{today}', $lte: '{today+30}' },
      },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 0, y: 2, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'expired_docs',
      title: 'Already Expired',
      type: 'metric',
      object: 'hr_document',
      filter: { expires_at: { $lt: '{today}' } },
      aggregate: 'count',
      colorVariant: 'danger',
      layout: { x: 3, y: 2, w: 3, h: 2 },
      options: { icon: 'XCircle', format: '0,0' },
    },
    {
      id: 'headcount_by_dept',
      title: 'Headcount by Department',
      type: 'bar',
      object: 'hr_employee',
      filter: { status: { $ne: 'terminated' } },
      aggregate: 'count',
      categoryField: 'department',
      layout: { x: 0, y: 4, w: 6, h: 4 },
    },
    {
      id: 'ooo_today',
      title: 'Out of Office Today',
      type: 'table',
      object: 'hr_time_off_request',
      aggregate: 'count',
      filter: {
        status: 'approved',
        start_date: { $lte: '{today}' },
        end_date: { $gte: '{today}' },
      },
      layout: { x: 6, y: 4, w: 6, h: 4 },
      options: {
        columns: ['employee', 'leave_type', 'start_date', 'end_date'],
        pageSize: 10,
        sort: [{ field: 'end_date', order: 'asc' }],
      },
    },
    {
      id: 'pending_time_off_table',
      title: 'My Pending Time-Off Requests',
      type: 'table',
      object: 'hr_time_off_request',
      aggregate: 'count',
      filter: { status: 'submitted', approver: '{current_user_id}' },
      layout: { x: 0, y: 8, w: 8, h: 5 },
      options: {
        columns: ['employee', 'leave_type', 'start_date', 'end_date', 'days', 'submitted_at'],
        pageSize: 10,
        sort: [{ field: 'start_date', order: 'asc' }],
      },
    },
    {
      id: 'expiring_docs_table',
      title: 'Documents Expiring Soon',
      type: 'table',
      object: 'hr_document',
      aggregate: 'count',
      filter: { expires_at: { $gte: '{today}', $lte: '{today+30}' } },
      layout: { x: 8, y: 8, w: 4, h: 5 },
      options: {
        columns: ['name', 'employee', 'doc_type', 'expires_at'],
        pageSize: 10,
        sort: [{ field: 'expires_at', order: 'asc' }],
      },
    },
    {
      id: 'hires_by_month',
      title: 'Hires by Month (last 12 months)',
      type: 'line',
      object: 'hr_employee',
      filter: { hire_date: { $gte: '{12_months_ago}' } },
      aggregate: 'count',
      categoryField: 'hire_date',
      categoryGranularity: 'month',
      compareTo: 'previousYear',
      chartConfig: {
        type: 'line',
        xAxis: { field: 'hire_date', format: '%b %Y', showGridLines: true, logarithmic: false },
        yAxis: [{ field: 'value', format: '0,0', showGridLines: true, logarithmic: false }],
        showLegend: true,
        showDataLabels: false,
      },
      layout: { x: 0, y: 13, w: 12, h: 5 },
    },
  ],
};
