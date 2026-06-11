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
 * `dateGranularity: 'month'` + `compareTo: 'previousYear'` so the
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
      dataset: 'compliance_control_metrics',
      values: ['control_count'],
      title: 'Controls Passing',
      type: 'metric',
      filter: { last_status: 'passed' },
      colorVariant: 'success',
      layout: { x: 0, y: 0, w: 3, h: 2 },
      options: { icon: 'ShieldCheck', format: '0,0' },
    },
    {
      id: 'failing_controls',
      dataset: 'compliance_control_metrics',
      values: ['control_count'],
      title: 'Failing or Partial',
      type: 'metric',
      filter: { last_status: { $in: ['failed', 'partial'] } },
      colorVariant: 'danger',
      layout: { x: 3, y: 0, w: 3, h: 2 },
      options: { icon: 'AlertTriangle', format: '0,0' },
    },
    {
      id: 'expiring_evidence',
      dataset: 'compliance_evidence_metrics',
      values: ['evidence_count'],
      title: 'Evidence Expiring ≤ 30d',
      type: 'metric',
      filter: {
        status: 'approved',
        expires_on: { $gte: '{today}', $lte: '{30_days_from_now}' },
      },
      colorVariant: 'warning',
      layout: { x: 6, y: 0, w: 3, h: 2 },
      options: { icon: 'Clock', format: '0,0' },
    },
    {
      id: 'in_progress_assessments',
      dataset: 'compliance_assessment_metrics',
      values: ['assessment_count'],
      title: 'Assessments In Progress',
      type: 'metric',
      filter: { status: 'in_progress' },
      colorVariant: 'blue',
      layout: { x: 9, y: 0, w: 3, h: 2 },
      options: { icon: 'ClipboardCheck', format: '0,0' },
    },
    // Record listings moved to object-bound ListViews (ADR-0017): `failing_table`
    // is the Controls "Failing" tab; `expiring_evidence_table` is the Evidence
    // "Expiring ≤ 30d" tab. KPI widgets above keep the counts here.
    {
      id: 'assessments_by_month',
      dataset: 'compliance_assessment_metrics',
      dimensions: ['assessed_at'],
      values: ['assessment_count'],
      title: 'Assessments Completed by Month (last 12 months)',
      type: 'line',
      filter: {
        status: 'complete',
        assessed_at: { $gte: '{12_months_ago}' },
      },
      compareTo: 'previousYear',
      chartConfig: {
        type: 'line',
        xAxis: { field: 'assessed_at', format: '%b %Y', showGridLines: true, logarithmic: false },
        yAxis: [
          { field: 'assessment_count', format: '0,0', showGridLines: true, logarithmic: false },
        ],
        showLegend: true,
        showDataLabels: false,
      },
      layout: { x: 0, y: 7, w: 12, h: 5 },
    },
  ],
};
