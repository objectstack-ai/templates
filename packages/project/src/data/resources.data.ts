// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineSeed } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Resource } from '../objects/pm_resource.object.js';

/**
 * Resource allocations for the sample projects.
 *
 * NOTE: the `person` lookup (→ user) is intentionally left unset — seed data
 * cannot reference real platform users that only exist after first signup.
 * The `job_function` text field carries the human-readable allocation label instead.
 * `project` references the parent project by its `name` externalId.
 */
export const resources = defineSeed(Resource, {
  mode: 'upsert',
  externalId: 'job_function',
  records: [
    // Mobile App Redesign
    {
      job_function: 'Project Manager — Mobile App Redesign',
      project: 'Mobile App Redesign',
      allocated_hours_per_week: 20,
      start_date: cel`daysAgo(45)`,
      end_date: cel`daysFromNow(75)`,
    },
    {
      job_function: 'iOS Developer — Mobile App Redesign',
      project: 'Mobile App Redesign',
      allocated_hours_per_week: 40,
      start_date: cel`daysAgo(30)`,
      end_date: cel`daysFromNow(75)`,
    },
    {
      job_function: 'UI Designer — Mobile App Redesign',
      project: 'Mobile App Redesign',
      allocated_hours_per_week: 32,
      start_date: cel`daysAgo(45)`,
      end_date: cel`daysFromNow(60)`,
    },
    // ERP System Migration
    {
      job_function: 'Project Manager — ERP System Migration',
      project: 'ERP System Migration',
      allocated_hours_per_week: 40,
      start_date: cel`daysAgo(90)`,
      end_date: cel`daysFromNow(30)`,
    },
    {
      job_function: 'SAP Consultant — ERP System Migration',
      project: 'ERP System Migration',
      allocated_hours_per_week: 40,
      start_date: cel`daysAgo(75)`,
      end_date: cel`daysFromNow(45)`,
    },
    {
      job_function: 'Data Analyst — ERP System Migration',
      project: 'ERP System Migration',
      allocated_hours_per_week: 40,
      start_date: cel`daysAgo(60)`,
      end_date: cel`daysFromNow(30)`,
    },
    {
      job_function: 'QA Engineer — ERP System Migration',
      project: 'ERP System Migration',
      allocated_hours_per_week: 32,
      start_date: cel`daysAgo(30)`,
      end_date: cel`daysFromNow(30)`,
    },
    // AI Chatbot MVP
    {
      job_function: 'Project Manager — AI Chatbot MVP',
      project: 'AI Chatbot MVP',
      allocated_hours_per_week: 16,
      start_date: cel`daysFromNow(7)`,
      end_date: cel`daysFromNow(97)`,
    },
    {
      job_function: 'ML Engineer — AI Chatbot MVP',
      project: 'AI Chatbot MVP',
      allocated_hours_per_week: 40,
      start_date: cel`daysFromNow(7)`,
      end_date: cel`daysFromNow(97)`,
    },
    {
      job_function: 'Backend Developer — AI Chatbot MVP',
      project: 'AI Chatbot MVP',
      allocated_hours_per_week: 32,
      start_date: cel`daysFromNow(14)`,
      end_date: cel`daysFromNow(97)`,
    },
  ],
});
