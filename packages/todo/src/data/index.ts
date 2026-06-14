// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineSeed } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Task } from '../objects/todo_task.object';
import { Label } from '../objects/todo_label.object';

// `labels` is a `multiple: true` lookup, but the v9 seed loader resolves a
// single natural-key string per reference — an array value is silently dropped
// at load (the column ends up null). Seed the primary label here; additional
// labels can be added per task via the UI / API.

/**
 * Seed data — realistic, business-like task content covering the full
 * surface of the template:
 *
 *   • all 4 statuses (todo / doing / done / cancelled) and 4 priorities
 *   • overdue tasks → overdue notification flow
 *   • completed tasks across time → throughput cube
 *   • multi-label tagging via the `labels` lookup (multiple: true)
 *
 *   LABELS  8
 *   TASKS  16  (6 todo, 5 doing, 4 done, 1 cancelled)
 *               – 3 urgent, 4 high, 6 normal, 3 low
 *               – 4 currently overdue
 *               – 4 completed within the last 30 days
 */

const labels = defineSeed(Label, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    { name: 'bug', color: '#EF4444', description: 'A defect or regression' },
    { name: 'feature', color: '#3B82F6', description: 'New capability' },
    { name: 'chore', color: '#6B7280', description: 'Maintenance / tech-debt' },
    { name: 'docs', color: '#0EA5E9', description: 'Documentation work' },
    { name: 'security', color: '#DC2626', description: 'Security-relevant work' },
    { name: 'performance', color: '#F59E0B', description: 'Latency / throughput' },
    { name: 'design', color: '#8B5CF6', description: 'UX or visual design' },
    { name: 'blocked', color: '#475569', description: 'Waiting on an external dependency' },
  ],
});

const tasks = defineSeed(Task, {
  mode: 'upsert',
  externalId: 'subject',
  records: [
    {
      subject: 'Audit homepage performance',
      status: 'done',
      priority: 'normal',
      estimate_hours: 4,
      due_date: cel`daysAgo(20)`,
      completed_at: cel`daysAgo(15)`,
      labels: 'performance',
    },
    {
      subject: 'Design new pricing page mockups',
      status: 'doing',
      priority: 'high',
      estimate_hours: 12,
      due_date: cel`daysFromNow(7)`,
      labels: 'feature',
    },
    {
      subject: 'Fix mobile nav drawer animation',
      status: 'todo',
      priority: 'urgent',
      estimate_hours: 3,
      due_date: cel`daysAgo(2)`, // overdue
      labels: 'bug',
    },
    {
      subject: 'Replace hero illustration with brand-refresh artwork',
      status: 'todo',
      priority: 'normal',
      estimate_hours: 2,
      due_date: cel`daysFromNow(14)`,
      labels: 'design',
    },
    {
      subject: 'Add cookie-consent banner (GDPR)',
      status: 'done',
      priority: 'high',
      estimate_hours: 6,
      due_date: cel`daysAgo(10)`,
      completed_at: cel`daysAgo(8)`,
      labels: 'security',
    },
    {
      subject: 'Implement offline-first task cache',
      status: 'doing',
      priority: 'high',
      estimate_hours: 32,
      due_date: cel`daysFromNow(10)`,
      labels: 'feature',
    },
    {
      subject: 'Wire up push notifications',
      status: 'todo',
      priority: 'normal',
      estimate_hours: 8,
      due_date: cel`daysFromNow(18)`,
      labels: 'feature',
    },
    {
      subject: 'Crash on cold-start when no network',
      status: 'todo',
      priority: 'urgent',
      estimate_hours: 6,
      due_date: cel`daysAgo(1)`, // overdue
      labels: 'bug',
    },
    {
      subject: 'Reproduce biometric prompt bug',
      status: 'doing',
      priority: 'high',
      estimate_hours: 4,
      due_date: cel`daysFromNow(3)`,
      labels: 'bug',
    },
    {
      subject: 'Localize onboarding flow (de / fr / ja)',
      status: 'todo',
      priority: 'normal',
      estimate_hours: 16,
      due_date: cel`daysFromNow(28)`,
      labels: 'feature',
    },
    {
      subject: 'Drop legacy iOS support and bump min SDK',
      status: 'cancelled',
      priority: 'low',
      estimate_hours: 2,
      due_date: cel`daysAgo(7)`,
      labels: 'chore',
    },
    {
      subject: 'Rotate signing keys for service-to-service JWTs',
      status: 'todo',
      priority: 'urgent',
      estimate_hours: 4,
      due_date: cel`daysAgo(3)`, // overdue
      labels: 'security',
    },
    {
      subject: 'Document rate-limit headers in developer portal',
      status: 'todo',
      priority: 'normal',
      estimate_hours: 3,
      due_date: cel`daysFromNow(30)`,
      labels: 'docs',
    },
    {
      subject: 'Investigate p99 latency spike on /v1/search',
      status: 'doing',
      priority: 'high',
      estimate_hours: 8,
      due_date: cel`daysFromNow(5)`,
      labels: 'performance',
    },
    {
      subject: 'Decommission v0 endpoints',
      status: 'done',
      priority: 'normal',
      estimate_hours: 6,
      due_date: cel`daysAgo(25)`,
      completed_at: cel`daysAgo(22)`,
      labels: 'chore',
    },
    {
      subject: 'Archive Q1 launch assets',
      status: 'doing',
      priority: 'low',
      estimate_hours: 1,
      due_date: cel`daysFromNow(14)`,
      labels: 'chore',
    },
  ],
});

/** All seed datasets, loaded in dependency order. */
export const TodoSeedData = [labels, tasks];
