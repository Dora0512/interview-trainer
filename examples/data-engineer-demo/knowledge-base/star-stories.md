# STAR Story Bank — Data Engineering (FICTIONAL DEMO)

### Story 1: Idempotent, near-real-time ingestion
- **Topic**: 话题1, 话题2
- **Situation**: Ingestion was batch-only with 45-min freshness, frequent duplicate rows on retries, and backfills took 12h.
- **Task**: As ingestion owner, cut freshness to minutes and make loads exactly-once and re-runnable.
- **Action**: Moved hot sources to streaming with watermarks + checkpointing, made sinks idempotent via merge-on-key with a dedup audit, and parallelized backfills by partition.
- **Result**: Freshness 45min → <5min, duplicate rows -99.9%, backfill 12h → 3.6h (-70%), SLA 99.9% on-time.
- **Anchor line**: "Exactly-once = checkpointed streaming + idempotent merge-on-key + a dedup audit as a net."
- **Project block**: module `ingest/streaming/` | job `MergeOnKeyLoader` | design: watermark + checkpoint + idempotent merge
- **Follow-ups**: ① late-arriving data → watermark + allowed lateness ② checkpoint store failure → replay from source offset

### Story 2: Warehouse re-modeling for cost + skew
- **Topic**: 话题3, 话题5
- **Situation**: A core Spark join was skewed on a few hot keys, blowing runtime and warehouse cost; the mart was over-normalized.
- **Task**: Cut compute cost without hurting query latency.
- **Action**: Salted the skewed join keys, re-partitioned by date, denormalized the hot mart into a wide table, and pruned unused columns.
- **Result**: Compute cost -30%, the worst job runtime -55%, no query-latency regressions.
- **Anchor line**: "I fixed skew with salting + partitioning and traded normalization for a wide read-optimized mart."
- **Project block**: module `warehouse/marts/` | design: key-salting + date partition + denormalized wide table
- **Follow-ups**: ① why denormalize → read/write ratio ② how detect skew → stage metrics + partition size histogram
