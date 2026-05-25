// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * CTA creation default — on `content_piece` insert, if no CTAs exist yet,
 * drop a starter CTA derived from the first target channel's default goal.
 * Saves authors from a per-piece "did I forget the CTA?" round-trip.
 *
 * The flow fires after-insert so we can read the just-created piece. If
 * the piece is created without target_channels populated, the flow does
 * nothing — there's nothing to derive a goal from.
 */
export const CtaCreationDefaultFlow: Flow = {
  name: 'content_piece_cta_creation_default',
  label: 'Auto-Create Default CTA',
  description: 'On piece creation, drop one default CTA derived from the primary target channel.',
  type: 'record_change',

  variables: [{ name: 'pieceId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'content_piece',
        criteria: 'target_channels != NULL AND ISNEW()',
      },
    },
    {
      id: 'get_piece',
      type: 'get_record',
      label: 'Load Piece',
      config: {
        objectName: 'content_piece',
        filter: { id: '{pieceId}' },
        outputVariable: 'piece',
      },
    },
    {
      id: 'get_first_channel',
      type: 'get_record',
      label: 'Load Primary Channel',
      config: {
        objectName: 'content_channel',
        filter: { id: '{piece.target_channels.0}' },
        outputVariable: 'channel',
      },
    },
    {
      id: 'create_cta',
      type: 'create_record',
      label: 'Create Default CTA',
      config: {
        objectName: 'content_cta',
        values: {
          piece: '{piece.id}',
          label_text: 'Get started',
          goal: '{channel.default_cta_goal}',
          destination_url: '{channel.base_url}',
          variant: 'default',
          is_primary: true,
        },
      },
    },
    { id: 'end', type: 'end', label: 'End' },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_piece', type: 'default' },
    { id: 'e2', source: 'get_piece', target: 'get_first_channel', type: 'default' },
    { id: 'e3', source: 'get_first_channel', target: 'create_cta', type: 'default' },
    { id: 'e4', source: 'create_cta', target: 'end', type: 'default' },
  ],
};
