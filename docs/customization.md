# Customization

*[English] · [中文](zh/customization.md)*

Interview Trainer is role-agnostic within tech. You adapt it by editing your `knowledge-base/` — no
need to touch the skills. The fastest path is `/interview setup`, but here's how to tune each piece.

## 1. Your topic taxonomy (`knowledge-base/topics.md`)

This is the spine. Mock interviews pick questions from it, the capability profile has one row per
topic, and drilling/review key off it.

- Add/remove topics freely — there's no fixed count.
- Tag each topic with a **category** (system mechanism / architecture / domain-specific / algorithm
  / behavioral) so the mock interviewer can balance coverage.
- Mark your **core topics** at the top — readiness ("core topics met: N/M") only counts these.
- Fill the per-topic fields (covers / can-answer / pass-bar / target level / resume link / STAR ref).
  The more specific, the better the AI's questions and scoring.

**Example — switching domains:** a backend candidate might use topics like *concurrency model*,
*database internals*, *distributed consensus*, *API design*, *system design*, *incident response*.
A data engineer might use *batch vs streaming*, *data modeling*, *pipeline reliability*, etc.

## 2. Company styles (`knowledge-base/company-styles/`)

Five archetypes ship ready to use: `algorithm-heavy`, `data-driven`, `stability-focused`,
`system-design`, `behavioral`. Most real companies are a blend.

To add a concrete company:
1. Create `company-styles/<Company>.md`, declaring which archetype it inherits.
2. Fill per-round focus, follow-up style, common questions, core traits.
3. After each real interview, `/interview-debrief` appends what that company actually asked, so the
   profile sharpens over time.

`/mock-interview --company <Company>` reads this file; if it's missing, it falls back to the closest
archetype.

## 3. Methodologies (`knowledge-base/methodologies.md`)

Reusable answering frameworks the scorer references (e.g. answer-to-the-point, quantified-result
five-step, investigation-timeline narrative). Three generic ones ship by default. Add your own with
the **when to use / steps / counter-example** format so they can be cited precisely during scoring.

## 4. Analogies, STAR stories, diagrams, deep-dive questions

These are content banks the engine pulls from when generating answers, review cards, and diagnoses.
You don't have to fill them all upfront — `/interview-coach <topic>` generates content you can paste
back in, and `/interview-debrief` / `/mock-interview` will flag gaps as you go.

## 5. Locked metrics (`profile.md`)

The single most important field. Every quantified claim in any answer must trace back to the
**Locked Metrics** table. Record the number *and* how you measured it, because interviewers probe
both. Update this table before using a new metric anywhere else.

## 6. Optional deep guides (`knowledge-base/guides/`)

If you have long-form subsystem or domain write-ups (e.g. "how the rendering pipeline works"), drop
them in `knowledge-base/guides/*.md`. Review and debrief will pull key sections as scoring anchors.

## What you should NOT do

- Don't edit the skills to hard-code your data — that defeats the separation and breaks updates.
- Don't commit your workspace (`profile.md`, `data/`, real STAR stories) into a public repo. Keep it
  private. See the repo's `.gitignore`.
