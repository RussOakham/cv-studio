# Local CV Editor (CV Studio) — Plan

Local-first CV editor: structured document + **Tailwind** UI/theming, **pnpm**, **Vite 8+**, HTML/CSS **PDF export**, and best-effort **PDF import** (text extraction + mapping—not semantic round-trip).

## Goals

- **Local-first**: edit offline, own your files, no vendor template lock-in.
- **Export**: PDF matches on-screen preview (within print-engine limits).
- **Import**: existing CV PDFs → extracted text + guided mapping into the schema.
- **Customization**: colors, typography, spacing/layout presets, images (e.g. profile photo).

## Repository & tooling

- **Git** + `.gitignore` (Node/Vite, `dist`, env files, Playwright artifacts when added).
- **pnpm** + **`pnpm-lock.yaml`**; `packageManager` in `package.json` (Corepack). CI: `pnpm install --frozen-lockfile`.
- **Oxlint** with **type-aware** rules (`oxlint-tsgolint`) + **Oxfmt** + **markdownlint-cli2** (Markdown rules relaxed in `.markdownlint-cli2.jsonc`). Scripts: `pnpm lint`, `pnpm format`, `pnpm check`.
- **TypeScript**: [**native preview**](https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews) (`@typescript/native-preview`, `tsgo`); classic `typescript` npm package not required for CLI checks. Use editor extension **TypeScriptTeam.native-preview** for the matching language service.
- **Dependencies**: prefer current stable majors; lockfile pins exact versions.

## Content format

- **Markdown (GFM)** strings inside structured JSON—not MDX as the primary model.
- Structured fields for titles, dates, companies, skill tags; Markdown for bullets/summary where inline formatting is needed.

## Architecture

- **Vite + React + TypeScript**.
- **Document model**: JSON “resume AST” (sections, items, rich text fields).
- **Styling**: **Tailwind** for editor and CV preview; user theme in `theme.json` applied via **CSS variables** + Tailwind arbitrary values / `@theme`.
- **Rich text**: one MD → HTML pipeline for preview and print; optional `@tailwindcss/typography` / `prose` later.

## PDF export

- Dedicated print route + Tailwind `print:` + `@page`.
- Automated export: **Playwright** `page.pdf()` from built preview (script TBD).
- Simple path: browser print → Save as PDF.

## PDF import (honest scope)

- **pdf.js** for text (and optional layout hints).
- Mapping wizard into schema; expect manual cleanup. Scanned PDFs need OCR if required later.

## Phases (summary)

0. Skeleton + schema + theme tokens + Tailwind bridge.
1. Editor UX (outline, preview, inspector) + images.
2. Theme panel + typography.
3. Export polish + Playwright CLI.
4. Import MVP.
5. Optional **Tauri** packaging.

## Validation

- PDF: selectable text, fonts, page breaks.
- Import: trial on varied CV layouts; tune heuristics.

---

_This file is the working plan in-repo; update it as scope changes._
