// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * extract_terms — AI-powered metadata extraction from a contract's attached
 * PDF. This is the signature action of the template.
 *
 * Lifecycle:
 *   1. User uploads PDF to a `contracts_contract` record (sys_attachment).
 *   2. User (or an agent) invokes this action with the contract id.
 *   3. Action loads the PDF text, hands it to the configured LLM with a
 *      domain prompt, validates the JSON response, and writes the extracted
 *      fields back to the contract record. Audit log captures everything.
 *
 * The wiring to your LLM lives in `runExtraction()` below. Default points
 * at `OPENAI_API_KEY`; swap for Claude / Gemini / your own 70B by editing
 * one function. Keep the action definition (input/output schema, prompt,
 * field-mapping) untouched and you'll get identical behaviour across models.
 *
 * Why this file is ~150 lines and not 1500:
 *   - PDF text extraction = `pdf-parse` (caller responsibility / fork)
 *   - Field-level audit, idempotency, undo = platform `enable.trackHistory`
 *   - Permissions = profile + role hierarchy
 *   - Notification on success = a one-line flow you can add
 *   - This file owns ONLY the prompt + schema + LLM call
 *
 * Note: this template ships the action as a documented building block.
 * Wiring it into `defineStack({ actions: [...] })` is intentionally left to
 * your fork because the action-binding API will stabilise in @objectstack/spec
 * 5.3. Until then, you can invoke `extractTerms()` directly from a custom
 * REST handler, a flow `script` node, or an MCP tool definition.
 */

// Minimal Node `process` shim — avoids requiring @types/node in the template
// while keeping the action zero-config when run inside a Node runtime.
declare const process: { env: Record<string, string | undefined> } | undefined;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ExtractTermsInput {
  contractId: string;
  /** Override the default model. */
  model?: string;
  /** Force re-extraction even if extracted_at is set. */
  force?: boolean;
}

export interface ExtractedTerms {
  party_legal_name: string | null;
  contract_type:
    | 'nda'
    | 'msa'
    | 'sow'
    | 'dpa'
    | 'vendor'
    | 'employment'
    | 'lease'
    | 'other'
    | null;
  total_value: number | null;
  currency: string | null;
  effective_date: string | null; // ISO date
  end_date: string | null;
  signed_date: string | null;
  auto_renew: boolean | null;
  renewal_notice_days: number | null;
  payment_terms:
    | 'net_30'
    | 'net_45'
    | 'net_60'
    | 'net_90'
    | 'upfront'
    | 'milestone'
    | 'other'
    | null;
  clauses: Record<string, unknown>;
  confidence: number; // 0..1
}

export interface ExtractTermsOutput {
  contractId: string;
  applied: Array<keyof ExtractedTerms>;
  confidence: number;
  extractedAt: string;
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a contract metadata extractor. Read the
provided contract text and emit a JSON object that matches the schema below
exactly. Do not invent values. If a field is not stated, return null.
Dates must be ISO 8601 (YYYY-MM-DD). Amounts must be numeric without currency
symbols; emit the currency separately as a 3-letter ISO 4217 code. The
"confidence" field is your overall self-assessed accuracy from 0 to 1.

Schema:
{
  "party_legal_name": string|null,
  "contract_type": "nda"|"msa"|"sow"|"dpa"|"vendor"|"employment"|"lease"|"other"|null,
  "total_value": number|null,
  "currency": string|null,
  "effective_date": "YYYY-MM-DD"|null,
  "end_date": "YYYY-MM-DD"|null,
  "signed_date": "YYYY-MM-DD"|null,
  "auto_renew": boolean|null,
  "renewal_notice_days": integer|null,
  "payment_terms": "net_30"|"net_45"|"net_60"|"net_90"|"upfront"|"milestone"|"other"|null,
  "clauses": {
    "liability_cap": string|null,
    "governing_law": string|null,
    "termination_for_convenience": boolean|null,
    "data_processing": string|null
  },
  "confidence": number
}`;

// ---------------------------------------------------------------------------
// Default LLM caller (override in fork)
// ---------------------------------------------------------------------------

/**
 * Default LLM call. Replace this single function to swap models.
 * Returns the raw text body of the model's first response choice.
 */
export async function runExtraction(
  pdfText: string,
  model = (typeof process !== 'undefined' && process?.env?.OBJECTSTACK_CONTRACTS_MODEL) || 'gpt-5',
): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process?.env?.OPENAI_API_KEY) || undefined;
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY not set. Set it, or edit runExtraction() to call your own LLM.',
    );
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: pdfText.slice(0, 120_000) },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`LLM call failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content ?? '{}';
}

