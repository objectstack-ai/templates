// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { pieceHook, signalHook } from '../objects/content_piece.hook';

// NOTE: the metric → publication → piece totals (`total_views` etc.) are
// STORED fields, not hook-maintained rollups. Cross-object rollups need a
// nested engine write from a hook, which is unsupported in the standalone
// runtime (the QuickJS hook sandbox crashes on nested writes; `ctx.services.data`
// is undefined inside it). See packages/expense/CHARTER.md. Maintain totals at
// the top level (client/seed) or, in a fork, via a native summary field /
// external worker.
export const allHooks = [pieceHook, signalHook];
