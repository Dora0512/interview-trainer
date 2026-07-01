# Capability Profile — Data Engineering (FICTIONAL DEMO)

## Status: in training
**Target**: see `profile.md` · **Pass line**: core topics L3+, overall ≥ 70

---

## Topic matrix

| # | Topic | Current | Target | Last tested | Trend | Status |
|---|-------|---------|--------|-------------|-------|--------|
| 1 | Batch vs streaming | L4 | L4 | 2026-03-04 | ↑ | 🟢 |
| 2 | Pipeline reliability & idempotency | L4 | L4 | 2026-03-04 | → | 🟢 |
| 3 | Data modeling | L3 | L4 | 2026-03-05 | → | 🟡 (SCD type-2 details fuzzy) |
| 4 | Data quality & governance | L3 | L3 | 2026-03-04 | → | 🟢 |
| 5 | Distributed compute (Spark) | L3 | L4 | 2026-03-04 | → | 🟡 (skew detection reasoning shaky) |
| 6 | System design (data) | L2 | L4 | 2026-03-04 | → | 🟡 (serving layer weak) |
| 7 | Orchestration & ops | L3 | L3 | 2026-03-01 | ↑ | 🟢 |

Legend: 🔲 untested · 🟡 below target · 🟢 met

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
- Core topics met (1,2,3,5,6): 2 / 5
- All topics met: 4 / 7
- Readiness: 🟡 in-training (~60%)

---

## Real-interview verification log
| Topic | Reached | Source | Date | Note |
|-------|---------|--------|------|------|
| 话题2 Reliability | L4 | Streamline R2 | 2026-03-04 | idempotency story landed well |
| 话题5 Distributed compute | L3 | Streamline R2 | 2026-03-04 | couldn't fully explain how to detect skew |
| 话题3 Data modeling | L3 | Quanta R1 | 2026-03-05 | SCD type-2 mechanics fuzzy |

---

## Weak-spot tracking
| Weak spot | First seen | Count | Latest status | Source/Note |
|-----------|-----------|-------|---------------|-------------|
| Spark skew detection (stage metrics / partition histogram) | 2026-03-04 | 1 | 🟡 to fix | Streamline R2 |
| SCD type-2 modeling mechanics | 2026-03-05 | 1 | 🟡 to fix | Quanta R1 |
| Data system design: serving layer | 2026-03-04 | 1 | 🟡 to fix | [deep-review pending] |

---

## Update log
| Date | Source | Topics updated |
|------|--------|----------------|
| 2026-03-01 | real (Datum R1) | 话题7 |
| 2026-03-04 | real (Streamline R2) | 话题1,2,4,5,6 |
| 2026-03-05 | real (Quanta R1) | 话题3 |
