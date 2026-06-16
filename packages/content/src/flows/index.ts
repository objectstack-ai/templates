// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { SignalToTopicPromotionFlow } from './signal_to_topic_promotion.flow';
import { CtaCreationDefaultFlow } from './cta_creation_default.flow';
import { PublishApprovalFlow } from './publish_approval.flow';
import { StampLifecycleTimestampsFlow } from './stamp_lifecycle_timestamps.flow';

// NOTE: publication → piece metric totals are now native `Field.summary`
// roll-ups on content_publication / content_piece (#1870), recomputed by the
// engine on child change. The old `publication_rollup` flow is removed — its
// script-node "aggregations" never ran (the automation engine has no aggregate
// node), so the totals were silently never updated.
export const allFlows = [
  SignalToTopicPromotionFlow,
  CtaCreationDefaultFlow,
  PublishApprovalFlow,
  StampLifecycleTimestampsFlow,
];
