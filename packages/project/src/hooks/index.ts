// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { projectHook } from '../objects/pm_project.hook.js';
import { riskHook } from '../objects/pm_risk.hook.js';
import { issueHook } from '../objects/pm_issue.hook.js';

export const allHooks = [projectHook, riskHook, issueHook];
