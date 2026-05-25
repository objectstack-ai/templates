// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { AITriageOnCreateFlow } from './ai_triage_on_create.flow';
import { SlaFirstResponseWarnFlow } from './sla_first_response_warn.flow';
import { SlaResolutionBreachFlow } from './sla_resolution_breach.flow';
import { AutoCloseResolvedFlow } from './auto_close_resolved.flow';
import { EscalateAngryCustomerFlow } from './escalate_angry_customer.flow';

export const allFlows = [
  AITriageOnCreateFlow,
  SlaFirstResponseWarnFlow,
  SlaResolutionBreachFlow,
  AutoCloseResolvedFlow,
  EscalateAngryCustomerFlow,
];
