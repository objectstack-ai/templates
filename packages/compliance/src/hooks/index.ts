// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { evidenceHook } from '../objects/compliance_evidence.hook';

// NOTE: `compliance_control.last_status` / `last_assessed_at` are STORED fields,
// not a hook-maintained rollup from assessments. A cross-object rollup needs a
// nested engine write from a hook, which is unsupported in the standalone
// runtime (the QuickJS hook sandbox crashes on nested writes; `ctx.services.data`
// is undefined inside it). See packages/expense/CHARTER.md. Maintain them at the
// top level (client/seed) or, in a fork, via a native summary field / external
// worker.
export const allHooks = [evidenceHook];
