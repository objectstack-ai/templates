# Project Management Template Charter

## Mission
Ship a **project-level management template** where **AI predicts risks, delays, and resource conflicts** before they become critical. Complement the `todo` template (task-level) with project-level planning, tracking, and predictive analytics.

## Scope

### What's in
- Project portfolio management (multi-project view for PMOs)
- Milestone tracking with dependency awareness
- AI-powered risk assessment and prediction
- Resource allocation tracking (people + budget)
- Issue escalation from project → PMO
- Time tracking for historical analysis (feeds AI models)

### What's out (v0.1)
- Gantt chart rendering (view metadata only; UI pending platform)
- Real-time collaboration / chat (use platform `sys_comment`)
- Integration with Jira/GitHub/Azure DevOps (can be added via custom actions)
- Advanced earned value management (EVM) calculations
- Resource capacity planning across 50+ projects (this is 5-20 project scale)

## Non-goals
- Replace todo template (they're complementary: project → tasks)
- Real LLM integration (ships with stub — users plug their provider)
- Portfolio optimization algorithms (AI suggests, humans decide)

## Constraints
- **6 objects** (project, milestone, risk, issue, resource, timesheet)
- **2 state machines** (project.status, risk.status)
- **3 flows** (daily risk sync, milestone warning, resource conflict)
- **2 dashboards** (PMO overview, project manager workbench)
- **2 profiles** (viewer, project_manager)
- **2 locales** (en, zh-CN)

## Source-of-truth fields (do NOT rename without ADR)
- `project.name` — display name
- `project.ai_completion_probability` — 0-100, core prediction metric
- `project.ai_delay_days` — predicted delay in days (negative = early)
- `project.ai_risk_score` — 0-100, composite risk
- `risk.ai_impact_score` — 1-5, predicted impact
- `risk.ai_likelihood` — 0-1, probability of occurrence
- `milestone.planned_date` vs `actual_date` — delta drives AI training

## AI Integration Contract
All AI fields are **optional** and populated by flows calling external LLM/ML services:
- Stub implementation returns sensible defaults
- Production: replace flow script nodes with HTTP calls to OpenAI/Anthropic/custom model
- Schema remains stable regardless of provider

## Open Questions
- Should we model dependencies between milestones? (Lean: no, link via description for v0.1)
- Resource allocation: hours per week or % allocation? (Choose: hours)
- Timesheet granularity: daily or weekly? (Choose: daily for accuracy)

## Definition of Done (v0.1)
- [x] All 6 objects compile with validation
- [x] State machines define clear transitions
- [x] 3 flows have stub AI nodes with comment placeholders
- [x] PMO dashboard shows risk distribution + project health
- [x] Seed data includes 3 projects (planning, active, at_risk)
- [x] Typecheck + build clean (`tsc --noEmit` + `objectstack build`)
- [ ] Dev server boots on :4010
- [ ] README targets end users, not contributors

## Hard Limits
| Dimension | Cap | Actual |
|---|---|---|
| Objects | 6 | 6 |
| LOC (`src/`) | 3500 | 3248 |
| Flows | 3 | 3 |
| Dashboards | 2 | 2 |
| State machines | 2 | 2 |
| Profiles | 2 | 2 |

If you need to exceed a limit, document the justification in this charter first.

> **LOC cap raised 2500 → 3500 (2026-06).** The original 2500 budget predated
> the artifacts this charter already promised but never shipped: the two
> dashboards (PMO Overview + PM Workbench) and their datasets, the two
> permission profiles (`viewer` + `project_manager`) and role hierarchy, the
> resource/timesheet list views, and the hooks that derive `code`, `health`,
> risk `priority`, and issue numbers/timestamps. Delivering the promised v0.1
> surface — not new scope — pushed `src/` to ~3.2k LOC. The object/flow/
> dashboard/state-machine/profile caps are unchanged.
