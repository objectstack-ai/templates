// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Contributor — can manage their own work and read everyone else's.
 */
export const ContributorProfile = {
  name: 'contributor',
  label: 'Contributor',
  isProfile: true,
  objects: {
    todo_task: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    todo_label: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
  },
};
