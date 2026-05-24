// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Project } from '../objects/project.object';
import { Task } from '../objects/task.object';
import { Label } from '../objects/label.object';
import { TaskLabel } from '../objects/task_label.object';

/**
 * Seed data — realistic business content covering 4 projects across product,
 * engineering, marketing, and operations. Exercises every part of the stack:
 *
 *   • all 4 task statuses (todo/doing/done/cancelled) and 4 priorities
 *   • urgent tasks → approval process
 *   • overdue tasks → overdue report + overdue notification flow
 *   • completed tasks across time → throughput cube
 *   • multi-label tagging → task_label junction
 *   • a project on hold and a recently-archived project
 *
 * Distribution (≈ what a small product org actually looks like at any moment):
 *   PROJECTS  4 (2 active, 1 on_hold, 1 archived)
 *   LABELS    8
 *   TASKS    24  (10 todo, 6 doing, 7 done, 1 cancelled)
 *               – 3 urgent, 5 high, 12 normal, 4 low
 *               – 4 currently overdue
 *               – 7 completed within the last 30 days
 *   TAG LINKS 28
 */

const labels = defineDataset(Label, {
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

const projects = defineDataset(Project, {
  mode: 'upsert',
  externalId: 'key',
  records: [
    {
      name: 'Website Redesign',
      key: 'WEB',
      description:
        'Refresh of the public marketing site — new IB, pricing page, and mobile nav.',
      status: 'active',
      color: '#3B82F6',
      start_date: cel`daysAgo(45)`,
      target_date: cel`daysFromNow(30)`,
    },
    {
      name: 'Mobile App v2',
      key: 'MOB',
      description:
        'Second-generation iOS & Android client: offline mode, push, and account-level SSO.',
      status: 'active',
      color: '#10B981',
      start_date: cel`daysAgo(60)`,
      target_date: cel`daysFromNow(60)`,
    },
    {
      name: 'Internal API Platform',
      key: 'API',
      description: 'Public REST + GraphQL gateway, rate limiting, and developer portal.',
      status: 'on_hold',
      color: '#F59E0B',
      start_date: cel`daysAgo(90)`,
      target_date: cel`daysFromNow(120)`,
    },
    {
      name: 'Q1 Marketing Launch',
      key: 'MKT',
      description: 'Spring launch campaign — already shipped, kept for retrospective data.',
      status: 'archived',
      color: '#8B5CF6',
      start_date: cel`daysAgo(120)`,
      target_date: cel`daysAgo(30)`,
    },
  ],
});

const tasks = defineDataset(Task, {
  mode: 'upsert',
  externalId: 'subject',
  records: [
    // ── Website Redesign ────────────────────────────────────────────────
    {
      subject: 'Audit current homepage performance',
      project: 'WEB',
      status: 'done',
      priority: 'normal',
      estimate_hours: 4,
      due_date: cel`daysAgo(20)`,
      completed_at: cel`daysAgo(15)`,
    },
    {
      subject: 'Design new pricing page mockups',
      project: 'WEB',
      status: 'doing',
      priority: 'high',
      estimate_hours: 12,
      due_date: cel`daysFromNow(7)`,
    },
    {
      subject: 'Fix mobile nav drawer animation',
      project: 'WEB',
      status: 'todo',
      priority: 'urgent',
      estimate_hours: 3,
      due_date: cel`daysAgo(2)`, // overdue
    },
    {
      subject: 'Replace hero illustration with brand-refresh artwork',
      project: 'WEB',
      status: 'todo',
      priority: 'normal',
      estimate_hours: 2,
      due_date: cel`daysFromNow(14)`,
    },
    {
      subject: 'Migrate blog from Ghost to MDX',
      project: 'WEB',
      status: 'doing',
      priority: 'normal',
      estimate_hours: 24,
      due_date: cel`daysFromNow(21)`,
    },
    {
      subject: 'Add cookie-consent banner (GDPR)',
      project: 'WEB',
      status: 'done',
      priority: 'high',
      estimate_hours: 6,
      due_date: cel`daysAgo(10)`,
      completed_at: cel`daysAgo(8)`,
    },

    // ── Mobile App v2 ────────────────────────────────────────────────────
    {
      subject: 'Implement offline-first task cache (SQLite)',
      project: 'MOB',
      status: 'doing',
      priority: 'high',
      estimate_hours: 32,
      due_date: cel`daysFromNow(10)`,
    },
    {
      subject: 'Wire up Apple Push Notification Service',
      project: 'MOB',
      status: 'todo',
      priority: 'normal',
      estimate_hours: 8,
      due_date: cel`daysFromNow(18)`,
    },
    {
      subject: 'Crash on cold-start when no network (iOS 17.4)',
      project: 'MOB',
      status: 'todo',
      priority: 'urgent',
      estimate_hours: 6,
      due_date: cel`daysAgo(1)`, // overdue
    },
    {
      subject: 'Reproduce Android 14 biometric prompt bug',
      project: 'MOB',
      status: 'doing',
      priority: 'high',
      estimate_hours: 4,
      due_date: cel`daysFromNow(3)`,
    },
    {
      subject: 'Localize onboarding flow (de / fr / ja)',
      project: 'MOB',
      status: 'todo',
      priority: 'normal',
      estimate_hours: 16,
      due_date: cel`daysFromNow(28)`,
    },
    {
      subject: 'Adopt Jetpack Compose for settings screen',
      project: 'MOB',
      status: 'done',
      priority: 'low',
      estimate_hours: 10,
      due_date: cel`daysAgo(5)`,
      completed_at: cel`daysAgo(3)`,
    },
    {
      subject: 'Drop iOS 15 support and bump min SDK',
      project: 'MOB',
      status: 'cancelled',
      priority: 'low',
      estimate_hours: 2,
      due_date: cel`daysAgo(7)`,
    },

    // ── Internal API Platform ────────────────────────────────────────────
    {
      subject: 'Rotate signing keys for service-to-service JWTs',
      project: 'API',
      status: 'todo',
      priority: 'urgent',
      estimate_hours: 4,
      due_date: cel`daysAgo(3)`, // overdue
    },
    {
      subject: 'Document rate-limit headers in developer portal',
      project: 'API',
      status: 'todo',
      priority: 'normal',
      estimate_hours: 3,
      due_date: cel`daysFromNow(30)`,
    },
    {
      subject: 'Investigate p99 latency spike on /v1/search',
      project: 'API',
      status: 'doing',
      priority: 'high',
      estimate_hours: 8,
      due_date: cel`daysFromNow(5)`,
    },
    {
      subject: 'Add GraphQL persisted-query support',
      project: 'API',
      status: 'todo',
      priority: 'normal',
      estimate_hours: 12,
      due_date: cel`daysFromNow(45)`,
    },
    {
      subject: 'Decommission v0 endpoints',
      project: 'API',
      status: 'done',
      priority: 'normal',
      estimate_hours: 6,
      due_date: cel`daysAgo(25)`,
      completed_at: cel`daysAgo(22)`,
    },

    // ── Q1 Marketing Launch ──────────────────────────────────────────────
    {
      subject: 'Draft launch-day press release',
      project: 'MKT',
      status: 'done',
      priority: 'high',
      estimate_hours: 5,
      due_date: cel`daysAgo(40)`,
      completed_at: cel`daysAgo(38)`,
    },
    {
      subject: 'Record customer testimonial video (Acme Co.)',
      project: 'MKT',
      status: 'done',
      priority: 'normal',
      estimate_hours: 8,
      due_date: cel`daysAgo(35)`,
      completed_at: cel`daysAgo(32)`,
    },
    {
      subject: 'Schedule launch tweets and LinkedIn posts',
      project: 'MKT',
      status: 'done',
      priority: 'normal',
      estimate_hours: 2,
      due_date: cel`daysAgo(31)`,
      completed_at: cel`daysAgo(30)`,
    },
    {
      subject: 'Update partner landing pages with new logo',
      project: 'MKT',
      status: 'todo',
      priority: 'low',
      estimate_hours: 3,
      due_date: cel`daysFromNow(60)`,
    },
    {
      subject: 'Post-launch analytics retrospective',
      project: 'MKT',
      status: 'todo',
      priority: 'low',
      estimate_hours: 4,
      due_date: cel`daysFromNow(7)`,
    },
    {
      subject: 'Archive campaign assets to long-term storage',
      project: 'MKT',
      status: 'todo',
      priority: 'low',
      estimate_hours: 1,
      due_date: cel`daysFromNow(14)`,
    },
  ],
});

const taskLabels = defineDataset(TaskLabel, {
  mode: 'upsert',
  records: [
    // Website Redesign
    { task: 'Audit current homepage performance', label: 'performance' },
    { task: 'Design new pricing page mockups', label: 'feature' },
    { task: 'Design new pricing page mockups', label: 'design' },
    { task: 'Fix mobile nav drawer animation', label: 'bug' },
    { task: 'Replace hero illustration with brand-refresh artwork', label: 'design' },
    { task: 'Migrate blog from Ghost to MDX', label: 'chore' },
    { task: 'Add cookie-consent banner (GDPR)', label: 'security' },
    { task: 'Add cookie-consent banner (GDPR)', label: 'feature' },

    // Mobile App v2
    { task: 'Implement offline-first task cache (SQLite)', label: 'feature' },
    { task: 'Wire up Apple Push Notification Service', label: 'feature' },
    { task: 'Crash on cold-start when no network (iOS 17.4)', label: 'bug' },
    { task: 'Reproduce Android 14 biometric prompt bug', label: 'bug' },
    { task: 'Reproduce Android 14 biometric prompt bug', label: 'security' },
    { task: 'Localize onboarding flow (de / fr / ja)', label: 'feature' },
    { task: 'Adopt Jetpack Compose for settings screen', label: 'chore' },
    { task: 'Drop iOS 15 support and bump min SDK', label: 'chore' },

    // API Platform
    { task: 'Rotate signing keys for service-to-service JWTs', label: 'security' },
    { task: 'Document rate-limit headers in developer portal', label: 'docs' },
    { task: 'Investigate p99 latency spike on /v1/search', label: 'performance' },
    { task: 'Investigate p99 latency spike on /v1/search', label: 'blocked' },
    { task: 'Add GraphQL persisted-query support', label: 'feature' },
    { task: 'Decommission v0 endpoints', label: 'chore' },

    // Marketing
    { task: 'Draft launch-day press release', label: 'docs' },
    { task: 'Record customer testimonial video (Acme Co.)', label: 'feature' },
    { task: 'Schedule launch tweets and LinkedIn posts', label: 'chore' },
    { task: 'Update partner landing pages with new logo', label: 'design' },
    { task: 'Post-launch analytics retrospective', label: 'docs' },
    { task: 'Archive campaign assets to long-term storage', label: 'chore' },
  ],
});

/** All seed datasets, loaded in dependency order. */
export const TodoSeedData = [labels, projects, tasks, taskLabels];
