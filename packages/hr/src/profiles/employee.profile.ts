// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Employee — self-service profile. Can read the directory and org chart,
 * file their own time-off requests, and view their own documents.
 *
 * Sensitive employee fields (salary, contract_type, national_id_last4) are
 * not exposed to peers by default; field-level visibility is enforced by
 * the platform once the profile is in place.
 */
export const EmployeeProfile = {
  name: 'hr_employee',
  label: 'Employee',
  isProfile: true,
  fields: {
    'hr_employee.salary': { readable: false, editable: false },
    'hr_employee.contract_type': { readable: false, editable: false },
    'hr_employee.national_id_last4': { readable: false, editable: false },
    'hr_employee.notes': { readable: false, editable: false },
  },
  objects: {
    hr_employee: {
      allowCreate: false,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    hr_department: {
      allowCreate: false,
      allowRead: true,
      allowEdit: false,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    hr_time_off_request: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: false,
      modifyAllRecords: false,
    },
    hr_document: {
      allowCreate: false,
      allowRead: true,
      allowEdit: false,
      allowDelete: false,
      viewAllRecords: false,
      modifyAllRecords: false,
    },
  },
};
