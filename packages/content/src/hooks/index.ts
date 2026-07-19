// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { pieceHook, signalHook } from '../objects/content_piece.hook';

// NOTE: the metric → publication → piece totals (`total_views` etc.) are native
// `Field.summary` roll-ups on content_publication / content_piece (#1870) — the
// engine recomputes them server-side on child insert/update/delete. A pure
// sum/max like these is expressed declaratively as a `summary` field rather than
// a hook because it needs to be delete-safe: the engine captures the child's FK
// pre-image on delete and recomputes the parent, whereas an `afterDelete` hook
// only receives `{ id }` and can't tell which parent to fix. (Nested cross-object
// writes from hooks are now safe — framework#1867 is fixed — so a hook is the
// right tool for a *non-aggregate* rollup; for these pure aggregates the summary
// field stays the better fit.)
export const allHooks = [pieceHook, signalHook];
