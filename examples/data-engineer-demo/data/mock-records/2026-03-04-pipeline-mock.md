# Mock Interview — 2026-03-04 (FICTIONAL DEMO)

## Basics
- Style: data-driven archetype (Streamline-flavored)
- Topics: 话题2 (reliability), 话题5 (distributed compute)
- Overall: 72 / 100 · Est. pass ~64%

## Process (abridged)
### Phase 2: Project deep-dive — Ingestion Reliability
Q: "How do you guarantee exactly-once with late data?" A: watermark + allowed lateness + idempotent merge. Eval: L4, strong.

### Phase 3: Technical — 话题5 Distributed compute
Q: "A join suddenly takes 5x longer — how do you find and fix it?" A: suspected skew, mentioned salting, but couldn't say precisely how to *detect* it (stage metrics, partition-size histogram). Eval: L3, weak spot.

## Scores
### 话题2 Reliability (reached L4)
| Dimension | Score | Note |
|-----------|-------|------|
| Completeness | 5/5 | exactly-once + late data + backfill |
| Depth | 4/5 | |
| Data-driven | 5/5 | SLA + dedup numbers |
| Project link | 4/5 | ingestion pipeline |
| Clarity | 4/5 | |

### 话题5 Distributed compute (reached L3)
Key gap: ❌ skew *detection* method (stage metrics / partition histogram). Hint given: yes.

## Summary
### Overall: 72/100 · Est. pass ~64%
### Strengths: reliability design, cost/SLA framing.
### Weak spots (priority):
1. 【P0】Spark skew detection → `/deep-review 话题5`
2. 【P1】Data system-design serving layer.

### Next steps
1. `/deep-review 话题5 --company Streamline`
2. `/mock-interview 话题6`
