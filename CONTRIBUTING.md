# Contributing

This repo is mostly written by AI agents. The conventions below exist so generated code stays consistent and the smoke CI keeps passing.

## Workflow

```bash
pnpm install
pnpm --filter @objectlab/<name> dev    # boot one template
pnpm typecheck
pnpm format
pnpm build
```

Push to `main`. CI must be green (`format:check`, `typecheck`, `build`, smoke-boot).

## Rules

- One template = one package under `packages/<name>/` = `@objectlab/<name>`. See [`TEMPLATE_GUIDE.md`](./TEMPLATE_GUIDE.md) for file layout, suffix protocol, and hard limits.
- Depend on **published** `@objectstack/*` packages only — no workspace links to the framework.
- Conventional commits (`feat(todo): …`, `fix(todo): …`, `docs: …`, `chore: …`).
- Boot the template locally before pushing — if `pnpm dev` doesn't come up, neither will CI's smoke job.
- User-facing changes get a line in `CHANGELOG.md`.

## Security

Found something exploitable in a template (insecure default, leaky seed, exposed admin path)? Email **security@objectstack.ai** — don't open a public issue. Runtime/engine issues belong on [`framework`](https://github.com/objectstack-ai/framework).
