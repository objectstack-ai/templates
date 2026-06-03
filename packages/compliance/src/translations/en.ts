// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

export const en: TranslationData = {
  objects: {
    compliance_framework: {
      label: 'Framework',
      pluralLabel: 'Frameworks',
      description: 'A compliance standard you are certifying against.',
      fields: {
        short_name: { label: 'Short Name' },
        full_name: { label: 'Full Name' },
        family: {
          label: 'Family',
          options: {
            soc2: 'SOC 2',
            iso27001: 'ISO 27001 / 27002',
            hipaa: 'HIPAA',
            gdpr: 'GDPR',
            pci: 'PCI DSS',
            nist_csf: 'NIST CSF',
            custom: 'Custom',
          },
        },
        version: { label: 'Version' },
        status: {
          label: 'Status',
          options: { active: 'Active', adopted: 'Adopted', retired: 'Retired' },
        },
        next_audit_date: { label: 'Next Audit Date' },
        auditor: { label: 'External Auditor' },
        description: { label: 'Description' },
      },
    },

    compliance_control: {
      label: 'Control',
      pluralLabel: 'Controls',
      description: 'An individual control requirement that needs evidence and periodic assessment.',
      fields: {
        code: { label: 'Control Code' },
        title: { label: 'Title' },
        framework: { label: 'Framework' },
        category: {
          label: 'Category',
          options: {
            access: 'Access Control',
            change: 'Change Management',
            risk: 'Risk Management',
            vendor: 'Vendor Management',
            incident: 'Incident Response',
            data: 'Data Protection',
            physical: 'Physical Security',
            other: 'Other',
          },
        },
        criticality: {
          label: 'Criticality',
          options: { high: 'High', medium: 'Medium', low: 'Low' },
        },
        last_status: {
          label: 'Last Test Result',
          options: {
            not_tested: 'Not Tested',
            passed: 'Passed',
            partial: 'Partial',
            failed: 'Failed',
          },
        },
        description: { label: 'Description' },
        owner: { label: 'Control Owner' },
        review_frequency_days: { label: 'Review Frequency (days)' },
        last_assessed_at: { label: 'Last Assessed At' },
        is_overdue_for_review: { label: 'Overdue for Review' },
        notes: { label: 'Notes' },
      },
      _views: {
        all_controls: { label: 'All Controls', description: 'Every control, grouped by framework' },
        control_board: {
          label: 'Control Board',
          description: 'Kanban grouped by last test result',
        },
        my_controls: { label: 'My Controls', description: 'Controls you own' },
        failing_controls: {
          label: 'Failing Controls',
          description: 'Controls with failed or partial last result',
        },
        overdue_controls: {
          label: 'Overdue for Review',
          description: 'Controls past their review-frequency window',
        },
      },
    },

    compliance_evidence: {
      label: 'Evidence',
      pluralLabel: 'Evidence',
      description: 'Proof supporting one or more controls.',
      fields: {
        title: { label: 'Title' },
        control: { label: 'Primary Control' },
        evidence_type: {
          label: 'Type',
          options: {
            policy: 'Policy Document',
            screenshot: 'Screenshot',
            log: 'System Log Export',
            config: 'Configuration Export',
            training: 'Training Record',
            pentest: 'Penetration Test Report',
            audit_letter: 'External Audit Letter',
            other: 'Other',
          },
        },
        status: {
          label: 'Status',
          options: {
            pending: 'Pending',
            submitted: 'Submitted',
            approved: 'Approved',
            rejected: 'Rejected',
            expired: 'Expired',
          },
        },
        description: { label: 'Description' },
        collected_on: { label: 'Collected On' },
        expires_on: { label: 'Expires On' },
        is_expiring_soon: { label: 'Expiring ≤ 30 days' },
        is_expired: { label: 'Expired' },
        collected_by: { label: 'Collected By' },
        approved_by: { label: 'Approved By' },
        source_url: { label: 'Source URL' },
        notes: { label: 'Notes' },
      },
      _views: {
        all_evidence: { label: 'All Evidence' },
        pending_evidence: { label: 'Pending Review' },
        expiring_evidence: { label: 'Expiring ≤ 30 Days' },
      },
    },

    compliance_assessment: {
      label: 'Assessment',
      pluralLabel: 'Assessments',
      description: 'A periodic test of a control.',
      fields: {
        title: { label: 'Title' },
        control: { label: 'Control' },
        cycle: { label: 'Assessment Cycle' },
        assessed_at: { label: 'Assessed At' },
        assessor: { label: 'Assessor' },
        status: {
          label: 'Status',
          options: {
            planned: 'Planned',
            in_progress: 'In Progress',
            passed: 'Passed',
            partial: 'Partial',
            failed: 'Failed',
          },
        },
        finding: { label: 'Finding' },
        remediation_plan: { label: 'Remediation Plan' },
        remediation_due: { label: 'Remediation Due' },
      },
      _views: {
        all_assessments: { label: 'All Assessments' },
        failed_assessments: { label: 'Failed Assessments' },
        in_progress_assessments: { label: 'In Progress' },
      },
    },
  },

  apps: {
    compliance: {
      label: 'Compliance',
      description: 'Compliance posture & evidence management on ObjectStack.',
      navigation: {
        nav_dashboard: { label: 'Control Posture' },
        nav_framework: { label: 'Frameworks' },
        nav_control: { label: 'Controls' },
        nav_evidence: { label: 'Evidence' },
        nav_assessment: { label: 'Assessments' },
      },
    },
  },

  messages: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'success.saved': 'Saved successfully',
    'error.required': 'This field is required',
  },

  validationMessages: {
    review_frequency_positive: 'review_frequency_days must be positive.',
    submitted_requires_collected_on: 'Submitted evidence must have a collected_on date.',
    expires_after_collected: 'expires_on must be on or after collected_on.',
    failed_requires_remediation: 'Failed or partial assessments must have a remediation_plan.',
    completed_requires_assessor: 'Completed assessments must record the assessor.',
  },

  dashboards: {
    control_posture_dashboard: {
      label: 'Control Posture',
      description: 'Pass rate, failing controls, expiring evidence, and in-flight assessments.',
      actions: { create_assessment: { label: 'New Assessment' } },
      widgets: {
        passing_controls: {
          title: 'Controls Passing',
          description: 'Controls whose most recent assessment passed',
        },
        failing_controls: {
          title: 'Failing or Partial',
          description: 'Controls whose most recent assessment failed or was partial',
        },
        expiring_evidence: {
          title: 'Evidence Expiring ≤ 30d',
          description: 'Approved evidence with expires_on within 30 days',
        },
        in_progress_assessments: {
          title: 'Assessments In Progress',
          description: 'Assessments currently being conducted',
        },
        failing_table: { title: 'Failing Controls (Action Required)' },
        expiring_evidence_table: { title: 'Evidence Expiring Soon' },
      },
    },
  },
};
