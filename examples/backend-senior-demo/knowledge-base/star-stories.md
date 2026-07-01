# STAR Story Bank — Backend (FICTIONAL DEMO)

### Story 1: Ledger correctness under concurrency
- **Topic**: 话题1, 话题2
- **Situation**: The double-entry ledger occasionally produced imbalanced accounts under concurrent writes at peak; p99 was 480ms.
- **Task**: As ledger owner, guarantee correctness and cut latency without dropping throughput.
- **Action**: Moved from broad table locks to row-level optimistic concurrency with a version column + retry; added a covering index for the hot balance query; batched writes.
- **Result**: p99 480ms → 190ms (-60%), throughput 4k → 12k TPS (+3x), zero imbalance incidents after rollout.
- **Anchor line**: "I traded coarse locking for optimistic concurrency + a covering index, so correctness and latency both improved."
- **Project block**: module `ledger/core/` | class `LedgerEntryWriter` | design: optimistic concurrency + covering index
- **Follow-ups**: ① why optimistic over pessimistic → contention profile ② how prove correctness → invariant checks + reconciliation

### Story 2: Exactly-once payment API
- **Topic**: 话题3, 话题4
- **Situation**: Client retries and partition failovers caused duplicate charges (~0.3% of retried requests).
- **Task**: Make the payment API exactly-once across retries and multi-region failover.
- **Action**: Introduced idempotency keys with a dedup store, made the charge path idempotent end-to-end, and added a reconciliation job as a safety net.
- **Result**: Duplicate charges -99%, no customer-visible double charges in the following two quarters.
- **Anchor line**: "Exactly-once is at-least-once delivery plus idempotent processing plus reconciliation."
- **Project block**: module `payments/idempotency/` | class `IdempotencyGuard` | design: idempotency key + dedup store
- **Follow-ups**: ① key collision handling → scoped keys + TTL ② what if dedup store is down → fail-closed + reconcile
