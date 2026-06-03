// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ContractRenewalAlertFlow } from './renewal_alert.flow';
import { ContractRenewalDraftFlow } from './renewal_draft.flow';
import { ObligationOverdueFlow } from './obligation_overdue.flow';

export const allFlows = [ContractRenewalAlertFlow, ContractRenewalDraftFlow, ObligationOverdueFlow];
