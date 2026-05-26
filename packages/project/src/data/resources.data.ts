// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Resource } from '../objects/pm_resource.object';

/**
 * Resource allocations for the 3 sample projects:
 *   • Total 12 allocations across projects
 *   • Mix of full-time (40h/week) and part-time allocations
 *   • Some overlapping allocations to show potential conflicts
 */
export const resources = defineDataset(Resource, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    // PRJ-2026-001: Mobile App Redesign (8 team members)
    {
      name: 'PM - Mobile Redesign',
      project: 'PRJ-2026-001',
      user: 'admin',
      role: 'project_manager',
      hours_per_week: 20,
      start_date: cel`daysAgo(45)`,
      end_date: cel`daysFromNow(75)`,
      is_active: true,
    },
    {
      name: 'iOS Dev - Mobile Redesign',
      project: 'PRJ-2026-001',
      user: 'admin',
      role: 'developer',
      hours_per_week: 40,
      start_date: cel`daysAgo(30)`,
      end_date: cel`daysFromNow(75)`,
      is_active: true,
    },
    {
      name: 'UI Designer - Mobile Redesign',
      project: 'PRJ-2026-001',
      user: 'admin',
      role: 'designer',
      hours_per_week: 32,
      start_date: cel`daysAgo(45)`,
      end_date: cel`daysFromNow(60)`,
      is_active: true,
    },

    // PRJ-2026-002: ERP System Migration (12 team members)
    {
      name: 'PM - ERP Migration',
      project: 'PRJ-2026-002',
      user: 'admin',
      role: 'project_manager',
      hours_per_week: 40,
      start_date: cel`daysAgo(90)`,
      end_date: cel`daysFromNow(30)`,
      is_active: true,
    },
    {
      name: 'SAP Consultant - ERP Migration',
      project: 'PRJ-2026-002',
      user: 'admin',
      role: 'consultant',
      hours_per_week: 40,
      start_date: cel`daysAgo(75)`,
      end_date: cel`daysFromNow(45)`,
      is_active: true,
    },
    {
      name: 'Data Analyst 1 - ERP Migration',
      project: 'PRJ-2026-002',
      user: 'admin',
      role: 'analyst',
      hours_per_week: 40,
      start_date: cel`daysAgo(60)`,
      end_date: cel`daysFromNow(30)`,
      is_active: true,
    },
    {
      name: 'QA Engineer - ERP Migration',
      project: 'PRJ-2026-002',
      user: 'admin',
      role: 'qa',
      hours_per_week: 32,
      start_date: cel`daysAgo(30)`,
      end_date: cel`daysFromNow(30)`,
      is_active: true,
    },

    // PRJ-2026-003: AI Chatbot MVP (5 team members)
    {
      name: 'PM - AI Chatbot',
      project: 'PRJ-2026-003',
      user: 'admin',
      role: 'project_manager',
      hours_per_week: 16,
      start_date: cel`daysFromNow(14)`,
      end_date: cel`daysFromNow(104)`,
      is_active: false,
    },
    {
      name: 'ML Engineer - AI Chatbot',
      project: 'PRJ-2026-003',
      user: 'admin',
      role: 'developer',
      hours_per_week: 40,
      start_date: cel`daysFromNow(14)`,
      end_date: cel`daysFromNow(104)`,
      is_active: false,
    },
    {
      name: 'Backend Dev - AI Chatbot',
      project: 'PRJ-2026-003',
      user: 'admin',
      role: 'developer',
      hours_per_week: 32,
      start_date: cel`daysFromNow(21)`,
      end_date: cel`daysFromNow(104)`,
      is_active: false,
    },
  ],
});
