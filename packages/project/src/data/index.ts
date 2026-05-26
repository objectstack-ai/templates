// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { projects } from './projects.data.ts';
import { milestones } from './milestones.data.ts';
import { risks } from './risks.data.ts';
import { issues } from './issues.data.ts';
import { resources } from './resources.data.ts';

/**
 * All seed datasets, loaded in dependency order:
 *   1. Projects (no dependencies)
 *   2. Milestones (depends on projects)
 *   3. Risks (depends on projects)
 *   4. Issues (depends on projects)
 *   5. Resources (depends on projects)
 *
 * Timesheets are intentionally NOT seeded (high-volume transactional data).
 */
export const ProjectSeedData = [
  projects,
  milestones,
  risks,
  issues,
  resources,
];
