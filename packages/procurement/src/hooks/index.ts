// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { requestHook } from '../objects/procurement_request.hook';
import { receiptHook } from '../objects/procurement_receipt.hook';

export const allHooks = [requestHook, receiptHook];
