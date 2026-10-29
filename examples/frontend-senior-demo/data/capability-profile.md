# Capability Profile — Frontend (FICTIONAL DEMO)

## Status: in training
**Target**: see `profile.md` · **Pass line**: core topics L3+, overall ≥ 70

---

## Topic matrix

| # | Topic | Current | Target | Last tested | Trend | Status | Note |
|---|-------|---------|--------|-------------|-------|--------|------|
| 1 | Rendering & reconciliation | L3 | L4 | 2026-02-10 | → | 🟡 | bail-out conditions fuzzy |
| 2 | State management | L4 | L4 | 2026-02-10 | ↑ | 🟢 | — |
| 3 | Web performance (CWV) | L4 | L4 | 2026-02-10 | ↑ | 🟢 | — |
| 4 | Accessibility | L3 | L3 | 2026-02-10 | → | 🟢 | — |
| 5 | Component architecture | L3 | L4 | 2026-02-09 | → | 🟡 | — |
| 6 | Frontend system design | L2 | L4 | 2026-02-10 | → | 🟡 | state-sync/offline weak |
| 7 | Build tooling & browser internals | L2 | L3 | 2026-02-11 | ↓ | 🟡 | event loop, layout/paint |

Legend: 🔲 untested · 🟡 below target · 🟢 met · 🕐 met but last tested >30 days ago (retest due)

---

## General skills
| Dimension | Level | Note |
|-----------|-------|------|
| Self-intro | strong | leads with perf + product impact |
| Project causal chain | strong | ties perf work → conversion |
| Metric accuracy | strong | field-grounded numbers |
| Analogy opener habit | medium | uses for rendering, not architecture |
| Handling follow-ups | medium | solid on perf, weaker on internals |

---

## Readiness
> Met = 🟢 or 🕐. Readiness % = core met / core total. 🔴 <40 · 🟡 40–69 · 🟢 70–89 · ⭐ ≥90.

- Core topics met (1,2,3,5,6): 2 / 5
- All topics met: 3 / 7
- Readiness: 🟡 in-training (40%)

---

## Real-interview verification log
| Topic | Reached | Source | Date | Note |
|-------|---------|--------|------|------|
| 话题3 Web performance | L4 | Canvas R2 | 2026-02-10 | LCP/bundle story landed well |
| 话题1 Rendering | L3 | Canvas R2 | 2026-02-10 | couldn't state React bail-out rules precisely |
| 话题7 Browser internals | L2 | Verve R1 | 2026-02-11 | mixed up layout vs paint vs composite |

---

## Weak-spot tracking
| Weak spot | Topic | First seen | Count | Latest status | Root cause | Source/Note |
|-----------|-------|-----------|-------|---------------|------------|-------------|
| React re-render bail-out conditions | 话题1 | 2026-02-10 | 1 | 🟡 to fix | shallow depth | Canvas R2 |
| Event loop + layout/paint/composite pipeline | 话题7 | 2026-02-11 | 1 | 🟡 to fix | knowledge gap | Verve R1 |
| FE system design: state sync + offline | 话题6 | 2026-02-10 | 1 | 🟡 to fix | missing narrative | [mock-2026-02-10] |

---

## Calibration

### Self vs coach
> All on a 1-5 scale. Mock scores converted with `max(1, ceil(score/20))`. Delta = Self − Coach.

| Date | Source | Self | Coach | Delta |
|------|--------|------|-------|-------|
| 2026-02-08 | real-Canvas R1 | 4.0 | 3.7 | +0.3 |
| 2026-02-09 | real-Prism R1 | 3.5 | 3.5 | 0 |
| 2026-02-10 | real-Canvas R2 | 4.0 | 3.3 | +0.7 |
| 2026-02-10 | mock | 5 | 4 | +1 |
| 2026-02-11 | real-Verve R1 | 3.5 | 2.0 | +1.5 |

**Verdict**: well-calibrated overall (mean +0.7), but the last three rows are all ≥ +0.7 — drifting toward optimism after internals-heavy rounds; lean on coach scores there.

### Mock vs real
| Date | Drift | Action |
|------|-------|--------|

---

## Update log
| Date | Source | Topics updated |
|------|--------|----------------|
| 2026-02-09 | real (Prism R1) | 话题5 |
| 2026-02-10 | real (Canvas R2) | 话题1,2,3,4,6 |
| 2026-02-11 | real (Verve R1) | 话题7 |
