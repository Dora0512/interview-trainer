# Meridian Interview Style (FICTIONAL DEMO)

> Inherits archetype: **system-design** (primary) + **data-driven** (secondary)

## Per-round focus
- Round 1: language/concurrency fundamentals + project walkthrough + 1 algorithm
- Round 2: distributed systems + database internals deep-dive
- Round 3: system design (payments-scale) + tech decisions
- Round 4 / bar-raiser: correctness reasoning + on-call/incident judgment

## Follow-up style
- Pushes on **correctness under failure**: "what if this node dies mid-write?"
- Wants numbers: "p99 before/after? how measured? contention profile?"
- Loves invariants: "how do you *prove* the ledger balances?"

## Common questions
- Isolation levels and where they break; optimistic vs pessimistic
- Exactly-once vs at-least-once; idempotency design
- Design a global ledger / rate limiter / payment gateway
- Walk through a real outage end-to-end

## Core traits
1. Correctness-first for money; failure modes matter more than happy path
2. Every claim needs a number and a measurement method
3. Bar-raiser probes judgment, not just knowledge
