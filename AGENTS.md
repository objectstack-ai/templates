# Agent instructions

Repo-specific rules for AI agents working in this repository. See
[`TEMPLATE_GUIDE.md`](TEMPLATE_GUIDE.md) for how the templates are authored.

## Workflow

- **When the code you changed passes tests, create a PR and merge it.**
  After the full CI gate set passes locally — `pnpm typecheck`, `pnpm build`,
  `pnpm format:check`, and `pnpm -r --if-present test` — commit on a branch,
  open a pull request, and merge it. Do not stop at "tests pass" and wait for a
  separate go-ahead.
  - 中文：你修改的代码测试通过后，创建 PR 并合并，无需再次等待确认。
- Never commit, push, or merge while any of those checks is failing.
- Work on a branch, not `main`; let the PR merge bring changes into `main`.
