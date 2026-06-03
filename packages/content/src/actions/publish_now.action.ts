// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * publish_now — manual record action on a `content_piece` in status
 * `approved` or `scheduled`. Transitions the piece to `published` and
 * creates one `content_publication` row per active entry in
 * `target_channels`. Replaces the cron-driven "publish at exactly X"
 * pattern, which spec v6 doesn't support.
 *
 * Caller wires the data layer. Idempotency: if a publication row already
 * exists for (piece, channel) we skip rather than duplicate.
 */

export interface PublishNowInput {
  pieceId: string;
  /** Override target_channels — useful when re-publishing to a single channel. */
  channelIds?: string[];
  /** ISO timestamp. Defaults to now. */
  publishedAt?: string;
}

export interface PublishNowOutput {
  pieceId: string;
  publishedAt: string;
  publicationsCreated: number;
  publicationsSkipped: number;
}

export interface PublishNowContext {
  loadPiece: (pieceId: string) => Promise<Record<string, unknown>>;
  loadChannel: (channelId: string) => Promise<Record<string, unknown>>;
  findPublication: (pieceId: string, channelId: string) => Promise<Record<string, unknown> | null>;
  createPublication: (values: Record<string, unknown>) => Promise<Record<string, unknown>>;
  updatePiece: (pieceId: string, patch: Record<string, unknown>) => Promise<void>;
}

export async function publishNow(
  input: PublishNowInput,
  ctx: PublishNowContext,
): Promise<PublishNowOutput> {
  const piece = await ctx.loadPiece(input.pieceId);
  const status = String(piece.status ?? '');
  if (status !== 'approved' && status !== 'scheduled') {
    throw new Error(
      `Piece ${input.pieceId} is in status "${status}". publish_now requires status approved or scheduled.`,
    );
  }

  const channels = input.channelIds ?? (piece.target_channels as string[] | undefined) ?? [];
  if (channels.length === 0) {
    throw new Error('Piece has no target_channels and no channelIds were supplied.');
  }

  const publishedAt = input.publishedAt ?? new Date().toISOString();
  let created = 0;
  let skipped = 0;

  for (const channelId of channels) {
    const existing = await ctx.findPublication(input.pieceId, channelId);
    if (existing) {
      skipped += 1;
      continue;
    }
    const channel = await ctx.loadChannel(channelId);
    if (channel.active === false) {
      skipped += 1;
      continue;
    }
    await ctx.createPublication({
      piece: input.pieceId,
      channel: channelId,
      published_at: publishedAt,
      public_url: channel.base_url ?? null,
    });
    created += 1;
  }

  await ctx.updatePiece(input.pieceId, {
    status: 'published',
    published_at: publishedAt,
  });

  return {
    pieceId: input.pieceId,
    publishedAt,
    publicationsCreated: created,
    publicationsSkipped: skipped,
  };
}

export const targetObjectName = 'content_piece';
