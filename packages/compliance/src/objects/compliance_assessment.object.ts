// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, F } from '@objectstack/spec';
/**
 * Assessment — a discrete test of a control. Each control should have
 * one per `review_frequency_days`. Result rolls up onto Control.last_status.
 */
export const Assessment = ObjectSchema.create({
  name: 'compliance_assessment',
  sharingModel: 'private',
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
    // `date` (not `datetime`): assessments are reported at day granularity, and
    // dashboard time-series filters (`assessed_at >= {N_months_ago}`) only match
    // when the column stores an ISO date string — a `datetime` epoch column never
    // matches the analytics layer's ISO-string date tokens in SQLite. See AGENTS.md.
    assessed_at: Field.date({
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
    searchable: true,
    apiEnabled: true,
    trash: true,
    mru: true,
  },

  indexes: [
    { fields: ['control'] },
    { fields: ['status'] },
    { fields: ['cycle'] },
    { fields: ['assessed_at'] },
  ],

  nameField: 'title',
  highlightFields: ['title', 'control', 'status', 'remediation_status', 'cycle', 'assessed_at'],

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
      // `assessor` is an OPTIONAL sys_user lookup. Seed/import/automation paths
      // legitimately create completed assessments without a resolvable user
      // reference (lookup seeds resolve by natural-key string; there is no
      // seed-time user to point at), so this is a soft data-quality signal —
      // surfaced in the UI — rather than a hard insert blocker. (9.9.x now
      // evaluates `== null` rules on insert, which is why error-severity here
      // rejected the seeded assessments outright.)
      name: 'completed_requires_assessor',
      type: 'script',
      severity: 'warning',
      message: 'Completed assessments should record the assessor.',
      condition: P`(record.status == "passed" || record.status == "failed" || record.status == "partial") && record.assessor == null`,
    },
  ],
});
