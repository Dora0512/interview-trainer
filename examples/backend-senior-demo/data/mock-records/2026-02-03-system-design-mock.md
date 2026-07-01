# Mock Interview — 2026-02-03 (FICTIONAL DEMO)

## Basics
- Style: system-design archetype (Meridian-flavored)
- Topics: 话题6 (system design), 话题3 (distributed)
- Overall: 73 / 100 · Est. pass ~65%

## Process (abridged)
### Phase 2: Project deep-dive — Ledger Service
Q: "Why optimistic concurrency over pessimistic?" A: explained contention profile + retry cost. Eval: L4, strong trade-off.

### Phase 6: System design — "Design a global payments ledger"
Q: opened with requirements + capacity. A: clarified consistency needs, proposed regional ledgers + async settlement. Eval: L3 — good layering, weak on quorum/read-consistency under partition.
Follow-up: "quorum read during a region partition?" A: hesitated, mixed up read/write quorum. Eval: weak spot.

## Scores
### 话题6 System design (reached L3)
| Dimension | Score | Note |
|-----------|-------|------|
| Completeness | 4/5 | covered settlement + consistency |
| Depth | 3/5 | thin on partition behavior |
| Data-driven | 4/5 | good capacity estimate |
| Project link | 4/5 | ledger tie-in |
| Clarity | 4/5 | |

### 话题3 Distributed (reached L3)
Key gap: ❌ quorum read/write math under partition. Hint given: yes.

## Summary
### Overall: 73/100 · Est. pass ~65%
### Strengths: concurrency trade-offs, capacity estimation.
### Weak spots (priority):
1. 【P0】Quorum reads under partition → `/deep-review 话题3`
2. 【P1】System-design scale path.

### Next steps
1. `/deep-review 话题3 --company Meridian`
2. `/mock-interview 话题6`
