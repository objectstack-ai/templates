// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { PRApprovalRequiredFlow } from './pr_approval_required.flow';
import { PRToPOConvertFlow } from './pr_to_po_convert.flow';
import { POOverdueFlow } from './po_overdue.flow';

export const allFlows = [
  PRApprovalRequiredFlow,
  PRToPOConvertFlow,
  POOverdueFlow,
];
