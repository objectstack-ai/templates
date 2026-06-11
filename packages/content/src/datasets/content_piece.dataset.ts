// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for content_piece. */
export const ContentPieceDataset = defineDataset({
  name: 'content_piece_metrics',
  label: 'content_piece metrics',
  object: 'content_piece',
  dimensions: [
    {
      name: 'published_at',
      label: 'published_at',
      field: 'published_at',
      type: 'date',
      dateGranularity: 'month',
    },
  ],
  measures: [{ name: 'piece_count', label: 'piece_count', aggregate: 'count' }],
});
