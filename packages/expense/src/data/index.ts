// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineSeed } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { ExpenseCategory } from '../objects/expense_category.object';
import { ExpenseReport } from '../objects/expense_report.object';
import { ExpenseLine } from '../objects/expense_line.object';

/**
 * Seed data — covers the full template surface:
 *   • 8 categories with soft per-transaction limits (incl. Mileage, Telecom)
 *   • 5 reports spanning every lifecycle state + the approval threshold
 *   • 13 lines whose amounts match each report's total_amount
 *
 * Report totals are set explicitly because `total_amount` is a stored header
 * field maintained at the top level — there is no line rollup hook (a nested
 * parent write from a line hook crashes the sandbox; see CHARTER.md).
 */

const categories = defineSeed(ExpenseCategory, {
  mode: 'upsert',
  externalId: 'code',
  records: [
    {
      name: 'Meals & Entertainment',
      code: 'MEALS',
      gl_account: '6300',
      per_txn_limit: 75,
      active: true,
    },
    { name: 'Airfare', code: 'AIRFARE', gl_account: '6410', per_txn_limit: 1500, active: true },
    { name: 'Lodging', code: 'LODGING', gl_account: '6420', per_txn_limit: 300, active: true },
    {
      name: 'Ground Transport',
      code: 'GROUND',
      gl_account: '6430',
      per_txn_limit: 100,
      active: true,
    },
    {
      name: 'Office Supplies',
      code: 'SUPPLIES',
      gl_account: '6500',
      per_txn_limit: 200,
      active: true,
    },
    {
      name: 'Software / SaaS',
      code: 'SOFTWARE',
      gl_account: '6600',
      per_txn_limit: 1000,
      active: true,
    },
    { name: 'Mileage', code: 'MILEAGE', gl_account: '6440', per_txn_limit: 500, active: true },
    {
      name: 'Telecom / Phone',
      code: 'TELECOM',
      gl_account: '6700',
      per_txn_limit: 150,
      active: true,
    },
  ],
});

const reports = defineSeed(ExpenseReport, {
  mode: 'upsert',
  externalId: 'report_number',
  records: [
    {
      title: 'Sales offsite — Berlin',
      report_number: 'EXP-2026-0001',
      status: 'reimbursed', // → triggers reimbursed notification flow
      purpose: 'Q1 sales offsite: flights, hotel, and team meals in Berlin.',
      period_start: cel`daysAgo(40)`,
      period_end: cel`daysAgo(33)`,
      cost_center: 'SALES',
      currency: 'usd',
      total_amount: 2223,
      submitted_at: cel`daysAgo(32)`,
      approved_at: cel`daysAgo(30)`,
      reimbursed_at: cel`daysAgo(25)`,
      payment_method: 'bank_transfer',
      payment_reference: 'ACH-20260418-7741',
    },
    {
      title: 'March client dinners',
      report_number: 'EXP-2026-0002',
      status: 'submitted', // → triggers approval + notify flow (below threshold)
      purpose: 'Client relationship dinners during the March pipeline push.',
      period_start: cel`daysAgo(20)`,
      period_end: cel`daysAgo(6)`,
      cost_center: 'SALES',
      currency: 'usd',
      total_amount: 247,
      submitted_at: cel`daysAgo(3)`,
    },
    {
      title: 'Q1 home office setup',
      report_number: 'EXP-2026-0003',
      status: 'approved', // → awaiting reimbursement
      purpose: 'Standing desk, chair mat, and a design tool license for remote work.',
      period_start: cel`daysAgo(28)`,
      period_end: cel`daysAgo(14)`,
      cost_center: 'ENG',
      currency: 'usd',
      total_amount: 550,
      submitted_at: cel`daysAgo(10)`,
      approved_at: cel`daysAgo(7)`,
      payment_method: 'payroll',
    },
    {
      title: 'Conference travel — SaaStr',
      report_number: 'EXP-2026-0004',
      status: 'draft',
      purpose: 'Flights and hotel for the SaaStr Annual conference.',
      period_start: cel`daysFromNow(10)`,
      period_end: cel`daysFromNow(13)`,
      cost_center: 'MKT',
      currency: 'usd',
      total_amount: 850,
    },
    {
      title: 'Misc taxi receipts',
      report_number: 'EXP-2026-0005',
      status: 'rejected',
      purpose: 'Assorted taxi rides — submitted without business purpose detail.',
      period_start: cel`daysAgo(18)`,
      period_end: cel`daysAgo(12)`,
      cost_center: 'OPS',
      currency: 'usd',
      total_amount: 69,
      submitted_at: cel`daysAgo(9)`,
      notes: 'Rejected — split personal and business rides, then resubmit.',
    },
  ],
});

