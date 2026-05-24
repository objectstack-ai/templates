// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Lead — full control over tasks, can approve urgent tasks.
 */
export const LeadProfile = {
  name: 'lead',
  label: 'Lead',
  isProfile: true,
  objects: {
    todo_task: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    todo_label: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
  },
};
