# Meridian Round 2 Debrief — 2026-02-03 (FICTIONAL DEMO)

> Role: Sr Backend · Previous round: Meridian R1 (2026-02-01) · Style: distributed + DB deep-dive

## Question overview
| # | Question | Dimension / Level | Difficulty | Project mapping |
|---|----------|-------------------|------------|-----------------|
| 1 | Ledger correctness under concurrency | 话题1 L4 | ⭐⭐⭐⭐ | ledger/core, LedgerEntryWriter, p99 -60% |
| 2 | Why p99 dropped 60% | 话题2 L4 | ⭐⭐⭐ | covering index |
| 3 | Quorum reads during a region partition | 话题3 L4 | ⭐⭐⭐⭐ | — |

## Q1: Ledger correctness under concurrency
### Intent: does the candidate reason about isolation and failure, not just the happy path?
### My answer: optimistic concurrency + version column + retry; explained contention profile.
### Follow-up: "what if two writers collide on the same account repeatedly?" → bounded retry + backoff, fall back to queue.
### Assessment
| Dimension | Verdict | Improvement |
|-----------|---------|-------------|
| Depth | ✅ | strong trade-off reasoning |
| Correctness | ✅ | invariant + reconciliation |

## Q2: p99 -60%
### My answer: covering index for hot balance query + write batching, measured via tracing.
### Assessment: ✅ solid, data-backed.

## Q3: Quorum reads during partition
### My answer: mixed up read vs write quorum; couldn't state R + W > N reasoning or the staleness trade-off under partition.
### Assessment
| Dimension | Verdict | Improvement |
|-----------|---------|-------------|
| Depth | ❌ | missed: R+W>N, and CAP trade-off (consistency vs availability) during partition |

## Reinforcement TODO
- [ ] (high) Quorum math + CAP trade-offs under partition — see deep-review 话题3

## Overall
| Dimension | Verdict |
|-----------|---------|
| Style | correctness-first, pushes on failure modes |
| Strong | concurrency (L4), DB tuning (L4) |
| Weak | distributed consistency under partition (L4 question, answered ~L3) |

**Next-round prediction (if R3)**: system design at payments scale, capacity estimation, tech decisions.

## Next steps
1. `/interview review 话题3` — close quorum/CAP gap
2. `/mock-interview 话题6 --company Meridian`
3. `/interview prep Meridian --round 3`
