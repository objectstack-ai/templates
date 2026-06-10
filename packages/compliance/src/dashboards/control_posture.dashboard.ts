// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Dashboard } from '@objectstack/spec/ui';

/**
 * Control Posture — landing dashboard. Surfaces:
 *  • how many controls are passing right now
 *  • what's failing (priority)
 *  • evidence that's about to expire (action queue)
 *  • assessments in flight
 *
 * Trend overlay: the new "Assessments by Month" line chart uses
 * `categoryGranularity: 'month'` + `compareTo: 'previousYear'` so the
 * compliance lead can see whether assessment cadence is keeping pace with
 * the prior year — the question audit committees ask first.
 *
 * As with other templates, filters use base fields only.
 */
export const ControlPostureDashboard: Dashboard = {
  name: 'control_posture_dashboard',
  label: 'Control Posture',
  description: 'Pass rate, failing controls, expiring evidence, and in-flight assessments.',

  columns: 12,
  gap: 4,
  refreshInterval: 300,

  header: {
    showTitle: true,
    showDescription: true,
    actions: [
      {
        label: 'New Assessment',
        icon: 'Plus',
        actionType: 'modal',
        actionUrl: 'create_assessment',
      },
    ],
  },

  widgets: [
    {
      id: 'passing_controls',
      dataset: 'compliance_control_metrics', values: ['control_count'],
      title: 'Controls Passing',
      type: 'metric',
      object: 'compliance_control',
      filter: { last_status: 'passed' },
      aggregate: 'count',
      colorVariant: 'success',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'ShieldCheck', format: '0,0' },
    },
    {
      id: 'failing_controls',
      dataset: 'compliance_control_metrics', values: ['control_count'],
      title: 'Failing or Partial',
      type: 'metric',
      object: 'compliance_control',
      filter: { last_status: { $in: ['failed', 'partial'] } },
      aggregate: 'count',
      colorVariant: 'danger',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'expiring_evidence',
      dataset: 'compliance_evidence_metrics', values: ['evidence_count'],
      title: 'Evidence Expiring ≤ 30d',
      type: 'metric',
      object: 'compliance_evidence',
      filter: {
        status: 'approved',
        expires_on: { $gte: '{today}', $lte: '{30_days_from_now}' },
      },
      aggregate: 'count',
      colorVariant: 'warning',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'in_progress_assessments',
      dataset: 'compliance_assessment_metrics', values: ['assessment_count'],
      title: 'Assessments In Progress',
      type: 'metric',
      object: 'compliance_assessment',
      filter: { status: 'in_progress' },
      aggregate: 'count',
      colorVariant: 'blue',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'ClipboardCheck', format: '0,0' },
    },
    {
      id: 'failing_table',
      dataset: 'compliance_control_metrics', values: ['control_count'],
      title: 'Failing Controls (Action Required)',
      type: 'table',
      object: 'compliance_control',
      aggregate: 'count',
      filter: { last_status: { $in: ['failed', 'partial'] } },
      layout: { x: 0, y: 2, w: 8, h: 5 },
      options: {
        columns: ['code', 'title', 'framework', 'criticality', 'last_assessed_at'],
        pageSize: 10,
        sort: [
          { field: 'criticality', order: 'asc' },
          { field: 'code', order: 'asc' },
        ],
      },
    },
    {
      id: 'expiring_evidence_table',
      dataset: 'compliance_evidence_metrics', values: ['evidence_count'],
      title: 'Evidence Expiring Soon',
      type: 'table',
      object: 'compliance_evidence',
      aggregate: 'count',
      filter: {
        status: 'approved',
        expires_on: { $gte: '{today}' },
      },
      layout: { x: 8, y: 2, w: 4, h: 5 },
      options: {
        columns: ['title', 'control', 'expires_on'],
        pageSize: 10,
        sort: [{ field: 'expires_on', order: 'asc' }],
      },
    },
    {
      id: 'assessments_by_month',
      dataset: 'compliance_assessment_metrics', dimensions: ['assessed_at'], values: ['assessment_count'],
      title: 'Assessments Completed by Month (last 12 months)',
      type: 'line',
      object: 'compliance_assessment',
      filter: {
        status: 'complete',
        assessed_at: { $gte: '{12_months_ago}' },
      },
      aggregate: 'count',
      categoryField: 'assessed_at',
      categoryGranularity: 'month',
      compareTo: 'previousYear',
      chartConfig: {
        type: 'line',
        xAxis: { field: 'assessed_at', format: '%b %Y', showGridLines: true, logarithmic: false },
        yAxis: [{ field: 'value', format: '0,0', showGridLines: true, logarithmic: false }],
        showLegend: true,
        showDataLabels: false,
      },
      layout: { x: 0, y: 7, w: 12, h: 5 },
    },
  ],
};
