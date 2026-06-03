// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { projects } from './projects.data.js';
import { milestones } from './milestones.data.js';
import { risks } from './risks.data.js';
import { issues } from './issues.data.js';
import { resources } from './resources.data.js';

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
export const ProjectSeedData = [projects, milestones, risks, issues, resources];
