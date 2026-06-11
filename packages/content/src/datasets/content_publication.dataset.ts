// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for content_publication. */
export const ContentPublicationDataset = defineDataset({
  name: 'content_publication_metrics',
  label: 'content_publication metrics',
  object: 'content_publication',
  dimensions: [{ name: 'channel', label: 'channel', field: 'channel', type: 'string' }],
  measures: [
    { name: 'publication_count', label: 'publication_count', aggregate: 'count' },
    { name: 'sum_total_views', label: 'sum_total_views', aggregate: 'sum', field: 'total_views' },
    {
      name: 'sum_total_clicks',
      label: 'sum_total_clicks',
      aggregate: 'sum',
      field: 'total_clicks',
    },
    {
      name: 'sum_total_signups',
      label: 'sum_total_signups',
      aggregate: 'sum',
      field: 'total_signups',
    },
    {
      name: 'sum_total_revenue',
      label: 'sum_total_revenue',
      aggregate: 'sum',
      field: 'total_revenue',
    },
  ],
});
