# Canvas Round 2 Debrief — 2026-02-10 (FICTIONAL DEMO)

> Role: Sr Frontend · Previous round: Canvas R1 (2026-02-08) · Style: performance + rendering deep-dive

## Question overview
| # | Question | Dimension / Level | Difficulty | Project mapping |
|---|----------|-------------------|------------|-----------------|
| 1 | LCP critical path + how you cut it 50% | 话题3 L4 | ⭐⭐⭐ | app/shell, LCP -50% |
| 2 | Prove +7% conversion is from perf | 话题3 L4 | ⭐⭐⭐ | A/B holdout |
| 3 | When does React bail out of re-rendering? | 话题1 L4 | ⭐⭐⭐⭐ | — |

## Q1: LCP critical path
### Intent: does the candidate understand the real critical path, not just tips?
### My answer: server response → render-blocking CSS/JS → LCP image priority; route-split + defer.
### Assessment: ✅ clear, field-grounded.

## Q2: Attribution
### My answer: A/B holdout isolating the perf release. Assessment: ✅ strong rigor.

## Q3: React bail-out
### My answer: mentioned memo + keys, but couldn't precisely state the bail-out rules (same element type + referential equality of props → skip; how `React.memo` compares).
### Assessment
| Dimension | Verdict | Improvement |
|-----------|---------|-------------|
| Depth | ❌ | missed: reconciliation bail-out conditions + memo comparison semantics |

## Reinforcement TODO
- [ ] (high) React re-render bail-out rules — see review-skill 话题1

## Overall
| Dimension | Verdict |
|-----------|---------|
| Style | perf + product tied together, pushes rendering internals |
| Strong | web performance (L4), attribution |
| Weak | reconciliation internals (L4 question, answered ~L3) |

**Next-round prediction (if R3)**: frontend system design (real-time collaborative canvas), state sync, offline.

## Next steps
1. `/interview review 话题1` — close bail-out gap
2. `/mock-interview 话题6 --company Canvas`
3. `/interview prep Canvas --round 3`
