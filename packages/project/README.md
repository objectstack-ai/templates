# @template/project — AI Project Management

> Project portfolio management with **AI-powered risk prediction**, delay forecasting, and resource conflict detection. Complements the `todo` template (task-level) with project-level planning and predictive analytics for PMOs.

[![Status: v0.1 - Work in Progress](https://img.shields.io/badge/status-v0.1--wip-yellow.svg)](./CHARTER.md)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](../../LICENSE)

---

## Why this template

If you're managing 5-20 projects across teams and currently tracking them in spreadsheets, Notion, or basic task trackers, this template gives you **what PMOs actually need**:

- **AI-powered predictions** — completion probability, schedule delay forecast, budget variance
- **Proactive risk management** — AI identifies risks before they become issues
- **Resource conflict detection** — alerts when team members are overallocated
- **Milestone tracking** — automated warnings for approaching/overdue deadlines
- **Portfolio view** — see health across all projects at a glance

Unlike traditional PM tools where AI is an expensive add-on, **AI fields are built into the schema** and work with any LLM provider (OpenAI, Anthropic, local models).

---

## Quick start

```bash
pnpm install
pnpm --filter @template/project dev   # http://localhost:4010
```

Open the URL, complete `/_account/setup`, and you'll see the PMO dashboard with seed projects.

Reset local database:
```bash
rm -rf packages/project/.objectstack
```

---

## What's in the box

### Core Objects (6)
- **pm_project** — Project with AI prediction fields
- **pm_milestone** — Key delivery points
- **pm_risk** — Risk register with AI impact/likelihood assessment
- **pm_issue** — Current problems requiring resolution
- **pm_resource** — Team member allocations
- **pm_timesheet** — Daily time tracking (feeds AI cost forecasting)

### AI Fields on Projects
```yaml
ai_completion_probability: 0-100%    # Will we finish on time?
ai_delay_days: +/- days               # How late/early?
ai_risk_score: 0-100                  # Composite risk
ai_budget_variance_forecast: %        # Budget over/under
ai_resource_bottleneck: text          # Who's overallocated?
ai_recommended_action: markdown       # What should we do?
```

### Automation (3 Flows)
1. **Daily AI Risk Assessment** — Re-predicts risk daily for active projects
2. **Milestone Deadline Warning** — Alerts 7 days before due, escalates overdue
3. **Resource Conflict Detection** — Detects >40 hours/week allocation

### State Machines (2)
- **Project**: planning → active → at_risk → completed/cancelled
- **Risk**: identified → assessing → mitigating → monitoring → closed/realized

---

## Plugging in your AI/ML model

All flows ship with **stubs** that return sensible defaults. To connect real AI:

### Option 1: Use OpenAI/Anthropic/Claude
Replace the `ai_prediction` script node in `src/flows/daily_ai_risk_assessment.flow.ts`:

```typescript
// Current (stub):
actionType: 'invoke_function',
functionName: 'pm.aiRiskAssessmentStub',

// Production:
actionType: 'http_call',
url: 'https://api.openai.com/v1/chat/completions',
method: 'POST',
headers: { Authorization: 'Bearer ${env.OPENAI_API_KEY}' },
body: {
  model: 'gpt-4',
  messages: [{
    role: 'system',
    content: 'You are a project risk analyst. Given project data, predict: completion_probability (0-100), delay_days (integer), risk_score (0-100), and recommended_actions (markdown).'
  }, {
    role: 'user',
    content: JSON.stringify(projectData)
  }]
}
```

### Option 2: Use custom ML model
Call your own prediction service:
```typescript
actionType: 'http_call',
url: 'https://your-ml-service.com/predict/project-risk',
method: 'POST',
body: {
  project_id: '{projectId}',
  milestones: '{milestones}',
  resources: '{resources}',
  timesheet_history: '{timesheets}'
}
```

The schema stays the same — only the flow nodes change.

---

## Difference from `todo` template

| Aspect | todo template | project template |
|--------|---------------|------------------|
| **Focus** | Task execution | Project planning & prediction |
| **Timeline** | Hours to days | Weeks to months |
| **AI** | None | Risk forecasting, resource optimization |
| **Users** | Individual contributors | Project managers, PMO |
| **Objects** | task, label | project, milestone, risk, resource |

They're **complementary**: use project template for high-level planning, then link to todo template for task-level execution.

---

## Status & Roadmap

**v0.1 (current)** — Core objects + AI flows ✅  
**v0.2** — Views, dashboards, seed data (coming soon)  
**v0.3** — Gantt chart metadata, portfolio analytics  

This is a **reference implementation**, not production-grade. Fork and customize for your needs.

---

## What's NOT included

- **Gantt chart rendering** — schema supports it, UI pending platform
- **Real LLM integration** — by design; you bring your provider
- **Advanced EVM calculations** — can be added via custom formulas
- **Integration with Jira/GitHub** — can be added via custom actions
- **50+ project scale** — this template is optimized for 5-20 projects

See `CHARTER.md` for full scope.

---

## Configuration

Port: **4010**  
Namespace: **pm**  
Objects: **6**  
Flows: **3**  
Locales: **en, zh-CN**

---

## License

Apache-2.0

---

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) and [TEMPLATE_GUIDE.md](../../TEMPLATE_GUIDE.md) for development conventions.
