// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Compliance Admin — full control. Maintains framework catalog,
 * approves evidence, hard-deletes (rarely).
 */
export const ComplianceAdminProfile = {
  name: 'compliance_admin',
  label: 'Compliance Admin',
  isProfile: true,
  objects: {
    compliance_framework: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    compliance_control: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    compliance_evidence: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    compliance_assessment: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
  },
};
