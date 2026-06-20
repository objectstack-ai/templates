# @objectlab/content — Phase 0 Spec

> Design surface. Review this before any code lands. Everything below is
> proposal-grade; if you push back on an object or a state, we redesign
> here, not in TypeScript.

## 1. Object map (9)

```
                     ┌─────────────────────────────────┐
                     │ competitor (1) ── (N) signal    │  "what they did"
                     └────────────────────┬────────────┘
                                          │ inspires
                                          ▼
        ┌─────────── topic (1) ─── (N) content_piece ─── (N) publication
        │              │                  │ │ │              │
        │              │                  │ │ │              ├── (N) metric
        │              │                  │ │ └── (N) cta    │   (timeseries)
        │              │                  │ └── from content_template
        │              │                  └── polymorphic: sys_comment,
        │              │                                   sys_attachment,
        │              │                                   sys_activity
        │              └── sharing-rule scope (team-wide vs private)
        └── sys_comment / sys_activity
```

| # | Object | Cardinality | Purpose |
|---|---|---|---|
| 1 | `content_topic` | N | An idea/brief. Optional source signal. Owns the editorial intent. |
| 2 | `content_competitor` | small N | A tracked org/blog/creator. |
| 3 | `content_signal` | N | A captured event (competitor post, trend, customer quote). Becomes a `content_topic` when promoted. |
| 4 | `content_piece` | N | The unit of work. State machine. Belongs to a topic. |
| 5 | `content_channel` | small N | Where things publish: Blog / Newsletter / LinkedIn / X / YouTube. |
| 6 | `content_publication` | N | The "this piece went live on this channel at this time" record. M:N piece↔channel through this. |
| 7 | `content_metric` | high N | Time-stamped metric reading for a publication (views, clicks, signups, revenue). |
| 8 | `content_cta` | N | A call-to-action variant attached to a piece (e.g. "Book demo", "Read docs"). Carries goal & destination. |
| 9 | `content_template` | small N | Reusable outline / structure (e.g. "case-study v2", "weekly newsletter"). A piece may be instantiated from one. |

Naming convention: every object is prefixed `content_` to keep the namespace
clean when this template is forked or installed alongside others (mirrors the
`todo_*` convention in the todo template).

## 2. State machines

### 2.1 `content_piece.status`

```
        ┌──────────────┐
        │   backlog    │ ◀────────────── (any state, "send back")
        └──────┬───────┘
               │ pick up
               ▼
        ┌──────────────┐
        │  drafting    │
        └──────┬───────┘
               │ submit
               ▼
        ┌──────────────┐
        │  in_review   │
        └──┬─────┬─────┘
   approve │     │ request_changes
           ▼     ▼
   ┌────────────┐   (→ drafting)
   │  approved  │
   └─────┬──────┘
         │ schedule
         ▼
   ┌────────────┐
   │ scheduled  │
   └─────┬──────┘
         │ publish (creates publication row(s))
         ▼
   ┌────────────┐                    ┌────────────┐
   │ published  │ ───── archive ────▶│  archived  │
   └────────────┘                    └────────────┘

   (any non-terminal) ── cancel ──▶ cancelled
```

8 states: `backlog, drafting, in_review, approved, scheduled, published, archived, cancelled`.

- Approval required for `in_review → approved` (process: `publish_approval`).
- `scheduled → published` is driven by an automation (cron when
  `publish_at <= now()`), or manual transition.
- Workflow stamps `submitted_at`, `approved_at`, `published_at`, `archived_at`.

### 2.2 `content_signal.status`

```
   captured ── triage ──▶ promoted (becomes a topic)
        └──── triage ──▶ ignored
```

Promotion writes a new `content_topic` with `source_signal = self`.

## 3. Views (multi-tab unlocks the demo value)

**`content_piece` listViews** (tab strip on /content_pieces):

