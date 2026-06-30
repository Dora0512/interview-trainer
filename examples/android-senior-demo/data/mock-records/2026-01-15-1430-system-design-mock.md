# Mock Interview — 2026-01-15 14:30 (FICTIONAL DEMO)

## Basics
- Date: 2026-01-15 14:30
- Style: system-design archetype
- Topics: 话题5 (architecture), 话题4 (coroutines)
- Overall: 71 / 100
- Est. pass rate: ~65%

## Process (abridged)
### Phase 2: Project deep-dive — Feed Video Pipeline
Q: "Why a pool instead of a cache?" A: explained reuse + warm state. Eval: good, gave trade-off.

### Phase 3: Technical — 话题5 Architecture
Q: "Design the feed module from scratch." A: layered into data/domain/ui, talked DI and routing. Eval: L3 — solid layering, light on evolution/scale.
Q: "话题4 — what happens if a coroutine scope is cancelled mid-prefetch?" A: hesitated, unsure about structured cancellation. Eval: L2, weak spot.

## Scores
### 话题5 Architecture (reached L3)
| Dimension | Score | Note |
|-----------|-------|------|
| Completeness | 4/5 | clear layers |
| Depth | 3/5 | thin on evolution |
| Data-driven | 3/5 | |
| Project link | 4/5 | feed/player |
| Clarity | 4/5 | |

### 话题4 Coroutines (reached L2)
Key gap: ❌ structured concurrency / cancellation propagation. Hint given: yes.

## Summary
### Overall: 71/100 · Est. pass ~65%
### Strengths: architecture layering, project storytelling.
### Weak spots (priority):
1. 【P0】Coroutine cancellation/scope — couldn't explain. → `/deep-review 话题4`
2. 【P1】Architecture evolution under scale.

### Review-mode log
- Reviewed weak spot 1 (coroutines): confirm question ❌ (still shaky)

### Next steps
1. `/deep-review 话题4`
2. `/mock-interview 话题5`
