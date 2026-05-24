# ObjectStack Templates

Official starter templates for [ObjectStack](https://github.com/objectstack-ai/framework).

Each template is a self-contained, production-quality starting point for a common enterprise application. They are designed to be scaffolded via the CLI:

```bash
pnpm dlx @objectstack/cli create my-app --template todo
```

## Available templates

| Template | Domain | Status |
|---|---|---|
| [`todo/`](./todo) | Task & project management — the universal starter | ✅ ready |
| `helpdesk/` | Ticketing, SLA, knowledge base | 🚧 planned |
| `procurement/` | Vendors, POs, approval chains | 🚧 planned |
| `sales-pipeline/` | Lite CRM (leads, opportunities, accounts) | 🚧 planned |

## Repository layout

```
templates/
├── todo/             # Each template is an independent npm package
├── helpdesk/
└── ...
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

1. Copy `todo/` as a starting point
2. Rename the package to `@template/<name>`
3. Pick a unique port in the 4000+ range (4001 is reserved for hotcrm)
4. Add a CHARTER explaining the target user, scope, and what's intentionally out of scope
5. Add the entry to this README and to `pnpm-workspace.yaml`

## License

Apache-2.0