1. **All Pieces** — default
2. **My Drafts** — filter `assignee = {current_user_id} AND status IN (backlog, drafting)`
3. **In Review** — `status = in_review` (the lead's queue)
4. **Editorial Calendar** — calendar view on `publish_at`
5. **Scheduled** — `status = scheduled` ordered by `publish_at`
6. **Published** — `status = published` ordered by `published_at DESC`
7. **Top Performers** — `status = published` ordered by rollup `publication.total_views DESC`, limit 10
8. **Board** — kanban on `status`

**`content_signal` listViews**: All / My triage queue / Promoted last 30d.

**`content_publication` listViews**: All / This week / By channel (grouped).

## 4. Dashboards (3)

### 4.1 Today Workbench (`/content_today`)

For the IC. Default landing for `contributor` role.

- KPI cards: My drafts in flight • My pieces in review • Pieces scheduled this week • Pieces published last 7d
- Widget: "Pieces I own, not done" — table bound to `assignee = {current_user_id}`
- Widget: "Signals to triage" — table bound to `status = captured`
- Quick-create: "New piece from topic" button

### 4.2 Editorial Calendar (`/content_calendar`)

For the lead.

- Big calendar widget bound to `content_piece` filtered to `publish_at IS NOT NULL`, colored by `channel` (via primary publication)
- Side panel: counts by channel for the visible month
- "Gaps" widget: weeks in the next 4 where 0 pieces are scheduled

### 4.3 ROI by Channel (`/content_roi`)

For the lead / exec readout.

- Cube: `publication_performance` — dims `[channel, week]`, measures `[views, clicks, signups, revenue]`
- Chart: stacked bars of views by channel, last 12 weeks
- Chart: line of cumulative signups attributed by `cta.goal = 'signup'`
- Table: top 10 publications by `signups`

## 5. Sharing & permissions

- Sharing rule `topic_team_scope`: rows on `content_topic` with `visibility = team` share to all members of the topic's owning team; `visibility = private` stays with owner. Cascade: a piece inherits its topic's sharing.
- Permission sets:
  - **`viewer`** — read everything, comment-only
  - **`contributor`** — full CRUD on pieces they own, read on others; cannot approve
  - **`lead`** — full CRUD, approves, manages channels/templates/competitors

## 6. Flows (4) + Manual actions (2)

Spec v6 has no cron trigger, so anything time-driven becomes a manual
action on the record page instead of a background flow.

**Flows (event-driven):**

1. `signal_to_topic_promotion` — on `signal.status → promoted`, create a `content_topic` linked back.
2. `cta_creation_default` — on `content_piece` create, if `cta_count = 0`, create one default CTA from the channel's default goal.
3. `publish_approval` — gates the `in_review → approved` transition through an approval.
4. `stamp_lifecycle_timestamps` — on `piece.status` transitions, notify the editor/writer/owner at the right moment.

> `publication.total_*` / `piece.total_*` are native `Field.summary` roll-ups
> (#1870), recomputed server-side from child `content_metric` rows and cascaded
> one level up to the piece — not a flow.

**Manual actions (button on record page):**

- `publish_now` (on `content_piece` where status = `scheduled` or `approved`) — transition to `published` and create a `publication` row per entry in `target_channels`. Replaces the cron we'd have used.
- `record_metric_snapshot` (on `content_publication`) — opens a form to enter this week's views/clicks/signups/revenue, writes a `content_metric` row. Reflects real workflow (copy-paste from GA / Mixpanel).

## 7. AI actions (3)

1. `summarize_competitor_signal(signal_id)` → fills `signal.summary` and suggests `recommended_topic_title`.
2. `draft_outline_from_topic(topic_id)` → returns a markdown outline; user can apply to create a `content_piece` with `body_outline` set.
3. `suggest_cta(piece_id)` → suggests 2 CTA variants based on piece's topic + channel.

All three are pure functions over current record state. No long-running background tasks.

## 8. Seed data scale (story-shaped)

- 6 competitors (mix: 2 big-cos, 3 startups, 1 newsletter creator)
- 12 signals across all 3 statuses
- 8 topics, 4 with `source_signal`
- 5 channels (Blog, Newsletter, LinkedIn, X, YouTube)
- 3 content_templates (case-study, listicle, weekly-newsletter)
- 14 pieces distributed: 3 backlog, 3 drafting, 2 in_review, 1 approved, 2 scheduled, 2 published, 1 archived
- 10 publications attached to the 2 published + 1 archived piece across channels
- ~60 metric rows (6 per publication, weekly snapshots)
- 14 CTAs (1 per piece, default goal)

## 9. i18n

- `en` and `zh-CN`. Every object label, every field label, every status option, every dashboard title is translated.
- Why zh-CN: dev's primary locale, and it's the cheapest way to prove the platform's i18n surface works end-to-end for a non-Latin script.

## 10. Decisions locked in

1. **`content_metric` = standalone object.** Worth the object slot — cube + ROI dashboard come free; JSON field would force a custom widget.
2. **`content_template` = standalone object.** Marketing users edit templates in-app; file fixture would require a fork to add a new template type.
3. **No cron in spec v6.** `publish_now` and `record_metric_snapshot` ship as **manual actions** on the record page (§6). This actually matches real workflow: metric numbers are pasted from GA/Mixpanel, and "publish at exactly 9:00am" is rarely the real ask.
4. **Calendar widget confirmed** in console (verified live at `/_console/`). Editorial Calendar dashboard ships as designed.

---

## Sign-off checklist

- [x] Object set (9) approved
- [x] `piece` state machine (8 states + transitions) approved
- [x] Dashboard set (3) approved
- [x] Seed data scale approved
- [x] Decisions 1–4 locked in
