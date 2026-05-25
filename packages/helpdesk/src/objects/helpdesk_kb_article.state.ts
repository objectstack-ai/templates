// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { StateMachineConfig } from '@objectstack/spec/automation';

/**
 * KB Article lifecycle: draft → review → published → archived.
 * Only published articles are eligible for AI KB recall.
 */
export const KBArticleStateMachine: StateMachineConfig = {
  id: 'kb_article_lifecycle',
  initial: 'draft',
  states: {
    draft:     { on: { SUBMIT:  { target: 'review' } } },
    review:    { on: { PUBLISH: { target: 'published' }, REJECT: { target: 'draft' } } },
    published: { on: { ARCHIVE: { target: 'archived' }, EDIT: { target: 'draft' } } },
    archived:  { on: { RESTORE: { target: 'draft' } } },
  },
};
