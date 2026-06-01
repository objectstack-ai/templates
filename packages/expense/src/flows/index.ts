// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ExpenseSubmittedFlow } from './expense_submitted.flow';
import { ExpenseApprovalFlow } from './expense_approval.flow';
import { ExpenseReimbursedFlow } from './expense_reimbursed.flow';
import { ExpenseApprovalOverdueFlow } from './expense_approval_overdue.flow';

export const allFlows = [
  ExpenseSubmittedFlow,
  ExpenseApprovalFlow,
  ExpenseReimbursedFlow,
  ExpenseApprovalOverdueFlow,
];
