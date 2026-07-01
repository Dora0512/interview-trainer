# Topic Taxonomy — Data Engineering (FICTIONAL DEMO)

Core topics: 话题1, 话题2, 话题3, 话题5, 话题6

## L1-L5 levels
| Level | Meaning |
|------|---------|
| L1 | Knows the concept |
| L2 | Understands mechanism / can diagram it |
| L3 | Real project + quantified result (pass line) |
| L4 | Trade-offs + decisions (senior) |
| L5 | System design / cross-domain transfer (offer-level) |

Answer frame: **Background → Principle → Solution → Trade-off → Data → Extension**

---

### 话题1：Batch vs streaming
- **Category**: system mechanism
- **Covers**: bounded vs unbounded, windowing, watermarks, exactly-once semantics
- **Can answer**: "When streaming over batch? How did you get exactly-once?"
- **Pass bar**: explains delivery semantics + a real pipeline choice with data
- **Target**: L4
- **Resume link**: Ingestion Reliability (freshness < 5min)
- **STAR ref**: Story 1

### 话题2：Pipeline reliability & idempotency
- **Category**: architecture
- **Covers**: idempotent writes, dedup, retries, backfills, checkpointing, SLAs
- **Can answer**: "How do you make a load safe to re-run? How do you hit 99.9% SLA?"
- **Pass bar**: idempotency + checkpoint + SLA reasoning with real numbers
- **Target**: L4
- **Resume link**: SLA 99.9%, backfill -70%
- **STAR ref**: Story 1

### 话题3：Data modeling
- **Category**: architecture
- **Covers**: dimensional modeling, normalization, partitioning, slowly-changing dims
- **Can answer**: "How did you re-model to cut compute cost 30%?"
- **Pass bar**: model trade-offs + real cost/perf outcome
- **Target**: L4
- **Resume link**: cost -30%
- **STAR ref**: Story 2

### 话题4：Data quality & governance
- **Category**: domain-specific
- **Covers**: validation, contracts, lineage, anomaly detection
- **Target**: L3

### 话题5：Distributed compute
- **Category**: system mechanism
- **Covers**: Spark internals, shuffles, skew, partitioning, spill
- **Can answer**: "How did you fix a skewed join that blew up runtime?"
- **Pass bar**: explains shuffle/skew + a real tuning win
- **Target**: L4
- **STAR ref**: Story 2

### 话题6：System design (data)
- **Category**: architecture
- **Can answer**: "Design a near-real-time analytics pipeline for 20TB/day."
- **Pass bar**: ingestion + storage + serving + freshness + failure handling
- **Target**: L4

### 话题7：Orchestration & ops
- **Category**: ops
- **Covers**: DAG design, dependencies, retries/alerts, backfill orchestration
- **Target**: L3
