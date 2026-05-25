// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * suggest_cta — generate 2 CTA variants for a piece based on its topic
 * and primary target channel. Returns suggestions so the caller can
 * present them inline; with `apply = true` writes both as new
 * `content_cta` rows on the piece.
 */

declare const process: { env: Record<string, string | undefined> } | undefined;

export interface SuggestCtaInput {
  pieceId: string;
  apply?: boolean;
  model?: string;
}

export interface CtaSuggestion {
  label_text: string;
  goal: 'signup' | 'demo' | 'subscribe' | 'read' | 'watch';
  destination_hint: string;
  rationale: string;
}

export interface SuggestCtaOutput {
  pieceId: string;
  suggestions: CtaSuggestion[];
  appliedCount: number;
}

const SYSTEM_PROMPT = `You suggest CTAs for content marketing pieces.
Read the piece context (title, summary, topic pillar, target channel) and
return JSON of the form:
{
  "suggestions": [
    {
      "label_text": "<= 5-word button copy",
      "goal": "signup"|"demo"|"subscribe"|"read"|"watch",
      "destination_hint": "What the link should point to (relative path
                            or description).",
      "rationale": "One sentence — why this CTA fits."
    },
    { ... second variant for A/B test ... }
  ]
}
Always return exactly 2 variants of MEANINGFULLY different shapes
(e.g. soft-ask vs. hard-ask). No emoji.`;

export interface SuggestCtaContext {
  loadPiece: (pieceId: string) => Promise<Record<string, unknown>>;
  loadTopic?: (topicId: string) => Promise<Record<string, unknown>>;
  loadChannel?: (channelId: string) => Promise<Record<string, unknown>>;
  createCta?: (cta: Record<string, unknown>) => Promise<void>;
}

export async function runCtaSuggestion(
  context: string,
  model = (typeof process !== 'undefined' && process?.env?.OBJECTSTACK_CONTENT_MODEL) || 'gpt-5',
): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process?.env?.OPENAI_API_KEY) || undefined;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set. Edit runCtaSuggestion() to call your own LLM.');
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      temperature: 0.6,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: context.slice(0, 20_000) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM call failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? '{}';
}

export async function suggestCta(
  input: SuggestCtaInput,
  ctx: SuggestCtaContext,
): Promise<SuggestCtaOutput> {
  const piece = await ctx.loadPiece(input.pieceId);
  const topic = ctx.loadTopic && piece.topic
    ? await ctx.loadTopic(String(piece.topic))
    : undefined;
  const targetChannelIds = (piece.target_channels as string[] | undefined) ?? [];
  const channel = ctx.loadChannel && targetChannelIds[0]
    ? await ctx.loadChannel(targetChannelIds[0])
    : undefined;

  const promptCtx = `PIECE TITLE: ${piece.title ?? ''}
SUMMARY: ${piece.summary ?? ''}
FORMAT: ${piece.format ?? ''}
TOPIC PILLAR: ${topic?.pillar ?? ''}
TOPIC FUNNEL_STAGE: ${topic?.funnel_stage ?? ''}
PRIMARY CHANNEL: ${channel?.name ?? ''} (${channel?.kind ?? ''})
CHANNEL DEFAULT GOAL: ${channel?.default_cta_goal ?? ''}`;

  const raw = await runCtaSuggestion(promptCtx, input.model);
  let parsed: { suggestions?: CtaSuggestion[] } = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`LLM returned non-JSON: ${raw.slice(0, 300)}`);
  }
  const suggestions = (parsed.suggestions ?? []).slice(0, 2);

  let applied = 0;
  if (input.apply && ctx.createCta) {
    for (const [i, s] of suggestions.entries()) {
      await ctx.createCta({
        piece: input.pieceId,
        label_text: s.label_text,
        goal: s.goal,
        destination_url: s.destination_hint,
        variant: `ai_${i + 1}`,
        is_primary: false,
      });
      applied += 1;
    }
  }

  return {
    pieceId: input.pieceId,
    suggestions,
    appliedCount: applied,
  };
}

export const targetObjectName = 'content_piece';
