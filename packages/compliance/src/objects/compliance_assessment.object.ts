// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F, tmpl } from '@objectstack/spec';
/**
 * Assessment — a discrete test of a control. Each control should have
 * one per `review_frequency_days`. Result rolls up onto Control.last_status.
 */
export const Assessment = ObjectSchema.create({
  name: 'compliance_assessment',
  label: 'Assessment',
  pluralLabel: 'Assessments',
  icon: 'clipboard-check',
  description: 'A periodic test of a control. Result feeds the dashboard.',

  fields: {
    title: Field.text({
      label: 'Title',
      required: true,
      maxLength: 200,
      searchable: true,
    }),
    control: Field.lookup('compliance_control', {
      label: 'Control',
      required: true,
    }),
    cycle: Field.text({
      label: 'Assessment Cycle',
      maxLength: 40,
      description: 'e.g. "2026-Q1" — groups assessments for reporting.',
    }),
    assessed_at: Field.datetime({
      label: 'Assessed At',
    }),
    assessor: Field.lookup('sys_user', { label: 'Assessor' }),
    status: Field.select({
      label: 'Status',
      required: true,
      options: [
        { label: 'Planned', value: 'planned', color: '#94A3B8', default: true },
        { label: 'In Progress', value: 'in_progress', color: '#3B82F6' },
        { label: 'Passed', value: 'passed', color: '#10B981' },
        { label: 'Partial', value: 'partial', color: '#F59E0B' },
        { label: 'Failed', value: 'failed', color: '#EF4444' },
      ],
    }),
    finding: Field.markdown({
      label: 'Finding',
      description: 'What was tested, what was found, what (if anything) is broken.',
    }),
    remediation_plan: Field.markdown({
      label: 'Remediation Plan',
      description: 'Required when status is failed or partial.',
    }),
    remediation_status: Field.select({
      label: 'Remediation Status',
      description: 'Tracks the fix for a failed/partial finding to closure.',
      options: [
        { label: 'Open', value: 'open', color: '#EF4444' },
        { label: 'In Progress', value: 'in_progress', color: '#F59E0B' },
        { label: 'Resolved', value: 'resolved', color: '#10B981' },
        { label: 'Risk Accepted', value: 'risk_accepted', color: '#6B7280' },
      ],
    }),
    remediation_due: Field.date({ label: 'Remediation Due' }),
    is_remediation_overdue: Field.formula({
      label: 'Remediation Overdue',
      description: 'Past the remediation due date and not yet resolved / risk-accepted.',
      expression: F`record.remediation_due != null && record.remediation_due < today() && record.remediation_status != "resolved" && record.remediation_status != "risk_accepted"`,
    }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    files: true,
    feeds: true,
    activities: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['control'] },
    { fields: ['status'] },
    { fields: ['cycle'] },
    { fields: ['assessed_at'] },
  ],

  titleFormat: tmpl`{{record.title}}`,
  compactLayout: ['title', 'control', 'status', 'remediation_status', 'cycle', 'assessed_at'],

  validations: [
    {
      type: 'state_machine',
      name: 'assessment_lifecycle',
      field: 'status',
      transitions: {
        planned: ['in_progress'],
        in_progress: ['passed', 'failed', 'partial'],
        passed: ['in_progress'],
        failed: ['in_progress'],
        partial: ['in_progress'],
      },
      message: 'Illegal status transition.',
    },
    {
      name: 'failed_requires_remediation',
      type: 'script',
      severity: 'error',
      message: 'Failed or partial assessments must have a remediation_plan.',
      condition: P`(record.status == "failed" || record.status == "partial") && (record.remediation_plan == null || record.remediation_plan == "")`,
    },
    {
      // Advisory (warning) rather than a hard error: `assessor` is a `sys_user`
      // lookup, and seed/historical records cannot portably reference a user
      // (the standalone runtime seeds no users beyond the dev admin, whose id is
      // not stable across installs). As of @objectstack 9.11.0 a `field == null`
      // script rule fires on insert too (platform #1871), so an `error` here
      // would reject every seeded completed assessment. A fork with real users
      // can promote this back to `severity: 'error'`.
      name: 'completed_requires_assessor',
      type: 'script',
      severity: 'warning',
      message: 'Completed assessments should record the assessor.',
      condition: P`(record.status == "passed" || record.status == "failed" || record.status == "partial") && record.assessor == null`,
    },
  ],
});
