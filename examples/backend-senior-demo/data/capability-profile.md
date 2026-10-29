# Capability Profile — Backend (FICTIONAL DEMO)

## Status: in training
**Target**: see `profile.md` · **Pass line**: core topics L3+, overall ≥ 70

---

## Topic matrix

| # | Topic | Current | Target | Last tested | Trend | Status | Note |
|---|-------|---------|--------|-------------|-------|--------|------|
| 1 | Concurrency & consistency | L4 | L4 | 2026-02-03 | ↑ | 🟢 | — |
| 2 | Database internals & modeling | L4 | L4 | 2026-02-03 | → | 🟢 | — |
| 3 | Distributed systems | L3 | L4 | 2026-02-03 | → | 🟡 | consensus/quorum reasoning shaky |
| 4 | API design & reliability | L4 | L4 | 2026-02-01 | ↑ | 🟢 | — |
| 5 | Algorithms | L2 | L3 | 2026-02-04 | ↓ | 🟡 | graph + DP timing |
| 6 | System design | L3 | L4 | 2026-02-03 | ↑ | 🟡 | — |
| 7 | Incident response & observability | — | L4 | — | — | 🔲 | — |

Legend: 🔲 untested · 🟡 below target · 🟢 met · 🕐 met but last tested >30 days ago (retest due)

---

## General skills
| Dimension | Level | Note |
|-----------|-------|------|
| Self-intro | strong | leads with TPS + correctness angle |
| Project causal chain | strong | ties technique → metric well |
| Metric accuracy | strong | consistent with locked numbers |
| Analogy opener habit | weak | rarely uses analogies |
| Handling follow-ups | medium | solid until failure-mode edge cases |

---

## Readiness
> Met = 🟢 or 🕐. Readiness % = core met / core total. 🔴 <40 · 🟡 40–69 · 🟢 70–89 · ⭐ ≥90.

- Core topics met (1,2,3,4,6): 3 / 5
- All topics met: 3 / 7
- Readiness: 🟡 in-training (60%)

---

## Real-interview verification log
| Topic | Reached | Source | Date | Note |
|-------|---------|--------|------|------|
| 话题1 Concurrency | L4 | Meridian R2 | 2026-02-03 | optimistic concurrency well argued |
| 话题3 Distributed | L3 | Meridian R2 | 2026-02-03 | struggled on quorum reads under partition |
| 话题5 Algorithms | L2 | Northwind R1 | 2026-02-04 | graph BFS + DP too slow, TLE |

---

## Weak-spot tracking
| Weak spot | Topic | First seen | Count | Latest status | Root cause | Source/Note |
|-----------|-------|-----------|-------|---------------|------------|-------------|
| Quorum reads under partition (CAP trade-offs) | 话题3 | 2026-02-03 | 1 | 🟡 to fix | shallow depth | Meridian R2 |
| Graph algorithms + DP timing | 话题5 | 2026-02-04 | 1 | 🟡 to fix | knowledge gap | Northwind R1 |
| System design: scale path / capacity estimation | 话题6 | 2026-02-03 | 1 | 🟡 to fix | missing narrative | [mock-2026-02-03] |

---

## Calibration

### Self vs coach
> All on a 1-5 scale. Mock scores converted with `max(1, ceil(score/20))`. Delta = Self − Coach.

| Date | Source | Self | Coach | Delta |
|------|--------|------|-------|-------|
| 2026-02-01 | real-Meridian R1 | 4.0 | 3.7 | +0.3 |
| 2026-02-03 | mock | 4 | 4 | 0 |
| 2026-02-03 | real-Meridian R2 | 3.7 | 3.3 | +0.4 |
| 2026-02-04 | real-Northwind R1 | 3.0 | 2.0 | +1.0 |

**Verdict**: well-calibrated (mean +0.4) — self-ratings are usable, slight optimism after algorithm rounds.

### Mock vs real
| Date | Drift | Action |
|------|-------|--------|

---

## Update log
| Date | Source | Topics updated |
|------|--------|----------------|
| 2026-02-01 | real (Meridian R1) | 话题4 |
| 2026-02-03 | real (Meridian R2) | 话题1,2,3,6 |
| 2026-02-04 | real (Northwind R1) | 话题5 |
