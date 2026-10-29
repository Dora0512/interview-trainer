# Workspace Schema

*[English] · [中文](zh/workspace-schema.md)*

This is the **single source of truth** for the files a workspace contains and the exact shape of
every table and record the skills write. Every skill reads and writes by these rules; the
`web/scripts/check-workspace.ts` validator and the web dashboard (`web/`) parse by them too.

> Rule of thumb: Markdown stays human-first, but **every machine-relevant fact lives in a table
> with known columns or in a record's YAML front-matter**. Prose and notes go in note columns or the
> record body — never inside a status / level / date cell.

## 1. Global conventions

| Item | Rule |
|---|---|
| Dates | ISO `YYYY-MM-DD` everywhere (tables, front-matter, file names). Never `01-28` or `1/28`. Times are `HH:mm` (24h). |
| Empty cell | `—` (em dash). Also used for "not tested" / "not reached". |
| Topic IDs | Taken from `knowledge-base/topics.md` headings: `话题N` or `Topic N` (same thing; N is the number). Any table or front-matter that references a topic starts with the ID, e.g. `话题3 Distributed systems`. Matrix `#` column = N. |
| Levels | `L1`–`L5`, or `—` if not tested / not reached. |
| Table headers | Bilingual aliases are both valid (see each table). Pick one language per workspace — `profile.md` `language`. Extra trailing columns are allowed; required columns must exist. |
| Section headings | Located by the `##` / `###` heading text; Chinese and English headings in each table spec are equivalent. |
| "Today" | The real current date. `profile.md` may set `as_of: YYYY-MM-DD` to freeze "today" (used by the fictional demos and tests so staleness doesn't drift). |

## 2. File registry

Every path a skill reads or writes must appear here (CI checks each skill's path table against this list).

| Path | Layer | Written by | Purpose |
|---|---|---|---|
| `profile.md` | config | setup | Identity, target, **locked metrics**, resume paths |
| `knowledge-base/topics.md` | config | setup / user | Topic taxonomy + core set + targets |
| `knowledge-base/analogy-bank.md` | config | setup / debrief | Analogies |
| `knowledge-base/answer-norms.md` | config | setup | Answer framework, data-consistency priority |
| `knowledge-base/methodologies.md` | config | setup | Answering methodologies |
| `knowledge-base/star-stories.md` | config | setup / debrief (usage write-back) | STAR story bank |
| `knowledge-base/deep-dive-questions.md` | config | user / coach | Follow-up question bank |
| `knowledge-base/diagrams.md` | config | user / coach | Mermaid diagrams |
| `knowledge-base/hr-questions.md` | config | user | HR question bank (optional) |
| `knowledge-base/company-styles/*.md` | config | setup / debrief | Company / archetype interviewer styles |
| `knowledge-base/guides/*.md` | config | user | Optional deep-dive guides |
| `data/self-intro.md` | data | user / coach | Self-intro script (optional) |
| `data/pipeline.md` | data | apply / debrief | Pipeline funnel |
| `data/capability-profile.md` | data | mock / debrief / deep-review / analytics | Capability matrix and trackers |
| `data/analytics.md` | data | analytics | Cross-interview analysis |
| `data/records/<Company>/*.md` | data | debrief | Real interview records |
| `data/mock-records/*.md` | data | mock | Mock interview records |
| `data/mock-records/progress.md` | data | mock | Mock progress overview |
| `data/prep/*.md` | data | prep / apply | Prep plans |
| `data/deep-review-records/*.md` | data | deep-review | Mastery profiles + session records |

## 3. `profile.md`

YAML front-matter (required keys **bold**): **`name`**, **`role`**, `years`, `target`,
`resume_path`, `resume_dir`, **`language`** (`zh` | `en`), `as_of` (optional, see §1),
`readiness_thresholds` (optional, overrides §9: `[40, 70, 90]`).

Locked-metrics table — section `## 量化数据锁定区` / `## Locked Metrics`:

| Key | 中文 | English |
|---|---|---|
| metric | 指标 | Metric |
| value | 数字 | Number / Value |
| source | 出处/项目 | Project / Source |
| measured | 怎么测量的 | How it was measured |

## 4. `knowledge-base/topics.md`

- **Core set** — one line: `核心话题：话题1, 话题2, 话题5` or `Core topics: 话题1, 话题2, 话题5`
  (`Topic 1` style also accepted). Core readiness counts only these.
- **Topic heading** — `### 话题N：<name>` or `### Topic N: <name>` (full- or half-width colon).
- **Topic fields** — bullets `- **<field>**: value`. Target level field: `目标 L 级` / `Target`
  (default `L3` when absent; core topics should always state it). Other fields (category, covers,
  pass bar, resume link, STAR ref) are free text.

## 5. `data/pipeline.md`

Pipeline table — section `## 管线状态` / `## Pipeline`:

| Key | 中文 | English | Format |
|---|---|---|---|
| company | 公司 | Company | text |
| role | 岗位 | Role | text |
| stage | 当前阶段 | Stage | free text label (e.g. `二面完成` / `R2 done`) |
| applied | 投递日期 | Applied | `YYYY-MM-DD` |
| r1 | 一面 | R1 | round cell |
| r2 | 二面 | R2 | round cell |
| r3 | 三面/终面 | R3/Final | round cell |
| hr | HR面 | HR | round cell |
| offer | Offer | Offer | round cell |
| status | 状态 | Status | `🟢` / `🟡` / `🔴` optionally followed by one label word (`🟢 进行中` / `🟢 active`) |
| notes | 备注 | Notes | free text |

**Round cell**: `—`, or `YYYY-MM-DD` + result mark: `✅` passed, `❌` failed, `⏳` scheduled / awaiting result.
A round counts as **reached** when it has a date and its mark is `✅`, `❌` or absent (`⏳` = not yet).

Funnel — section `## 漏斗统计` / `## Funnel`, exactly one line, recomputed from the table on every write:
`投递 N → 一面 N → 二面 N → 三面 N → HR N → Offer N` /
`Applied N → R1 N → R2 N → Final N → HR N → Offer N`.
Applied = number of rows; each later stage = rows where that round is reached.

Update log — `## 更新日志` / `## Update log`: `日期|Date`, `动作|Action`, `说明|Note`.

## 6. `data/capability-profile.md`

### Topic matrix — `## 话题能力矩阵` / `## Topic matrix`

| Key | 中文 | English | Format |
|---|---|---|---|
| id | # | # | topic number N |
| topic | 话题 | Topic | name |
| current | 当前水平 | Current | level |
| target | 目标 | Target | level |
| last_tested | 上次测试 | Last tested | date or `—` |
| trend | 趋势 | Trend | `↑` `→` `↓` `—` |
| status | 状态 | Status | exactly one of `🔲` `🟡` `🟢` `🕐` |
| note | 备注 | Note | free text (sub-point gaps go here, **not** in Status) |

Status rules: `🔲` never tested · `🟡` tested and current < target · `🟢` current ≥ target ·
`🕐` was `🟢` but `last_tested` is more than **30 days** before today (retest due).

### General skills — `## 通用能力评估` / `## General skills`
`能力维度|Dimension`, `当前水平|Level` (`强/中/弱/待测` or `strong/medium/weak/untested`), `说明|Note`.
Fixed rows: self-intro, project causal chain, metric accuracy, analogy opener habit, handling follow-ups.

### Readiness — `## 面试准备度判定` / `## Readiness`
Three bullets, recomputed (§9) on every write:
```
- 核心话题达标数：3 / 5            - Core topics met: 3 / 5
- 全部话题达标数：3 / 7            - All topics met: 3 / 7
- 准备度：🟡 备战（60%）            - Readiness: 🟡 in-training (60%)
```

### Real-interview verification — `## 真实面试验证记录` / `## Real-interview verification log`
`话题|Topic` (starts with topic ID), `达到水平|Reached`, `来源|Source` (`<Company> R<n>`), `日期|Date`, `表现备注|Note`.

### Weak-spot tracking — `## 薄弱点追踪` / `## Weak-spot tracking`

| Key | 中文 | English | Format |
|---|---|---|---|
| spot | 薄弱点 | Weak spot | text |
| topic | 话题 | Topic | topic ID or `—` |
| first_seen | 首次出现 | First seen | date |
| count | 出现次数 | Count | integer |
| state | 最近状态 | Latest status | `🟡 待改进` / `🟡 to fix`, `✅ 已改善` / `✅ improved` |
| root_cause | 根因 | Root cause | one of §8 or `—` |
| source | 来源/备注 | Source/Note | `<Company> R<n>`, `[mock-YYYY-MM-DD]`, `[deep-review-YYYY-MM-DD]` |

### Calibration — `## 校准追踪` / `## Calibration`
- `### 自评 vs 教练评分` / `### Self vs coach`: `日期|Date`, `来源|Source`, `自评|Self`, `AI 判定|Coach`, `偏差|Delta` — all scores on the 1-5 scale (§10), `Delta = Self − Coach`, signed (`+1`, `-0.5`, `0`).
- `### 模拟 vs 真实结果` / `### Mock vs real`: `日期|Date`, `漂移结论|Drift`, `校准动作|Action`.

### Update log — `## 更新日志` / `## Update log`
`日期|Date`, `来源|Source` (`模拟/真实面试/深度复习` · `mock/real/deep-review`), `更新了哪些话题|Topics updated`.

## 7. Records (YAML front-matter required)

### Real interview — `data/records/<Company>/YYYY-MM-DD-<Company>-R<n>.md`
```yaml
---
type: real
company: Meridian
round: R2            # R1 R2 R3 HR
date: 2026-02-03
role: Sr Backend
result: pass         # pass | fail | pending
topics: [话题1, 话题2, 话题3]
self_score: 3.3      # mean per-question self rating, 1-5
coach_score: 3.0     # mean coach rating, 1-5
stories: [Story 1]   # STAR stories actually used
---
```

### Mock interview — `data/mock-records/YYYY-MM-DD-HHmm-<style>-mock.md`
```yaml
---
type: mock
date: 2026-02-03
time: "15:00"
style: system-design
company: Meridian    # optional, when --company was used
topics: [话题6, 话题3]
score: 73            # composite 0-100 (§11)
self_score: 80       # blind self-score 0-100, or omit
top_level: L3
pass_estimate: 65    # %
---
```

### Mock progress — `data/mock-records/progress.md`
Table: `日期|Date`, `风格|Style`, `综合分|Score`, `话题|Topics`, `最高层级|Top level`, `薄弱点|Weak spots`, `变化|Change` (signed delta vs previous row or `—`).

### Deep review
- Mastery profile `data/deep-review-records/<话题N>-<slug>-mastery.md`, front-matter: `type: mastery`, `topic`, `target`, `created`, `sessions`, `minutes`; gate table `关|Gate`, `最高得分|Best`, `最近得分|Latest`, `日期|Date`, `状态|Status` (`✅`/`🟡`/`🔲`), `失分点|Gaps`.
- Session record `data/deep-review-records/<话题N>-<slug>-YYYY-MM-DD.md`, front-matter: `type: deep-review`, `topic`, `date`, `level` (overall = weakest gate), `scores` (map gate → 1-5).

### Prep plan — `data/prep/YYYY-MM-DD-<Company>-<round>-prep.md`
Front-matter: `type: prep`, `company`, `round`, `date`, `readiness` (0-100).

## 8. Root-cause categories

Every weak spot and diagnosis uses exactly one of:

| 中文 | English | Meaning |
|---|---|---|
| 知识盲区 | knowledge gap | doesn't know it |
| 深度不足 | shallow depth | knows it, can't reach principle level |
| 叙事缺失 | missing narrative | did it, can't tell details / data |
| 表达结构 | structure | has content, misses the point |
| 数据模糊 | vague data | no quantified support |

## 9. Readiness formula

```
core_met  = core topics whose status is 🟢 or 🕐
all_met   = all topics whose status is 🟢 or 🕐
readiness = round(100 × core_met / core_total)
tier      = 🔴 起步/starting (<40) · 🟡 备战/in-training (40–69) · 🟢 就绪/ready (70–89) · ⭐ 冲刺/peak (≥90)
```
`🕐` still counts as met (mastery was shown) but is surfaced separately as "retest due".
`profile.md` `readiness_thresholds` may override the 40/70/90 cut-offs.

## 10. Score conversion (calibration)

All calibration math uses a 1–5 scale.
- 0–100 score → 1–5: `max(1, ceil(score / 20))` (e.g. 73 → 4, 80 → 4, 81 → 5).
- 1–10 overall self-rating (debrief) → 1–5: `max(1, ceil(rating / 2))`.
- `Delta = Self − Coach`. Verdict needs ≥ 3 rows: mean ≥ +1 over-estimates, mean ≤ −1 under-estimates, else well-calibrated.

## 11. Mock composite score

Nominal weights: self-intro 10% · project deep-dive 30% · technical 30% · cross-domain 10% · leadership 10% · system design 10%.
Phases that were **not run** are dropped and the remaining weights are re-normalized to 100%
(single-topic mode = technical 100%). Each phase score = mean of its 5-dimension ratings × 20.

## 12. Data-consistency priority

`records > pipeline > capability-profile > docs`. Funnels, met-counts and readiness are always
**recomputed from tables** (§5, §9), never copied from an old summary block. On mismatch, emit a
data alert; don't silently rewrite history.

## 13. Post-write format check

After writing, a skill re-reads what it wrote and verifies: required columns present, dates ISO,
status/level cells contain only allowed values, front-matter keys present. Any violation is listed
under **Format alerts / 格式告警** in its final output. The same check can be run by hand from the
plugin repo: `cd web && npm run check -- <workspace-dir>`.
