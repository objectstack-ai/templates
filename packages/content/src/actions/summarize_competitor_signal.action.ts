// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * summarize_competitor_signal — AI-summarises a captured signal's source
 * URL into a ~2-paragraph summary plus a recommended topic title.
 * Writes back to `signal.summary` and `signal.recommended_topic_title`.
 *
 * Mirrors the shape of `contracts/extract_terms.action.ts` — the action
 * owns prompt + parsing + write-back, the caller injects the LLM client
 * and the data layer. The action-binding API stabilises in @objectstack/spec
 * 5.3; until then, invoke `summarizeCompetitorSignal()` directly from a
 * flow `script` node, a REST handler, or an MCP tool.
 */

declare const process: { env: Record<string, string | undefined> } | undefined;

export interface SummarizeInput {
  signalId: string;
  model?: string;
  /** Force re-summarisation even if a summary already exists. */
  force?: boolean;
}

export interface SummarizeOutput {
  signalId: string;
  summary: string;
  recommendedTopicTitle: string;
}

const SYSTEM_PROMPT = `You summarise marketing/competitive intelligence
signals for an editorial team. Read the signal context (headline + optional
source body) and return JSON of the form:
{
  "summary": "2 short paragraphs in markdown. First paragraph: what
              happened in 2-3 sentences. Second paragraph: why it matters
              for our content strategy.",
  "recommended_topic_title": "<= 12-word title for the content piece we
                              would write in response. Active voice."
}
Do not invent facts. If the source is thin, be explicit about it.`;

export interface SummarizeContext {
  loadSignal: (signalId: string) => Promise<Record<string, unknown>>;
  loadSourceText: (signalId: string) => Promise<string>;
  updateSignal: (signalId: string, patch: Record<string, unknown>) => Promise<void>;
}

export async function runSummarization(
  context: string,
  model = (typeof process !== 'undefined' && process?.env?.OBJECTSTACK_CONTENT_MODEL) || 'gpt-5',
): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process?.env?.OPENAI_API_KEY) || undefined;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set. Edit runSummarization() to call your own LLM.');
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: context.slice(0, 60_000) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM call failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? '{}';
}

export async function summarizeCompetitorSignal(
  input: SummarizeInput,
  ctx: SummarizeContext,
): Promise<SummarizeOutput> {
  const signal = await ctx.loadSignal(input.signalId);
  if (!input.force && signal.summary) {
    return {
      signalId: input.signalId,
      summary: String(signal.summary),
      recommendedTopicTitle: String(signal.recommended_topic_title ?? ''),
    };
  }

  const sourceText = await ctx.loadSourceText(input.signalId).catch(() => '');
  const promptCtx = `HEADLINE: ${signal.headline ?? ''}
SOURCE_URL: ${signal.source_url ?? ''}
SOURCE_KIND: ${signal.source_kind ?? ''}
SOURCE_BODY:
${sourceText.slice(0, 40_000)}`;

  const raw = await runSummarization(promptCtx, input.model);
  let parsed: { summary?: string; recommended_topic_title?: string } = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`LLM returned non-JSON: ${raw.slice(0, 300)}`);
  }

  const summary = parsed.summary ?? '';
  const recommendedTopicTitle = parsed.recommended_topic_title ?? '';
  await ctx.updateSignal(input.signalId, {
    summary,
    recommended_topic_title: recommendedTopicTitle,
  });

  return {
    signalId: input.signalId,
    summary,
    recommendedTopicTitle,
  };
}

export const targetObjectName = 'content_signal';
