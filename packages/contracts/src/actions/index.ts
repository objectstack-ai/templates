// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Actions barrel. Re-exports server actions / AI tool implementations.
 *
 * NOTE: the contracts template ships `extract_terms.action.ts` as a
 * documented building block. It is intentionally NOT passed to
 * `defineStack({ actions: [...] })` at v0 because the action-binding API
 * will stabilise in @objectstack/spec 5.3. Until then, call `extractTerms()`
 * from a flow `script` node, a custom REST handler, or an MCP tool.
 */
export * from './extract_terms.action';