const lines = defineSeed(ExpenseLine, {
  mode: 'upsert',
  externalId: 'description',
  records: [
    // EXP-2026-0001 — Berlin offsite (2223)
    {
      description: 'Round-trip flight SFO↔BER',
      expense_report: 'EXP-2026-0001',
      category: 'AIRFARE',
      expense_date: cel`daysAgo(40)`,
      merchant: 'Lufthansa',
      amount: 1240,
      payment_source: 'personal_card',
      receipt_attached: true,
    },
    {
      description: 'Hotel — 3 nights, Mitte',
      expense_report: 'EXP-2026-0001',
      category: 'LODGING',
      expense_date: cel`daysAgo(37)`,
      merchant: 'Hotel Adlon',
      amount: 870,
      payment_source: 'personal_card',
      receipt_attached: true,
    },
    {
      description: 'Team dinner — Berlin',
      expense_report: 'EXP-2026-0001',
      category: 'MEALS',
      expense_date: cel`daysAgo(36)`,
      merchant: 'Katz Orange',
      amount: 65,
      payment_source: 'personal_card',
      receipt_attached: false,
    },
    {
      description: 'Airport taxi — Berlin',
      expense_report: 'EXP-2026-0001',
      category: 'GROUND',
      expense_date: cel`daysAgo(33)`,
      merchant: 'Taxi Berlin',
      amount: 48,
      payment_source: 'cash',
      receipt_attached: false,
    },

    // EXP-2026-0002 — March client dinners (247)
    {
      description: 'Dinner with Acme prospect',
      expense_report: 'EXP-2026-0002',
      category: 'MEALS',
      expense_date: cel`daysAgo(18)`,
      merchant: 'Quince',
      amount: 120,
      payment_source: 'personal_card',
      receipt_attached: true,
    },
    {
      description: 'Lunch with Globex lead',
      expense_report: 'EXP-2026-0002',
      category: 'MEALS',
      expense_date: cel`daysAgo(12)`,
      merchant: 'Tartine',
      amount: 95,
      payment_source: 'personal_card',
      receipt_attached: true,
    },
    {
      description: 'Rideshare to client office',
      expense_report: 'EXP-2026-0002',
      category: 'GROUND',
      expense_date: cel`daysAgo(12)`,
      merchant: 'Uber',
      amount: 32,
      payment_source: 'personal_card',
      receipt_attached: false,
    },

    // EXP-2026-0003 — Home office setup (550)
    {
      description: 'Standing desk',
      expense_report: 'EXP-2026-0003',
      category: 'SUPPLIES',
      expense_date: cel`daysAgo(26)`,
      merchant: 'Fully',
      amount: 240,
      payment_source: 'personal_card',
      receipt_attached: true,
    },
    {
      description: 'Chair mat & cable tray',
      expense_report: 'EXP-2026-0003',
      category: 'SUPPLIES',
      expense_date: cel`daysAgo(24)`,
      merchant: 'Amazon',
      amount: 130,
      payment_source: 'personal_card',
      receipt_attached: true,
    },
    {
      description: 'Figma annual seat',
      expense_report: 'EXP-2026-0003',
      category: 'SOFTWARE',
      expense_date: cel`daysAgo(22)`,
      merchant: 'Figma',
      amount: 180,
      payment_source: 'personal_card',
      receipt_attached: true,
    },

    // EXP-2026-0004 — SaaStr (850, draft)
    {
      description: 'Flight SFO↔SJC (SaaStr)',
      expense_report: 'EXP-2026-0004',
      category: 'AIRFARE',
      expense_date: cel`daysFromNow(10)`,
      merchant: 'United',
      amount: 560,
      payment_source: 'personal_card',
      receipt_attached: true,
    },
    {
      description: 'Hotel — 1 night (SaaStr)',
      expense_report: 'EXP-2026-0004',
      category: 'LODGING',
      expense_date: cel`daysFromNow(10)`,
      merchant: 'Signia',
      amount: 290,
      payment_source: 'personal_card',
      receipt_attached: true,
    },

    // EXP-2026-0005 — Misc taxis (69, rejected)
    {
      description: 'Taxi — downtown',
      expense_report: 'EXP-2026-0005',
      category: 'GROUND',
      expense_date: cel`daysAgo(17)`,
      merchant: 'Flywheel',
      amount: 28,
      payment_source: 'cash',
      receipt_attached: false,
    },
    {
      description: 'Taxi — airport return',
      expense_report: 'EXP-2026-0005',
      category: 'GROUND',
      expense_date: cel`daysAgo(13)`,
      merchant: 'Flywheel',
      amount: 41,
      payment_source: 'cash',
      receipt_attached: false,
    },
  ],
});

export const ExpenseSeedData = [categories, reports, lines];
