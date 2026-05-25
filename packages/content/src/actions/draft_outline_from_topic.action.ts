// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * draft_outline_from_topic — generate a markdown outline for a content
 * piece, optionally pre-populated from a content_template's structure.
 *
 * Returns the outline so the caller can preview before applying; with
 * `apply = true` it writes back to a target piece's `body_outline`.
 *
 * Same shape as the other AI actions: caller supplies the data ctx and
 * LLM seam.
 */

declare const process: { env: Record<string, string | undefined> } | undefined;

export interface DraftOutlineInput {
  topicId: string;
  /** Optional template the outline should follow. */
  templateId?: string;
  /** Optional piece to patch with the generated outline. */
  pieceId?: string;
  apply?: boolean;
  model?: string;
}

export interface DraftOutlineOutput {
  topicId: string;
  outlineMarkdown: string;
  appliedToPieceId?: string;
}

const SYSTEM_PROMPT = `You draft outlines for content pieces. Read the
topic brief and an optional template skeleton; return JSON of the form:
{
  "outline_markdown": "Markdown outline. Start with H1, then 4-6 H2
                       sections with 1-3 bullet sub-points each. End with a
                       'CTA' H2 suggesting where the call-to-action lands."
}
Match the template's structure when one is supplied. Keep section headings
specific (not generic like 'Introduction'). Do not write paragraph copy.`;

export interface DraftOutlineContext {
  loadTopic: (topicId: string) => Promise<Record<string, unknown>>;
  loadTemplate?: (templateId: string) => Promise<Record<string, unknown>>;
  updatePiece?: (pieceId: string, patch: Record<string, unknown>) => Promise<void>;
}

export async function runOutlineDraft(
  context: string,
  model = (typeof process !== 'undefined' && process?.env?.OBJECTSTACK_CONTENT_MODEL) || 'gpt-5',
): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process?.env?.OPENAI_API_KEY) || undefined;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set. Edit runOutlineDraft() to call your own LLM.');
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: context.slice(0, 30_000) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM call failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? '{}';
}

export async function draftOutlineFromTopic(
  input: DraftOutlineInput,
  ctx: DraftOutlineContext,
): Promise<DraftOutlineOutput> {
  const topic = await ctx.loadTopic(input.topicId);
  let template: Record<string, unknown> | undefined;
  if (input.templateId && ctx.loadTemplate) {
    template = await ctx.loadTemplate(input.templateId);
  }

  const promptCtx = `TOPIC TITLE: ${topic.title ?? ''}
PILLAR: ${topic.pillar ?? ''}
FUNNEL_STAGE: ${topic.funnel_stage ?? ''}
TARGET_KEYWORD: ${topic.target_keyword ?? ''}
BRIEF:
${topic.brief ?? ''}

TEMPLATE SKELETON:
${template?.outline_markdown ?? '(none — design from scratch)'}
TARGET WORD COUNT: ${template?.target_word_count ?? 'unspecified'}`;

  const raw = await runOutlineDraft(promptCtx, input.model);
  let parsed: { outline_markdown?: string } = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`LLM returned non-JSON: ${raw.slice(0, 300)}`);
  }

  const outlineMarkdown = parsed.outline_markdown ?? '';
  if (input.apply && input.pieceId && ctx.updatePiece) {
    await ctx.updatePiece(input.pieceId, { body_outline: outlineMarkdown });
  }

  return {
    topicId: input.topicId,
    outlineMarkdown,
    appliedToPieceId: input.apply ? input.pieceId : undefined,
  };
}

export const targetObjectName = 'content_topic';
