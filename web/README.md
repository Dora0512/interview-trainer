# Interview Trainer — Web

A local dashboard and AI practice room for an [interview-trainer](../README.md) workspace.
It reads the same `profile.md` / `knowledge-base/` / `data/` files the Claude Code skills write,
so the CLI and the browser stay in sync.

*面试训练官的本地 Web 界面：看板 + AI 练习室，读写的就是 skill 维护的同一套工作区文件。*

## Run it

```bash
cd web
npm install
cp .env.example .env.local     # set WORKSPACE_DIR (and ANTHROPIC_API_KEY for practice)
npm run dev                     # http://localhost:3000
```

With no `WORKSPACE_DIR` the app opens the fictional demos in `../examples/` so you can look around
first. Switch workspaces from the top bar; only directories from the environment and the bundled
demos can be selected — the browser never sends a path.

| Variable | Purpose |
|---|---|
| `WORKSPACE_DIR` | Your workspace (default selection). Writable. |
| `WORKSPACE_DIRS` | Extra workspaces for the switcher, comma-separated. |
| `ANTHROPIC_API_KEY` | Claude API key for `/mock` and `/debrief` (or an `ant auth login` profile). |
| `UI_LANGUAGE` | Force the UI language (`zh` / `en`) instead of following `profile.md`. |
| `ANTHROPIC_MODEL` | Model override; default `claude-opus-5-5`. |

## What's inside

**Dashboard** (no API key needed)

| Page | Shows |
|---|---|
| Overview | Readiness (core met / core total), KPI tiles, recommended next steps with copyable `/interview …` commands, funnel, recent interviews, data health |
| Pipeline | Funnel + conversion, board by status, full table |
| Capability | Topic × level ladder (current vs target, retest-due flags), notes, general skills, real-interview verification |
| Weak spots | Open weak spots by root cause (knowledge gap, shallow depth, …), full tracker |
| Calibration | Self-vs-coach delta per interview, mock score trend, mock-vs-real drift |
| Records | Real / mock / deep-review / prep records with rendered Markdown |
| Knowledge base | Topics, STAR stories (strength + usage), locked metrics, company styles |

The UI language follows `language` in `profile.md` (`zh` / `en`).

**Practice with AI** (`/mock`, `/debrief`)

- Runs the plugin's own `skills/mock-interview/SKILL.md` or `skills/interview-debrief/SKILL.md` as the
  system prompt, with your workspace files injected (prompt-cached).
- The interviewer asks one question at a time; the progress bar reads only the phase and question
  count, never scores.
- **Save to workspace**: the model proposes complete new file contents, you review line diffs and pick
  files, then they're written and re-validated against the schema. Only `data/**.md` and
  `knowledge-base/star-stories.md` are writable; demo workspaces are read-only.
- An unfinished session survives a page reload (stored in your browser only).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm test` | Parser / derivation / navigator tests (vitest), incl. all example workspaces |
| `npm run check -- <dir…>` | Validate workspaces against [docs/workspace-schema.md](../docs/workspace-schema.md) |
| `npm run check -- --templates ../templates --skills ..` | Validate data templates and skill path tables |
| `npm run lint` | ESLint |

## Layout

```
src/lib/workspace/   parsers (Markdown tables + front-matter), derive.ts (funnel, readiness,
                     staleness, calibration, data alerts), navigator.ts (router's P0–P3 rules)
src/lib/server/      workspace selection (allow-list + cookie), Claude session helpers
src/app/             dashboard pages, /mock, /debrief, api/session, api/workspace/write
src/components/      charts (hand-built SVG/HTML), UI primitives, practice chat
scripts/             check-workspace.ts
```

This app targets Next.js 16 — see `AGENTS.md` before changing framework code.
