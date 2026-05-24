// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Page } from '@objectstack/spec/ui';

/**
 * Contract detail page — slotted, overrides only the header. The default
 * synthesizer fills in highlights, related lists, history, and the
 * polymorphic `sys_comment` discussion slot.
 *
 * Files / attachments: `enable.files: true` on the Contract object
 * provisions the polymorphic `sys_attachment` storage path, so PDFs can be
 * uploaded via the REST API today. Surfacing them as a "Files" panel on
 * this page requires `kind: 'custom'` with an explicit
 * `record:related_list` region (Spec 5.2 does not auto-render attachments
 * on slotted pages). Left as a fork point.
 */
export const ContractDetailPage = {
  name: 'contracts_contract_detail_page',
  label: 'Contract Detail',
  description:
    'Slotted detail page for Contract — header override only; defaults synthesize the rest.',
  type: 'record',
  object: 'contracts_contract',
  kind: 'slotted',
  regions: [],
  slots: {
    header: {
      type: 'page:header',
      id: 'contracts_contract_header_slotted',
      label: 'Contract Header',
      properties: {
        title: '{title}',
        subtitle: '{party} · {contract_type} · {status}',
        eyebrow: 'CONTRACT',
        icon: 'file-text',
        breadcrumb: true,
      },
    },
  },
} as unknown as Page;
