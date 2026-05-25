// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { SignalToTopicPromotionFlow } from './signal_to_topic_promotion.flow';
import { CtaCreationDefaultFlow } from './cta_creation_default.flow';
import { PublicationRollupFlow } from './publication_rollup.flow';
import { StampLifecycleTimestampsFlow } from './stamp_lifecycle_timestamps.flow';

export const allFlows = [
  SignalToTopicPromotionFlow,
  CtaCreationDefaultFlow,
  PublicationRollupFlow,
  StampLifecycleTimestampsFlow,
];
