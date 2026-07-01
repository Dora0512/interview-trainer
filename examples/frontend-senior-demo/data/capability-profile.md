# Capability Profile — Frontend (FICTIONAL DEMO)

## Status: in training
**Target**: see `profile.md` · **Pass line**: core topics L3+, overall ≥ 70

---

## Topic matrix

| # | Topic | Current | Target | Last tested | Trend | Status |
|---|-------|---------|--------|-------------|-------|--------|
| 1 | Rendering & reconciliation | L3 | L4 | 2026-02-10 | → | 🟡 (bail-out conditions fuzzy) |
| 2 | State management | L4 | L4 | 2026-02-10 | ↑ | 🟢 |
| 3 | Web performance (CWV) | L4 | L4 | 2026-02-10 | ↑ | 🟢 |
| 4 | Accessibility | L3 | L3 | 2026-02-10 | → | 🟢 |
| 5 | Component architecture | L3 | L4 | 2026-02-08 | → | 🟡 |
| 6 | Frontend system design | L2 | L4 | 2026-02-10 | → | 🟡 (state-sync/offline weak) |
| 7 | Build tooling & browser internals | L2 | L3 | 2026-02-11 | ↓ | 🟡 (event loop, layout/paint) |

Legend: 🔲 untested · 🟡 below target · 🟢 met

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
- Core topics met (1,2,3,5,6): 2 / 5
- All topics met: 3 / 7
- Readiness: 🟡 in-training (~55%)

---

## Real-interview verification log
| Topic | Reached | Source | Date | Note |
|-------|---------|--------|------|------|
| 话题3 Web performance | L4 | Canvas R2 | 2026-02-10 | LCP/bundle story landed well |
| 话题1 Rendering | L3 | Canvas R2 | 2026-02-10 | couldn't state React bail-out rules precisely |
| 话题7 Browser internals | L2 | Verve R1 | 2026-02-11 | mixed up layout vs paint vs composite |

---

## Weak-spot tracking
| Weak spot | First seen | Count | Latest status | Source/Note |
|-----------|-----------|-------|---------------|-------------|
| React re-render bail-out conditions | 2026-02-10 | 1 | 🟡 to fix | Canvas R2 |
| Event loop + layout/paint/composite pipeline | 2026-02-11 | 1 | 🟡 to fix | Verve R1 |
| FE system design: state sync + offline | 2026-02-10 | 1 | 🟡 to fix | [deep-review pending] |

---

## Update log
| Date | Source | Topics updated |
|------|--------|----------------|
| 2026-02-08 | real (Prism R1) | 话题5 |
| 2026-02-10 | real (Canvas R2) | 话题1,2,3,4,6 |
| 2026-02-11 | real (Verve R1) | 话题7 |
