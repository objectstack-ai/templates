// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Control Owner — day-to-day. Maintains controls + collects evidence,
 * logs assessments. Cannot edit framework master.
 */
export const ControlOwnerProfile = {
  name: 'compliance_control_owner',
  label: 'Control Owner',
  isProfile: true,
  objects: {
    compliance_framework:  { allowCreate: false, allowRead: true,  allowEdit: false, allowDelete: false, viewAllRecords: true, modifyAllRecords: false },
    compliance_control:    { allowCreate: true,  allowRead: true,  allowEdit: true,  allowDelete: false, viewAllRecords: true, modifyAllRecords: false },
    compliance_evidence:   { allowCreate: true,  allowRead: true,  allowEdit: true,  allowDelete: false, viewAllRecords: true, modifyAllRecords: false },
    compliance_assessment: { allowCreate: true,  allowRead: true,  allowEdit: true,  allowDelete: false, viewAllRecords: true, modifyAllRecords: false },
  },
};
