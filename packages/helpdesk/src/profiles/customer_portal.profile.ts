// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Customer Portal User — sees only their own tickets and messages.
 * Record-level filtering is enforced by sharing rules (omitted in this
 * template — add a sharing rule that constrains helpdesk_ticket.customer
 * == currentUser.contact_id in your fork).
 */
export const CustomerPortalProfile = {
  name: 'helpdesk_customer',
  label: 'Customer Portal User',
  isProfile: true,
  objects: {
    helpdesk_ticket:      { allowCreate: true, allowRead: true, allowEdit: true, allowDelete: false, viewAllRecords: false, modifyAllRecords: false },
    helpdesk_message:     { allowCreate: true, allowRead: true, allowEdit: false, allowDelete: false, viewAllRecords: false, modifyAllRecords: false },
    helpdesk_kb_article:  { allowCreate: false, allowRead: true, allowEdit: false, allowDelete: false, viewAllRecords: true, modifyAllRecords: false },
    helpdesk_customer:    { allowCreate: false, allowRead: true, allowEdit: false, allowDelete: false, viewAllRecords: false, modifyAllRecords: false },
    helpdesk_team:        { allowCreate: false, allowRead: false, allowEdit: false, allowDelete: false, viewAllRecords: false, modifyAllRecords: false },
    helpdesk_sla_policy:  { allowCreate: false, allowRead: false, allowEdit: false, allowDelete: false, viewAllRecords: false, modifyAllRecords: false },
  },
};
