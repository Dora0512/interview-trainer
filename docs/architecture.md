# Architecture

*[English] · [中文](zh/architecture.md)*

Interview Trainer separates a reusable **engine** from your personal **data**. Understanding the
three layers explains why it works across roles and stays accurate over a long job hunt.

## The three layers

```
┌─────────────────────────────────────────────────────────────┐
│ ENGINE  (this plugin — shared, role-agnostic)                │
│   skills/  — 9 skills behind one /interview router           │
│   No personal data. No hard-coded company. No fixed topics.  │
└───────────────┬─────────────────────────────────────────────┘
                │ reads ↑↓ writes
┌───────────────┴───────────────┐   ┌─────────────────────────┐
│ CONFIG  (yours)                │   │ DATA  (auto-maintained) │
│  profile.md                    │   │  data/pipeline.md       │
│  knowledge-base/               │   │  data/capability-...    │
│   topics, analogies, STAR,     │   │  data/records/          │
│   diagrams, methodologies,     │   │  data/mock-records/     │
│   company-styles, answer-norms │   │  data/prep/             │
│  (you fill these once)         │   │  data/deep-review-...   │
└────────────────────────────────┘   └─────────────────────────┘
```

- **Engine** ships with the plugin and never contains your data. It reads everything it needs at
  runtime from your workspace.
- **Config** is the knowledge you own: who you are, your locked metrics, your topic taxonomy, your
  analogies and STAR stories, the company styles you care about. You set this up once with
  `/interview setup` and extend it over time.
- **Data** is state the engine writes for you: the pipeline funnel, your capability profile, every
  mock and real-interview record. You rarely edit these by hand.

Your **workspace** is just the directory you run Claude Code from. There's no global config — the
engine resolves `profile.md`, `knowledge-base/`, and `data/` relative to the current directory.

## The skills

| Skill | Role |
|-------|------|
| `interview` | Router + smart navigation + status dashboard + analytics + apply orchestration |
| `interview-setup` | One-time onboarding: builds config + data skeleton |
| `mock-interview` | Role-plays an interviewer; one question at a time; scores; runs a review loop |
| `interview-debrief` | Post-interview recall + coach diagnosis; writes records, updates profile + pipeline |
| `deep-review` | Progressive L1-L5 drilling with a cross-session mastery profile |
| `review-skill` | One-shot review card for a topic |
| `interview-coach` | Generates a structured high-quality answer |
| `interview-prep` | Company- and round-specific prep plan |
| `resume-tailor` | JD-driven match scoring + ATS optimization + no-fabrication rewrite |

## Feedback loops (why it compounds)

The system gets smarter the more you use it:

```
real interview ──/debrief──► weak spot recorded in capability-profile
                                   │
                                   ├──► /deep-review picks it up as a remediation gate
                                   ├──► /mock-interview --weak prioritizes it
                                   └──► /interview (navigator) recommends fixing it next

mock interview ──► updates capability-profile (topic levels, readiness)
deep review   ──► updates mastery profile + back-flows <3 scores as weak spots
everything    ──► /interview reads pipeline + profile + records to recommend the next action
```

A weak spot exposed in a Tuesday interview automatically becomes a targeted drill on Wednesday and a
navigator recommendation until you close it.

## Workspace schema

Every table and record the skills write has a fixed shape — bilingual column names, ISO dates,
pure-emoji status cells, YAML front-matter on records — defined once in
[workspace-schema.md](workspace-schema.md), together with the formulas for readiness, the funnel,
calibration and the mock composite score. Skills reference it instead of re-describing formats, and
CI (`web` job in `.github/workflows/guard.yml`) validates the example workspaces, the data templates
and every skill's path table against it.

## Web interface

`web/` is a second front-end over the same three layers:

```
skills/*.md ──(system prompt)──► web/api/session ──► Claude ──► chat in the browser
workspace/*  ──(parsed by web/src/lib/workspace)──► dashboard pages
                                  ▲
               Save to workspace: model proposes full files → user reviews diff → write → re-validate
```

- **Read path**: `web/src/lib/workspace/` parses a workspace into typed data, recomputes the funnel,
  readiness and staleness, raises data alerts, and ports the router's P0–P3 navigator rules.
- **Write path**: browser sessions never edit files directly. At the end, the model proposes full new
  file contents through a tool call, the user reviews line diffs, and only `data/**.md` and
  `knowledge-base/star-stories.md` can be written. Demo workspaces are read-only.

## Data-consistency discipline

State files can drift (you edit one, forget another). The engine treats sources of truth in a fixed
priority — real records > pipeline > capability profile > docs — and **recomputes** funnels and
readiness from the live tables instead of trusting stale summary blocks. If it detects drift it
emits a **data alert** rather than silently "fixing" your history. This rule lives in
`knowledge-base/answer-norms.md`.

## Language

Skill instructions are authored in Chinese (the proven, battle-tested prompts), but every skill is
told to **conduct the session in your language**. Use it in English and the whole thing runs in
English; the Chinese is invisible to you.
