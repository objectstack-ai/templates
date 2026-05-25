// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineView } from '@objectstack/spec/ui';

export const MessageViews = defineView({
  list: {
    type: 'grid',
    name: 'all_messages',
    label: 'All Messages',
    data: { provider: 'object', object: 'helpdesk_message' },
    columns: [
      { field: 'sent_at', width: 170, sortable: true },
      { field: 'ticket', width: 280, link: true },
      { field: 'direction', width: 130 },
      { field: 'author_user', width: 180 },
      { field: 'author_customer', width: 200 },
      { field: 'is_ai_drafted', width: 110, align: 'center' },
      { field: 'name', width: 360 },
    ],
    sort: [{ field: 'sent_at', order: 'desc' }],
    pagination: { pageSize: 50 },
  },
  form: {
    type: 'tabbed',
    data: { provider: 'object', object: 'helpdesk_message' },
    sections: [
      {
        label: 'Message',
        columns: 2,
        fields: [
          'ticket',
          'direction',
          'author_user',
          'author_customer',
          'is_ai_drafted',
          'sent_at',
          { field: 'body', colSpan: 2 },
        ],
      },
    ],
  },
});
