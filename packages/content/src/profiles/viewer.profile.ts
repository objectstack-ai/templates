// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Viewer — read-only across all content_*, plus the polymorphic comment
 * surface (sys_comment is platform-managed via `enable.feeds`). Cannot
 * edit or create anything.
 */
export const ViewerProfile = {
  name: 'viewer',
  label: 'Viewer',
  isProfile: true,
  objects: {
    content_topic: { allowRead: true, viewAllRecords: true },
    content_competitor: { allowRead: true, viewAllRecords: true },
    content_signal: { allowRead: true, viewAllRecords: true },
    content_piece: { allowRead: true, viewAllRecords: true },
    content_channel: { allowRead: true, viewAllRecords: true },
    content_publication: { allowRead: true, viewAllRecords: true },
    content_metric: { allowRead: true, viewAllRecords: true },
    content_cta: { allowRead: true, viewAllRecords: true },
    content_template: { allowRead: true, viewAllRecords: true },
  },
};
