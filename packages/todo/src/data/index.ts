// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Project } from '../objects/project.object';
import { Task } from '../objects/task.object';
import { Label } from '../objects/label.object';
import { TaskLabel } from '../objects/task_label.object';

/**
 * Seed data — minimal demo content so a fresh checkout has something to look at.
 * One project, two labels, three tasks (one urgent, one overdue).
 */

const labels = defineDataset(Label, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    { name: 'bug', color: '#EF4444', description: 'A defect' },
    { name: 'feature', color: '#3B82F6', description: 'New capability' },
  ],
});

const projects = defineDataset(Project, {
  mode: 'upsert',
  externalId: 'key',
  records: [
    {
      name: 'Website Redesign',
      key: 'WEB',
      description: 'Marketing site refresh.',
      status: 'active',
      color: '#3B82F6',
    },
  ],
});

const tasks = defineDataset(Task, {
  mode: 'upsert',
  externalId: 'subject',
  records: [
    {
      subject: 'Audit current homepage performance',
      project: 'WEB',
      status: 'done',
      priority: 'normal',
      due_date: cel`daysAgo(20)`,
      completed_at: cel`daysAgo(15)`,
    },
    {
      subject: 'Design new pricing page mockups',
      project: 'WEB',
      status: 'doing',
      priority: 'high',
      due_date: cel`daysFromNow(7)`,
    },
    {
      subject: 'Fix mobile nav drawer animation',
      project: 'WEB',
      status: 'todo',
      priority: 'urgent',
      due_date: cel`daysAgo(2)`, // overdue
    },
  ],
});

const taskLabels = defineDataset(TaskLabel, {
  mode: 'upsert',
  records: [
    { task: 'Fix mobile nav drawer animation', label: 'bug' },
    { task: 'Design new pricing page mockups', label: 'feature' },
  ],
});

/** All seed datasets, loaded in dependency order. */
export const TodoSeedData = [labels, projects, tasks, taskLabels];