// ---------------------------------------------------------------------------
// Core action body
// ---------------------------------------------------------------------------

/**
 * Caller wires the platform context (db / attachments / pdf reader). This
 * keeps the action testable without depending on the runtime.
 */
export interface ExtractTermsContext {
  loadContractPdfText: (contractId: string) => Promise<string>;
  loadContract: (contractId: string) => Promise<Record<string, unknown>>;
  updateContract: (
    contractId: string,
    patch: Record<string, unknown>,
  ) => Promise<void>;
}

export async function extractTerms(
  input: ExtractTermsInput,
  ctx: ExtractTermsContext,
): Promise<ExtractTermsOutput> {
  const contract = await ctx.loadContract(input.contractId);
  if (!input.force && contract.extracted_at) {
    return {
      contractId: input.contractId,
      applied: [],
      confidence: Number(contract.extraction_confidence ?? 0),
      extractedAt: String(contract.extracted_at),
    };
  }

  const pdfText = await ctx.loadContractPdfText(input.contractId);
  if (!pdfText || pdfText.length < 200) {
    throw new Error('Attached contract PDF is empty or unreadable.');
  }

  const raw = await runExtraction(pdfText, input.model);
  const parsed = safeParse(raw);
  if (!parsed) {
    throw new Error(`LLM returned non-JSON: ${raw.slice(0, 300)}`);
  }

  const patch: Record<string, unknown> = {
    extracted_clauses: parsed.clauses ?? {},
    extraction_confidence: clamp01(parsed.confidence),
    extracted_at: new Date().toISOString(),
  };
  const applied: Array<keyof ExtractedTerms> = ['clauses', 'confidence'];

  if (parsed.contract_type) {
    patch.contract_type = parsed.contract_type;
    applied.push('contract_type');
  }
  if (parsed.total_value != null) {
    patch.total_value = parsed.total_value;
    applied.push('total_value');
  }
  if (parsed.effective_date) {
    patch.effective_date = parsed.effective_date;
    applied.push('effective_date');
  }
  if (parsed.end_date) {
    patch.end_date = parsed.end_date;
    applied.push('end_date');
  }
  if (parsed.signed_date) {
    patch.signed_date = parsed.signed_date;
    applied.push('signed_date');
  }
  if (parsed.auto_renew != null) {
    patch.auto_renew = parsed.auto_renew;
    applied.push('auto_renew');
  }
  if (parsed.renewal_notice_days != null) {
    patch.renewal_notice_days = parsed.renewal_notice_days;
    applied.push('renewal_notice_days');
  }
  if (parsed.payment_terms) {
    patch.payment_terms = parsed.payment_terms;
    applied.push('payment_terms');
  }

  await ctx.updateContract(input.contractId, patch);

  return {
    contractId: input.contractId,
    applied,
    confidence: Number(patch.extraction_confidence),
    extractedAt: String(patch.extracted_at),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeParse(text: string): ExtractedTerms | null {
  try {
    return JSON.parse(text) as ExtractedTerms;
  } catch {
    return null;
  }
}

function clamp01(n: unknown): number {
  const x = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

// Re-export the schema-tagging name so callers can introspect what object
// this action mutates (handy when the action-binding API in spec 5.3 lands).
export const targetObjectName = 'contracts_contract';
