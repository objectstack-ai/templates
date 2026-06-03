// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { timeOffHook } from '../objects/hr_time_off_request.hook';
import { employeeHook } from '../objects/hr_employee.hook';

export const allHooks = [timeOffHook, employeeHook];
