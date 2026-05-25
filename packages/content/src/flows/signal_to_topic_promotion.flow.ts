// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Signal → Topic promotion. On `content_signal.status` flip to `promoted`,
 * create a new `content_topic` carrying the recommended title and link it
 * back via the signal's `promoted_topic` lookup.
 *
 * The `promoted_at` timestamp is stamped by a workflow on the signal
 * object itself (see `content_signal.object.ts`).
 */
export const SignalToTopicPromotionFlow: Flow = {
  name: 'content_signal_to_topic_promotion',
  label: 'Promote Signal Into Topic',
  description:
    'When a signal flips to promoted, create the matching topic and link the signal back to it.',
  type: 'record_change',

  variables: [{ name: 'signalId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'content_signal',
        criteria: 'status == "promoted" && PRIOR(status) != "promoted"',
      },
    },
    {
      id: 'get_signal',
      type: 'get_record',
      label: 'Load Signal',
      config: {
        objectName: 'content_signal',
        filter: { id: '{signalId}' },
        outputVariable: 'signal',
      },
    },
    {
      id: 'create_topic',
      type: 'create_record',
      label: 'Create Topic',
      config: {
        objectName: 'content_topic',
        values: {
          title:
            '{signal.recommended_topic_title}',
          brief:
            'Promoted from signal "{signal.headline}". Source: {signal.source_url}.\n\n{signal.summary}',
          pillar: 'industry_insight',
          funnel_stage: 'mofu',
          priority: 'normal',
          visibility: 'team',
          source_signal: '{signal.id}',
        },
        outputVariable: 'topic',
      },
    },
    {
      id: 'link_back',
      type: 'update_record',
      label: 'Link Topic Back to Signal',
      config: {
        objectName: 'content_signal',
        recordId: '{signal.id}',
        values: { promoted_topic: '{topic.id}' },
      },
    },
    {
      id: 'notify',
      type: 'script',
      label: 'Notify Owner',
      config: {
        actionType: 'notification',
        recipients: ['{signal.created_by}'],
        title: 'Topic ready: {topic.title}',
        body:
          'Signal "{signal.headline}" was promoted into a new topic. Draft when you have a slot.',
        link: '/objects/content_topic/{topic.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_signal', type: 'default' },
    { id: 'e2', source: 'get_signal', target: 'create_topic', type: 'default' },
    { id: 'e3', source: 'create_topic', target: 'link_back', type: 'default' },
    { id: 'e4', source: 'link_back', target: 'notify', type: 'default' },
    { id: 'e5', source: 'notify', target: 'end', type: 'default' },
  ],
};
