// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Framework } from '../objects/compliance_framework.object';
import { Control } from '../objects/compliance_control.object';
import { Evidence } from '../objects/compliance_evidence.object';
import { Assessment } from '../objects/compliance_assessment.object';

/**
 * Seed data — exercises full template surface:
 *   • 3 frameworks (SOC2, ISO27001, GDPR)
 *   • 6 controls across them, mixed criticality & status
 *   • 7 pieces of evidence, including one expiring soon + one expired
 *   • 5 assessments covering planned / in_progress / passed / failed / partial
 */

const frameworks = defineDataset(Framework, {
  mode: 'upsert',
  externalId: 'short_name',
  records: [
    { short_name: 'SOC2',     full_name: 'SOC 2 Type II — Trust Services Criteria (2017)', family: 'soc2',     version: '2017', status: 'active',  next_audit_date: cel`daysFromNow(120)`, auditor: 'Acme CPA LLP' },
    { short_name: 'ISO27001', full_name: 'ISO/IEC 27001:2022 Information Security Management', family: 'iso27001', version: '2022', status: 'adopted', next_audit_date: cel`daysFromNow(300)`, auditor: 'Bureau Veritas' },
    { short_name: 'GDPR',     full_name: 'General Data Protection Regulation (EU) 2016/679', family: 'gdpr',     version: '2016', status: 'active' },
  ],
});

const controls = defineDataset(Control, {
  mode: 'upsert',
  externalId: 'code',
  records: [
    { code: 'CC6.1', title: 'Logical Access Controls', framework: 'SOC2',     category: 'access',   criticality: 'high',   last_status: 'passed', review_frequency_days: 90,  last_assessed_at: cel`daysAgo(20)`,  description: 'The entity implements logical access controls to protect data.' },
    { code: 'CC7.1', title: 'Vulnerability Management', framework: 'SOC2',    category: 'change',   criticality: 'high',   last_status: 'failed', review_frequency_days: 90,  last_assessed_at: cel`daysAgo(5)`,   description: 'Vulnerability scans run monthly; remediation in SLA.' },
    { code: 'CC8.1', title: 'Change Management',        framework: 'SOC2',    category: 'change',   criticality: 'medium', last_status: 'partial', review_frequency_days: 90, last_assessed_at: cel`daysAgo(50)`,  description: 'All production changes are peer-reviewed and approved.' },
    { code: 'A.5.1', title: 'Information Security Policies', framework: 'ISO27001', category: 'risk', criticality: 'high', last_status: 'passed', review_frequency_days: 180, last_assessed_at: cel`daysAgo(100)`, description: 'Information security policies approved by management & published.' },
    { code: 'A.8.16', title: 'Monitoring Activities',     framework: 'ISO27001', category: 'incident', criticality: 'medium', last_status: 'not_tested', review_frequency_days: 90, description: 'Networks, systems and apps monitored for anomalous behaviour.' },
    { code: 'Art.32', title: 'Security of Processing',   framework: 'GDPR',    category: 'data',     criticality: 'high', last_status: 'passed', review_frequency_days: 180, last_assessed_at: cel`daysAgo(200)`, description: 'Appropriate technical & organisational measures to ensure security of personal data. Past review-frequency window.' },
  ],
});

const evidence = defineDataset(Evidence, {
  mode: 'upsert',
  externalId: 'title',
  records: [
    { title: 'Q1 access review export', control: 'CC6.1', evidence_type: 'config', status: 'approved', collected_on: cel`daysAgo(20)`, expires_on: cel`daysFromNow(70)`, notes: 'Quarterly access review CSV.' },
    { title: 'March 2026 Nessus scan',  control: 'CC7.1', evidence_type: 'pentest', status: 'approved', collected_on: cel`daysAgo(35)`, expires_on: cel`daysFromNow(25)`, notes: 'Monthly scan — next due in 25 days; will trigger expiring flow at T-7.' },
    { title: 'PR review screenshots — Mar', control: 'CC8.1', evidence_type: 'screenshot', status: 'submitted', collected_on: cel`daysAgo(2)`, expires_on: cel`daysFromNow(88)` },
    { title: 'InfoSec Policy v3.2',     control: 'A.5.1', evidence_type: 'policy', status: 'approved', collected_on: cel`daysAgo(100)`, expires_on: cel`daysFromNow(265)` },
    { title: 'Datadog log retention setting', control: 'A.8.16', evidence_type: 'screenshot', status: 'pending', collected_on: cel`daysAgo(1)` },
    { title: 'DPA — Cloudwell hosting',  control: 'Art.32', evidence_type: 'audit_letter', status: 'approved', collected_on: cel`daysAgo(200)`, expires_on: cel`daysAgo(10)`, notes: 'Already expired — should trigger auto-expire flow.' },
    { title: 'Encryption at rest config — RDS', control: 'Art.32', evidence_type: 'config', status: 'approved', collected_on: cel`daysAgo(40)`, expires_on: cel`daysFromNow(7)`, notes: 'Will fire 7-day expiring alert today.' },
  ],
});

const assessments = defineDataset(Assessment, {
  mode: 'upsert',
  externalId: 'title',
  records: [
    { title: '2026-Q1 access review', control: 'CC6.1', cycle: '2026-Q1', assessed_at: cel`daysAgo(20)`, status: 'passed',     finding: 'All terminated users disabled within 24h. No exceptions found.' },
    { title: '2026-Q1 vuln scan review', control: 'CC7.1', cycle: '2026-Q1', assessed_at: cel`daysAgo(5)`, status: 'failed',
      finding: 'Two high-severity CVEs open past 30-day SLA on edge servers.',
      remediation_plan: 'Patch edge servers in next maintenance window (2026-04-15).',
      remediation_due: cel`daysFromNow(14)` },
    { title: '2026-Q1 change-mgmt sample', control: 'CC8.1', cycle: '2026-Q1', assessed_at: cel`daysAgo(50)`, status: 'partial',
      finding: '3 of 25 PRs sampled lacked documented reviewer.',
      remediation_plan: 'Enforce required-reviewer via repo settings; re-test in Q2.',
      remediation_due: cel`daysFromNow(30)` },
    { title: '2025-H2 policy attestation', control: 'A.5.1', cycle: '2025-H2', assessed_at: cel`daysAgo(100)`, status: 'passed',
      finding: 'All 47 employees attested.' },
    { title: '2026-Q1 GDPR Art.32 review', control: 'Art.32', cycle: '2026-Q1', status: 'in_progress',
      finding: 'Encryption-at-rest confirmed; key rotation policy under review.' },
  ],
});

export const ComplianceSeedData = [frameworks, controls, evidence, assessments];
