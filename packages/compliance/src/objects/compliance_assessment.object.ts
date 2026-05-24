// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { P, tmpl } from '@objectstack/spec';
import { AssessmentStateMachine } from './compliance_assessment.state';

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
    assessor: Field.lookup('user', { label: 'Assessor' }),
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
    remediation_due: Field.date({ label: 'Remediation Due' }),
  },

  stateMachines: { lifecycle: AssessmentStateMachine },

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
  compactLayout: ['title', 'control', 'status', 'cycle', 'assessed_at'],

  validations: [
    {
      name: 'failed_requires_remediation',
      type: 'script',
      severity: 'error',
      message: 'Failed or partial assessments must have a remediation_plan.',
      condition: P`(record.status == "failed" || record.status == "partial") && (record.remediation_plan == null || record.remediation_plan == "")`,
    },
    {
      name: 'completed_requires_assessor',
      type: 'script',
      severity: 'error',
      message: 'Completed assessments must record the assessor.',
      condition: P`(record.status == "passed" || record.status == "failed" || record.status == "partial") && record.assessor == null`,
    },
  ],
});
