# Streamline Interview Style (FICTIONAL DEMO)

> Inherits archetype: **data-driven** (primary) + **system-design** (secondary)

## Per-round focus
- Round 1: SQL + data modeling + a pipeline coding task
- Round 2: distributed compute (Spark) internals + reliability deep-dive
- Round 3: data system design (ingestion → serving) + cost trade-offs
- Round 4 / hiring manager: ownership, on-call, stakeholder communication

## Follow-up style
- Cost- and SLA-aware: "what did this cost? what's the SLA? how measured?"
- Correctness-focused: "how do you guarantee no dupes? what about late data?"
- Pushes internals: "what causes the shuffle here? how did you find the skew?"

## Common questions
- Exactly-once vs at-least-once; idempotent loads; backfills
- Dimensional modeling; partitioning; SCD
- Spark skew/shuffle tuning
- Design a near-real-time analytics pipeline at scale

## Core traits
1. Reliability (SLA, idempotency) and cost are co-equal goals
2. Every optimization needs before/after cost or runtime numbers
3. Cares about late/duplicate/malformed data handling
