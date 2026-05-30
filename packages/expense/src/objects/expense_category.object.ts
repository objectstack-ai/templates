// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { ObjectSchema, Field } from '@objectstack/spec/data';
import { tmpl } from '@objectstack/spec';

/**
 * Expense Category — the spend taxonomy. Drives GL coding and reporting,
 * and carries a soft per-transaction policy limit surfaced to the user.
 *
 * Per-category enforcement (hard block on over-limit lines) is left as a
 * fork point — this template keeps the limit informational + a fixed
 * receipt-required threshold on the line. See CHARTER.md.
 */
export const ExpenseCategory = ObjectSchema.create({
  name: 'expense_category',
  label: 'Expense Category',
  pluralLabel: 'Expense Categories',
  icon: 'tag',
  description:
    'A spend type (meals, travel, lodging, …) used to code and report expense lines.',

  fields: {
    name: Field.text({
      label: 'Name',
      required: true,
      searchable: true,
      maxLength: 120,
    }),
    code: Field.text({
      label: 'Code',
      unique: true,
      maxLength: 40,
      description: 'Short stable key, e.g. MEALS. Often mirrors the GL.',
    }),
    gl_account: Field.text({
      label: 'GL Account',
      maxLength: 40,
      description: 'General-ledger account this category posts to.',
    }),
    per_txn_limit: Field.currency({
      label: 'Per-Transaction Limit',
      min: 0,
      description:
        'Soft cap shown to submitters. Hard enforcement is a fork point.',
    }),
    active: Field.boolean({
      label: 'Active',
      defaultValue: true,
      description: 'Inactive categories are hidden from new lines.',
    }),
    description: Field.markdown({ label: 'Notes' }),
  },

  enable: {
    trackHistory: true,
    searchable: true,
    apiEnabled: true,
    feeds: true,
    trash: true,
    mru: true,
  },

  indexes: [{ fields: ['name'] }, { fields: ['active'] }],

  titleFormat: tmpl`{{record.name}}`,
  displayNameField: 'name',
  compactLayout: ['name', 'code', 'gl_account', 'per_txn_limit', 'active'],
});
