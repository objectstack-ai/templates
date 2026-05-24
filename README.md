# ObjectStack Templates

Official starter templates for [ObjectStack](https://github.com/objectstack-ai/framework).

Each template is a self-contained, production-quality starting point for a common enterprise application. They are designed to be scaffolded via the CLI:

```bash
pnpm dlx @objectstack/cli create my-app --template todo
```

## Available templates

| Template | Domain | Status |
|---|---|---|
| [`packages/todo/`](./packages/todo) | Task & project management — the universal starter | ✅ ready |
| `packages/helpdesk/` | Ticketing, SLA, knowledge base | 🚧 planned |
| `packages/procurement/` | Vendors, POs, approval chains | 🚧 planned |
| `packages/sales-pipeline/` | Lite CRM (leads, opportunities, accounts) | 🚧 planned |

## Repository layout

```
templates/
├── packages/             # Each template is an independent npm package
│   ├── todo/
│   ├── helpdesk/
│   └── ...
├── pnpm-workspace.yaml
└── README.md
```

Every template:

- depends on published `@objectstack/*` packages (no workspace links to the framework)
- ships its own README, CHARTER, and i18n
- runs standalone with `pnpm install && pnpm dev`

## Development

```bash
pnpm install
pnpm --filter @template/todo dev   # runs todo on http://localhost:4002
pnpm typecheck
```

## Contributing a new template

1. Copy `packages/todo/` as a starting point
2. Rename the package to `@template/<name>`
3. Pick a unique port in the 4000+ range (4001 is reserved for hotcrm)
4. Add a CHARTER explaining the target user, scope, and what's intentionally out of scope
5. Add the entry to the table above (no `pnpm-workspace.yaml` change needed — the glob picks it up)

## License

Apache-2.0
