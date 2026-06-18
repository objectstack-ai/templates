// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/ui';

/** ADR-0021 semantic dataset for hr_employee. */
export const HrEmployeeDataset = defineDataset({
  name: 'hr_employee_metrics',
  label: 'hr_employee metrics',
  object: 'hr_employee',
  dimensions: [
    { name: 'department', label: 'department', field: 'department', type: 'string' },
    {
      name: 'hire_date',
      label: 'hire_date',
      field: 'hire_date',
      type: 'date',
      dateGranularity: 'month',
    },
  ],
  measures: [{ name: 'employee_count', label: 'Employees', aggregate: 'count' }],
});
