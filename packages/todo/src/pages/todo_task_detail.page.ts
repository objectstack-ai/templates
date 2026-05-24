// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { Page } from '@objectstack/spec/ui';

/**
 * Task detail page — slotted, overrides only the header. The default-page
 * synthesizer fills in highlights, related lists, history, and the
 * polymorphic `sys_comment` / `sys_attachment` discussion slot.
 */
export const TaskDetailPage = {
  name: 'todo_task_detail_page',
  label: 'Task Detail',
  description:
    'Slotted detail page for Task — header override only; defaults synthesize everything else.',
  type: 'record',
  object: 'todo_task',
  kind: 'slotted',
  regions: [],
  slots: {
    header: {
      type: 'page:header',
      id: 'todo_task_header_slotted',
      label: 'Task Header',
      properties: {
        title: '{subject}',
        subtitle: '{status} · {priority}',
        eyebrow: 'TASK',
        icon: 'check-square',
        breadcrumb: true,
      },
    },
  },
} as unknown as Page;
