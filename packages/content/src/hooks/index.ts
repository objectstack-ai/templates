// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { pieceHook, signalHook } from '../objects/content_piece.hook';

// NOTE: the metric → publication → piece totals (`total_views` etc.) are native
// `Field.summary` roll-ups on content_publication / content_piece (#1870) — the
// engine recomputes them server-side on child insert/update/delete. They are NOT
// hook-maintained: a cross-object rollup write from a hook is unsupported in the
// standalone QuickJS runtime (nested writes crash; `ctx.services.data` is
// undefined inside it), which is why the declarative summary-field route is used.
export const allHooks = [pieceHook, signalHook];
