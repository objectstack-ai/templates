// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Contributor — writes and ships their own content. Can read everyone
 * else's. Cannot approve a piece (the `publish_approval` process gates
 * the in_review → approved transition).
 *
 * - Full CRUD on pieces / signals / CTAs / publications / metrics they own
 * - CRUD on topics (visibility="team" shares to peers via sharing rule)
 * - Read-only on competitors / channels / templates (admin surface)
 */
export const ContributorProfile = {
  name: 'contributor',
  label: 'Contributor',
  isProfile: true,
  objects: {
    content_topic: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    content_signal: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    content_piece: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    content_publication: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    content_metric: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    content_cta: {
      allowCreate: true,
      allowRead: true,
      allowEdit: true,
      allowDelete: false,
      viewAllRecords: true,
      modifyAllRecords: false,
    },
    // Admin surface — read-only
    content_competitor: { allowRead: true, viewAllRecords: true },
    content_channel: { allowRead: true, viewAllRecords: true },
    content_template: { allowRead: true, viewAllRecords: true },
  },
};
