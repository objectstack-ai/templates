// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Helpdesk Admin — full control.
 */
export const HelpdeskAdminProfile = {
  name: 'helpdesk_admin',
  label: 'Helpdesk Admin',
  isProfile: true,
  objects: {
    helpdesk_ticket:      { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: true, viewAllRecords: true, modifyAllRecords: true },
    helpdesk_customer:    { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: true, viewAllRecords: true, modifyAllRecords: true },
    helpdesk_team:        { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: true, viewAllRecords: true, modifyAllRecords: true },
    helpdesk_kb_article:  { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: true, viewAllRecords: true, modifyAllRecords: true },
    helpdesk_message:     { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: true, viewAllRecords: true, modifyAllRecords: true },
    helpdesk_sla_policy:  { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: true, viewAllRecords: true, modifyAllRecords: true },
  },
};
