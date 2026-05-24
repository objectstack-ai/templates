// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Contributor — can manage their own work and read everyone else's.
 * Cannot delete projects or change ownership.
 */
export const ContributorProfile = {
  name: 'contributor',
  label: 'Contributor',
  isProfile: true,
  objects: {
    project:    { allowCreate: true,  allowRead: true,  allowEdit: true,  allowDelete: false, viewAllRecords: true,  modifyAllRecords: false },
    task:       { allowCreate: true,  allowRead: true,  allowEdit: true,  allowDelete: true,  viewAllRecords: true,  modifyAllRecords: false },
    label:      { allowCreate: true,  allowRead: true,  allowEdit: true,  allowDelete: false, viewAllRecords: true,  modifyAllRecords: false },
    task_label: { allowCreate: true,  allowRead: true,  allowEdit: true,  allowDelete: true,  viewAllRecords: true,  modifyAllRecords: false },
  },
};
