# Todo — ObjectStack starter template

> A small, real-shaped task & project tracker. Forkable starting point for any internal tool that looks like *"things to do, grouped somehow"*.

📜 **Read [CHARTER.md](./CHARTER.md) first** — it explains what's in scope, what isn't, and why.

## Quick start

```bash
# 1. Scaffold
pnpm dlx @objectstack/cli create my-app --template todo
cd my-app

# 2. Install + run
pnpm install
pnpm dev   # http://localhost:4002
```

First-run will redirect you to `/_account/setup` to create the admin user.

## Domain model

```
project (1) ─── (N) task ─── (M) label
                     │
                     ├── sys_comment        (polymorphic, platform)
                     ├── sys_attachment     (polymorphic, platform)
                     ├── sys_activity       (auto, platform)
                     └── sys_approval_request (when priority = urgent)
```

| Object | Purpose |
|---|---|
| `project` | Container with owner, members, sharing scope |
| `task` | Unit of work, status state-machine, optional approval |
| `label` | Free-form tag |
| `task_label` | Junction (M:N) |

## What lives where

```
todo/
├── objectstack.config.ts        # entry point — defineStack(...)
├── src/
│   ├── objects/                 # *.object.ts — schemas
│   ├── pages/                   # *.page.ts — record + list pages
│   ├── views/                   # *.view.ts — list/kanban configurations
│   ├── statemachines/           # task status state machine
│   ├── flows/                   # overdue notification, post-create
│   ├── approvals/               # high-priority approval process
│   ├── sharing/                 # project sharing rule
│   ├── cubes/                   # task throughput cube
│   ├── reports/                 # overdue tasks report
│   ├── dashboards/              # my-work dashboard
│   ├── permissions/             # contributor / lead permission sets
│   ├── hooks/                   # server-side triggers
│   ├── actions/                 # AI tools / custom endpoints
│   ├── apps/                    # navigation manifest
│   ├── data/                    # seed data
│   └── translations/            # en.ts (single locale)
└── test/                        # spec validation tests
```

## Scripts

| Command | What |
|---|---|
| `pnpm dev` | Start dev server on port 4002 |
| `pnpm typecheck` | tsc --noEmit |
| `pnpm test` | Run spec validation tests |
| `pnpm build` | Compile metadata |

## Forking conventions

- Rename `@template/todo` in `package.json` to your app id
- Change `manifest.id` and `manifest.namespace` in `objectstack.config.ts`
- Pick your own port (4002 is taken by the unforked template)
- Add locales under `src/translations/`; update `i18n.supportedLocales` in the config
- Above 4 objects? Split into multiple namespaces or graduate into a domain package

## License

Apache-2.0
