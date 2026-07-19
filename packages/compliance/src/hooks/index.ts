// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { evidenceHook } from '../objects/compliance_evidence.hook';
import { assessmentRollupHook } from '../objects/compliance_assessment.hook';

// `compliance_control.last_status` / `last_assessed_at` are a LIVE roll-up of the
// most recent completed assessment, maintained by `assessmentRollupHook` via a
// nested `ctx.api` write to the parent control (see compliance_assessment.hook.ts).
// This is a *non-aggregate* rollup ("latest", not a sum/count), so a native
// `summary` field can't express it — a nested-write hook is the right tool. That
// write used to crash the QuickJS hook sandbox (framework#1867); it is fixed now,
// so these fields are no longer hand-maintained by seed/client.
export const allHooks = [evidenceHook, assessmentRollupHook];
