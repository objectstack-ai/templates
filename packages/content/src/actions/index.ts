// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Actions barrel — explicit named re-exports so the per-action constant
 * `targetObjectName` doesn't collide across modules.
 *
 * NOTE: actions ship as documented building blocks. They are intentionally
 * NOT passed to `defineStack({ actions: [...] })` at v0 because the
 * action-binding API stabilises in @objectstack/spec 5.3 (see
 * contracts/extract_terms for the same pattern). Until then, invoke each
 * `*()` function from a flow `script` node, a custom REST handler, or an
 * MCP tool definition.
 */

export {
  summarizeCompetitorSignal,
  runSummarization,
  targetObjectName as summarizeCompetitorSignalTargetObject,
  type SummarizeInput,
  type SummarizeOutput,
  type SummarizeContext,
} from './summarize_competitor_signal.action';

export {
  draftOutlineFromTopic,
  runOutlineDraft,
  targetObjectName as draftOutlineFromTopicTargetObject,
  type DraftOutlineInput,
  type DraftOutlineOutput,
  type DraftOutlineContext,
} from './draft_outline_from_topic.action';

export {
  suggestCta,
  runCtaSuggestion,
  targetObjectName as suggestCtaTargetObject,
  type SuggestCtaInput,
  type SuggestCtaOutput,
  type SuggestCtaContext,
  type CtaSuggestion,
} from './suggest_cta.action';

export {
  publishNow,
  targetObjectName as publishNowTargetObject,
  type PublishNowInput,
  type PublishNowOutput,
  type PublishNowContext,
} from './publish_now.action';

export {
  recordMetricSnapshot,
  targetObjectName as recordMetricSnapshotTargetObject,
  type RecordMetricInput,
  type RecordMetricOutput,
  type RecordMetricContext,
} from './record_metric_snapshot.action';
