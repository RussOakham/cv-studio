# CV Studio

Local-first CV editor (in progress). See [docs/PLAN.md](docs/PLAN.md) for goals and roadmap.

## Features (current)

- **Editor** (`/`) — outline, live preview (timeline-mono layout), section inspector, Markdown fields with GFM, **A4 sheet preview** (stacked 210×297mm pages, gaps + shadows like Canva, live page-length chip)
- **Print** (`/print`) — A4-ready layout for browser print or automation
- **Import** (`/import`) — extract text from a PDF (pdf.js) for paste into the editor
- **Project ZIP** — Save/Open `document.json` + `theme.json` from the editor menu
- **Theme sheet** — adjusts CV theme tokens (persisted with the document in `localStorage`)

## Stack

- [Vite 8](https://vite.dev/) + [React 19](https://react.dev/) + [**TypeScript native preview**](https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews) ([`@typescript/native-preview`](https://www.npmjs.com/package/@typescript/native-preview) — `tsgo` CLI replaces `tsc` for `typecheck` / pre-build checks; no `typescript` 5.x npm package)
- [Tailwind CSS 4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- [pnpm](https://pnpm.io/) — `packageManager` pinned in `package.json`
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) (type-aware via `oxlint-tsgolint`) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
- [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) for `*.md` (rules tuned in [`.markdownlint-cli2.jsonc`](.markdownlint-cli2.jsonc))

## Scripts

| Command             | Description                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`          | Dev server                                                                    |
| `pnpm build`        | `tsgo --noEmit` then `vite build`                                             |
| `pnpm preview`      | Preview production build                                                      |
| `pnpm lint`         | Oxlint + markdownlint-cli2                                                    |
| `pnpm lint:md`      | Markdown only                                                                 |
| `pnpm lint:fix`     | Oxlint with `--fix`                                                           |
| `pnpm format`       | Format with Oxfmt                                                             |
| `pnpm format:check` | Verify formatting                                                             |
| `pnpm typecheck`    | `tsgo --noEmit` (solution `tsconfig.json`)                                    |
| `pnpm check`        | format + lint + build (types checked in `build` via `tsgo`)                   |
| `pnpm export:pdf`   | build, run preview on port **4180**, write **`cv-studio.pdf`** via Playwright |

### PDF export (Playwright)

1. Install browsers once: `pnpm exec playwright install chromium`
2. On Linux (including some WSL images), Chromium needs system libraries. If launch fails with missing `.so` files, run `pnpm exec playwright install-deps chromium` (may require `sudo`) or install the listed packages via your distro.
3. Run `pnpm export:pdf` from the repo root.

## Editor (VS Code / Cursor)

For the Go-based language service matching `tsgo`, install [TypeScript (Native Preview)](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview) (`TypeScriptTeam.native-preview`). For Markdown in-editor hints, [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) (`DavidAnson.vscode-markdownlint`) reads the same config.

## Layout

- `src/components/` — UI pieces
- `src/lib/` — shared helpers
- `src/types/` — shared TypeScript types
