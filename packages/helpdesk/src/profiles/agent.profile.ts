// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Support Agent — works tickets and messages, reads everything else.
 */
export const AgentProfile = {
  name: 'helpdesk_agent',
  label: 'Support Agent',
  isProfile: true,
  objects: {
    helpdesk_ticket: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    helpdesk_message: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    helpdesk_customer: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    helpdesk_kb_article: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    helpdesk_team: {
      allowCreate: false,
      allowRead: true,
      allowEdit: false,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    helpdesk_sla_policy: {
      allowCreate: false,
      allowRead: true,
      allowEdit: false,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
  },
};
