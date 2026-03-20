---
name: project-workflow
description: Default workflow for CV Studio — scope, quality gates, plans, and git. Use for routine feature work or when the user asks to follow project conventions.
---

# CV Studio — project workflow

Small Vite + React app: keep changes focused; prefer extending existing patterns in `src/`.

## Before you finish a task

1. Run **`pnpm run check`** (format + lint + build). Fix failures.
2. If you only touched Markdown: **`pnpm run lint:md`** is included in `pnpm run lint` when you run full check; quick doc-only pass is fine with `lint:md` alone.
3. Do **not** commit or push unless the user explicitly asks.

## Implementation plans

- For phased work, use **`docs/implementation/<name>.md`** or a temporary **`docs/temp/<name>.temp.md`** (gitignored if you add that pattern later) with `- [ ]` tasks.
- When implementing from a plan: work phase-by-phase; update checkboxes only if that file is the agreed “living” checklist.

## New Cursor skills

To add a skill: duplicate this folder, rename it, update the YAML `name` / `description` and the body. Keep SKILL.md short.

## References

- Git: `@.cursor/rules/git-workflow.mdc`
- Tooling: `@.cursor/rules/code-quality.mdc`
- TypeScript / React: `@.cursor/rules/typescript-react.mdc`
