// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { SignalToTopicPromotionFlow } from './signal_to_topic_promotion.flow';
import { CtaCreationDefaultFlow } from './cta_creation_default.flow';
import { PublishApprovalFlow } from './publish_approval.flow';
import { StampLifecycleTimestampsFlow } from './stamp_lifecycle_timestamps.flow';

// NOTE: the metric → publication → piece rollup was removed. Its `script`
// aggregation nodes declared no `actionType`/`function`, so they were a proven
// runtime no-op (cross-object aggregation has no built-in action and nested
// engine writes are unsupported in the standalone QuickJS hook sandbox — see
// hooks/index.ts). @objectstack 9.11.0 now rejects such dead script nodes at
// build time. The `total_*` columns remain seed/client-maintained stored fields.
export const allFlows = [
  SignalToTopicPromotionFlow,
  CtaCreationDefaultFlow,
  PublishApprovalFlow,
  StampLifecycleTimestampsFlow,
];
