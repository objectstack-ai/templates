// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Notify the editor when a piece is submitted for review. The lifecycle
 * timestamps themselves (`submitted_at` / `approved_at` / `published_at` /
 * `archived_at`) are stamped declaratively by per-object workflows
 * (see `content_piece.object.ts`). This flow only handles the human
 * side: pinging the right person at the right moment.
 *
 * Triggers on `status` change. Routes by destination state.
 */
export const StampLifecycleTimestampsFlow: Flow = {
  name: 'content_piece_lifecycle_notifications',
  label: 'Editorial Lifecycle Notifications',
  description:
    'Ping the editor on submission, the writer on approval / change-request, and the owner on publish.',
  type: 'record_change',

  variables: [{ name: 'pieceId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'content_piece',
        triggerType: 'record-after-update',
        condition: 'ISCHANGED(status)',
      },
    },
    {
      id: 'get_piece',
      type: 'get_record',
      label: 'Load Piece',
      config: {
        objectName: 'content_piece',
        filter: { id: '{record.id}' },
        outputVariable: 'piece',
      },
    },
    {
      id: 'route_submitted',
      type: 'decision',
      label: 'Just Submitted?',
      config: {
        condition: 'piece.status == "in_review"',
      },
    },
    {
      id: 'notify_editor',
      type: 'notify',
      label: 'Notify Editor',
      config: {
        recipients: ['{piece.editor}'],
        title: 'Review ready: {piece.title}',
        body: '{piece.assignee} submitted "{piece.title}" for your review.',
        actionUrl: '/objects/content_piece/{piece.id}',
      },
    },
    {
      id: 'route_published',
      type: 'decision',
      label: 'Just Published?',
      config: {
        condition: 'piece.status == "published"',
      },
    },
    {
      id: 'notify_published',
      type: 'notify',
      label: 'Notify Writer',
      config: {
        recipients: ['{piece.assignee}'],
        title: 'Live: {piece.title}',
        body: '"{piece.title}" is published. Metrics will appear after the first snapshot is recorded.',
        actionUrl: '/objects/content_piece/{piece.id}',
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_piece', type: 'default' },
    { id: 'e2', source: 'get_piece', target: 'route_submitted', type: 'default' },
    { id: 'e3', source: 'route_submitted', target: 'notify_editor', type: 'conditional' },
    { id: 'e4', source: 'notify_editor', target: 'route_published', type: 'default' },
    { id: 'e5', source: 'route_submitted', target: 'route_published', type: 'default' },
    { id: 'e6', source: 'route_published', target: 'notify_published', type: 'conditional' },
    { id: 'e7', source: 'notify_published', target: 'end', type: 'default' },
    { id: 'e8', source: 'route_published', target: 'end', type: 'default' },
  ],
};
