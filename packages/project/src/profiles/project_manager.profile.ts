// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Project Manager — runs projects day to day: creates and edits projects,
 * milestones, risks, issues, allocations, and logs time. Can see the whole
 * portfolio (collaboration) but does not hard-delete by default.
 */
const crud = {
  allowCreate: true,
  allowRead: true,
  allowEdit: true,
  allowDelete: false,
  viewAllRecords: true,
  modifyAllRecords: true,
};

export const ProjectManagerProfile = {
  name: 'project_manager',
  label: 'Project Manager',
  isProfile: true,
  objects: {
    pm_project: { ...crud },
    pm_milestone: { ...crud },
    pm_risk: { ...crud },
    pm_issue: { ...crud },
    pm_resource: { ...crud },
    pm_timesheet: { ...crud, allowDelete: true },
  },
};
