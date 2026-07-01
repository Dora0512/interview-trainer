# Streamline Round 2 Debrief — 2026-03-04 (FICTIONAL DEMO)

> Role: Sr Data Eng · Previous round: Streamline R1 (2026-03-01) · Style: distributed compute + reliability deep-dive

## Question overview
| # | Question | Dimension / Level | Difficulty | Project mapping |
|---|----------|-------------------|------------|-----------------|
| 1 | Exactly-once ingestion with late data | 话题2 L4 | ⭐⭐⭐⭐ | ingest/streaming, MergeOnKeyLoader, SLA 99.9% |
| 2 | Cut compute cost 30% — what did you change? | 话题3 L3 | ⭐⭐⭐ | warehouse/marts |
| 3 | A join is suddenly 5x slower — find and fix it | 话题5 L4 | ⭐⭐⭐⭐ | — |

## Q1: Exactly-once + late data
### Intent: does the candidate reason about delivery semantics and failure, not just the happy path?
### My answer: watermark + allowed lateness + idempotent merge-on-key + dedup audit.
### Follow-up: "checkpoint store goes down mid-run?" → replay from source offset. Assessment: ✅ strong.

## Q2: Cost -30%
### My answer: key-salting + date partition + denormalized wide mart + column pruning, measured via warehouse billing.
### Assessment: ✅ good, data-backed (L3; light on when NOT to denormalize).

## Q3: Detect + fix a skewed join
### My answer: guessed skew and mentioned salting as the fix, but couldn't say precisely how to *detect* it — didn't mention stage metrics or partition-size histograms.
### Assessment
| Dimension | Verdict | Improvement |
|-----------|---------|-------------|
| Depth | ❌ | missed: skew *detection* via stage metrics / partition-size histogram / spill signals |

## Reinforcement TODO
- [ ] (high) Spark skew detection method — see deep-review 话题5

## Overall
| Dimension | Verdict |
|-----------|---------|
| Style | reliability + cost co-equal, pushes compute internals |
| Strong | reliability/idempotency (L4), cost framing |
| Weak | skew *detection* (L4 question, answered ~L3) |

**Next-round prediction (if R3)**: data system design (ingestion → serving), freshness/cost trade-offs.

## Next steps
1. `/deep-review 话题5 --company Streamline` — close skew-detection gap
2. `/mock-interview 话题6 --company Streamline`
3. `/interview prep Streamline --round 3`
