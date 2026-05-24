// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Page } from '@objectstack/spec/ui';

export const ControlDetailPage = {
  name: 'compliance_control_detail_page',
  label: 'Control Detail',
  description: 'Slotted detail page for Control — header override only.',
  type: 'record',
  object: 'compliance_control',
  kind: 'slotted',
  regions: [],
  slots: {
    header: {
      type: 'page:header',
      id: 'compliance_control_header_slotted',
      label: 'Control Header',
      properties: {
        title: '{code} · {title}',
        subtitle: '{framework} · {criticality} · last: {last_status}',
        eyebrow: 'CONTROL',
        icon: 'shield',
        breadcrumb: true,
      },
    },
  },
} as unknown as Page;
