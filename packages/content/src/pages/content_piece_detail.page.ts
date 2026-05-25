// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Page } from '@objectstack/spec/ui';

/**
 * Piece detail page — slotted, overrides only the header. The default-page
 * synthesizer fills in highlights, related lists (publications, CTAs,
 * metrics), and the polymorphic discussion slot from sys_comment.
 */
export const PieceDetailPage = {
  name: 'content_piece_detail_page',
  label: 'Piece Detail',
  description:
    'Slotted detail page for a content piece — header override only; defaults synthesize everything else.',
  type: 'record',
  object: 'content_piece',
  kind: 'slotted',
  regions: [],
  slots: {
    header: {
      type: 'page:header',
      id: 'content_piece_header_slotted',
      label: 'Piece Header',
      properties: {
        title: '{title}',
        subtitle: '{status} · {format} · {publish_at}',
        eyebrow: 'CONTENT PIECE',
        icon: 'file-text',
        breadcrumb: true,
      },
    },
  },
} as unknown as Page;
