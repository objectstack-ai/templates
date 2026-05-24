# Changelog

All notable changes to this repository are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Repo scaffolding: CI (Node 20 + 22 matrix, smoke boot), issue / PR templates, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `TEMPLATE_GUIDE.md`, EditorConfig, Prettier config, Dependabot.
- Restored marketplace publish workflow (`.github/workflows/publish.yml`, `scripts/publish-template.mjs`, `docs/PUBLISHING.md`).
- `packages/todo` — first template: task & project management. 4 objects, state machine, 2 flows, 1 approval, 1 sharing rule, 2 profiles, 2 reports, 1 dashboard, English locale, seeded with one project + two labels.

### Fixed
- `todo`: `project.owner` no longer marked `required` — platform fills via `created_by` and ownership rules.
