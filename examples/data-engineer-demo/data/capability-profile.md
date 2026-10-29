# Capability Profile — Data Engineering (FICTIONAL DEMO)

## Status: in training
**Target**: see `profile.md` · **Pass line**: core topics L3+, overall ≥ 70

---

## Topic matrix

| # | Topic | Current | Target | Last tested | Trend | Status | Note |
|---|-------|---------|--------|-------------|-------|--------|------|
| 1 | Batch vs streaming | L4 | L4 | 2026-03-04 | ↑ | 🟢 | — |
| 2 | Pipeline reliability & idempotency | L4 | L4 | 2026-03-04 | → | 🟢 | — |
| 3 | Data modeling | L3 | L4 | 2026-03-05 | → | 🟡 | SCD type-2 details fuzzy |
| 4 | Data quality & governance | L3 | L3 | 2026-03-04 | → | 🟢 | — |
| 5 | Distributed compute (Spark) | L3 | L4 | 2026-03-04 | → | 🟡 | skew detection reasoning shaky |
| 6 | System design (data) | L2 | L4 | 2026-03-04 | → | 🟡 | serving layer weak |
| 7 | Orchestration & ops | L3 | L3 | 2026-03-01 | ↑ | 🟢 | — |

Legend: 🔲 untested · 🟡 below target · 🟢 met · 🕐 met but last tested >30 days ago (retest due)

---

## General skills
| Dimension | Level | Note |
|-----------|-------|------|
| Self-intro | strong | leads with SLA + cost |
| Project causal chain | strong | technique → cost/SLA |
| Metric accuracy | strong | consistent with locked numbers |
| Analogy opener habit | weak | rarely uses analogies |
| Handling follow-ups | medium | strong on reliability, weaker on compute internals |

---

## Readiness
> Met = 🟢 or 🕐. Readiness % = core met / core total. 🔴 <40 · 🟡 40–69 · 🟢 70–89 · ⭐ ≥90.

- Core topics met (1,2,3,5,6): 2 / 5
- All topics met: 4 / 7
- Readiness: 🟡 in-training (40%)

---

## Real-interview verification log
| Topic | Reached | Source | Date | Note |
|-------|---------|--------|------|------|
| 话题2 Reliability | L4 | Streamline R2 | 2026-03-04 | idempotency story landed well |
| 话题5 Distributed compute | L3 | Streamline R2 | 2026-03-04 | couldn't fully explain how to detect skew |
| 话题3 Data modeling | L3 | Quanta R1 | 2026-03-05 | SCD type-2 mechanics fuzzy |

---

## Weak-spot tracking
| Weak spot | Topic | First seen | Count | Latest status | Root cause | Source/Note |
|-----------|-------|-----------|-------|---------------|------------|-------------|
| Spark skew detection (stage metrics / partition histogram) | 话题5 | 2026-03-04 | 1 | 🟡 to fix | shallow depth | Streamline R2 |
| SCD type-2 modeling mechanics | 话题3 | 2026-03-05 | 1 | 🟡 to fix | knowledge gap | Quanta R1 |
| Data system design: serving layer | 话题6 | 2026-03-04 | 1 | 🟡 to fix | missing narrative | [mock-2026-03-04] |

---

## Calibration

### Self vs coach
> All on a 1-5 scale. Mock scores converted with `max(1, ceil(score/20))`. Delta = Self − Coach.

| Date | Source | Self | Coach | Delta |
|------|--------|------|-------|-------|
| 2026-03-01 | real-Streamline R1 | 3.5 | 3.7 | -0.2 |
| 2026-03-03 | real-Datum R1 | 3.5 | 3.5 | 0 |
| 2026-03-04 | mock | 4 | 4 | 0 |
| 2026-03-04 | real-Streamline R2 | 3.7 | 3.5 | +0.2 |
| 2026-03-05 | real-Quanta R1 | 3.0 | 2.3 | +0.7 |

**Verdict**: well-calibrated (mean +0.1).

### Mock vs real
| Date | Drift | Action |
|------|-------|--------|

---

## Update log
| Date | Source | Topics updated |
|------|--------|----------------|
| 2026-03-01 | real (Streamline R1) | 话题7 |
| 2026-03-04 | real (Streamline R2) | 话题1,2,4,5,6 |
| 2026-03-05 | real (Quanta R1) | 话题3 |
