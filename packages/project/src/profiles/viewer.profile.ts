// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Viewer — read-only portfolio access for sponsors / execs / stakeholders.
 * Sees everything, changes nothing.
 */
const readOnly = {
  allowCreate: false,
  allowRead: true,
  allowEdit: false,
  allowDelete: false,
  viewAllRecords: true,
  modifyAllRecords: false,
};

export const ViewerProfile = {
  name: 'viewer',
  label: 'Viewer',
  isProfile: true,
  objects: {
    pm_project: { ...readOnly },
    pm_milestone: { ...readOnly },
    pm_risk: { ...readOnly },
    pm_issue: { ...readOnly },
    pm_resource: { ...readOnly },
    pm_timesheet: { ...readOnly },
  },
};
