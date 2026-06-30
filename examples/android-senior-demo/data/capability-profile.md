# Capability Profile (FICTIONAL DEMO)

## Status: in training
**Target**: see `profile.md` · **Pass line**: core topics L3+, overall ≥ 70

---

## Topic matrix

| # | Topic | Current | Target | Last tested | Trend | Status |
|---|-------|---------|--------|-------------|-------|--------|
| 1 | App startup & launch | L4 | L4 | 2026-01-10 | ↑ | 🟢 |
| 2 | Rendering & jank | L3 | L4 | 2026-01-10 | → | 🟡 (RenderThread internals shaky) |
| 3 | Memory & crash governance | L4 | L4 | 2026-01-10 | ↑ | 🟢 |
| 4 | Coroutines / async | L2 | L3 | 2026-01-15 | → | 🟡 |
| 5 | Architecture & modularization | L3 | L4 | 2026-01-15 | ↑ | 🟡 |
| 6 | Tech decisions & leadership | — | L4 | not tested | — | 🔲 |

Legend: 🔲 untested · 🟡 below target · 🟢 met

---

## General skills
| Dimension | Level | Note |
|-----------|-------|------|
| Self-intro | strong | clear structure, leads with metrics |
| Project causal chain | medium | sometimes states result before mechanism |
| Metric accuracy | strong | sticks to locked numbers |
| Analogy opener habit | medium | uses it for perf, not for architecture |
| Handling follow-ups | medium | solid until source-level questions |

---

## Readiness
- Core topics met (1,2,3,5): 2 / 4
- All topics met: 3 / 6
- Readiness: 🟡 in-training (~55%)

---

## Real-interview verification log
| Topic | Reached | Source | Date | Note |
|-------|---------|--------|------|------|
| 话题3 Crash governance | L4 | Acme R2 | 2026-01-10 | full loop, well received |
| 话题2 Rendering | L3 | Acme R2 | 2026-01-10 | couldn't explain RenderThread vs UI thread |

---

## Weak-spot tracking
| Weak spot | First seen | Count | Latest status | Source/Note |
|-----------|-----------|-------|---------------|-------------|
| RenderThread vs UI thread pipeline | 2026-01-10 | 1 | 🟡 to fix | Acme R2 |
| Algorithm: LRU / tree traversal | 2026-01-08 | 1 | 🟡 to fix | Bolt R1 |
| Coroutine cancellation/scope | 2026-01-15 | 1 | 🟡 to fix | [deep-review-2026-01-15] |

---

## Update log
| Date | Source | Topics updated |
|------|--------|----------------|
| 2026-01-10 | real (Acme R2) | 话题1,2,3 |
| 2026-01-15 | deep-review | 话题4 |
| 2026-01-15 | mock | 话题5 |
