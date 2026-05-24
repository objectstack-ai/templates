// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { EvidenceExpiringFlow } from './evidence_expiring.flow';
import { EvidenceAutoExpireFlow } from './evidence_auto_expire.flow';
import { FailedControlEscalationFlow } from './failed_control_escalation.flow';

export const allFlows = [
  EvidenceExpiringFlow,
  EvidenceAutoExpireFlow,
  FailedControlEscalationFlow,
];
