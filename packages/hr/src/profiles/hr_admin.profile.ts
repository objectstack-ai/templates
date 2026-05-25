// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * HR Admin — full read/write across all HR objects, including sensitive
 * employee fields. Owns the dashboard and approves time-off escalations.
 */
export const HrAdminProfile = {
  name: 'hr_admin',
  label: 'HR Admin',
  isProfile: true,
  objects: {
    hr_employee: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    hr_department: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    hr_time_off_request: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    hr_document: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
  },
};
