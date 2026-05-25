// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Lead — editorial / growth lead. Approves pieces, owns competitors,
 * channels, templates, and the publication calendar. Full control across
 * every object in the template.
 */
export const LeadProfile = {
  name: 'lead',
  label: 'Lead',
  isProfile: true,
  objects: {
    content_topic: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    content_competitor: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    content_signal: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    content_piece: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    content_channel: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    content_publication: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    content_metric: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    content_cta: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
    content_template: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: true,
      viewAllRecords: true,
      modifyAllRecords: true,
    },
  },
};
