// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

/**
 * Stack smoke test — validates that the whole stack parses against the
 * @objectstack/spec schemas. If this passes, every artifact in the template
 * is shape-correct.
 */

import { describe, it, expect } from 'vitest';
import { StackSchema } from '@objectstack/spec';
import stack from '../objectstack.config';

describe('templates/todo stack', () => {
  it('validates against StackSchema', () => {
    const parsed = StackSchema.parse(stack);
    expect(parsed.manifest.namespace).toBe('todo');
    expect(parsed.objects?.length).toBeGreaterThanOrEqual(4);
  });
});
