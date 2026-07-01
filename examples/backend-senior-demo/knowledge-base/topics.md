# Topic Taxonomy — Backend (FICTIONAL DEMO)

Core topics: 话题1, 话题2, 话题3, 话题4, 话题6

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

### 话题1：Concurrency & consistency
- **Category**: system mechanism
- **Covers**: locking, isolation levels, optimistic vs pessimistic, race conditions
- **Can answer**: "How did you keep the ledger correct under concurrent writes?"
- **Pass bar**: explains isolation trade-offs + a real correctness fix with data
- **Target**: L4
- **Resume link**: Ledger Service
- **STAR ref**: Story 1

### 话题2：Database internals & data modeling
- **Category**: system mechanism
- **Covers**: indexing, query planning, transactions, sharding, replication
- **Can answer**: "Why did p99 drop 60%? What did the query planner do?"
- **Pass bar**: explains index/plan reasoning + real optimization with numbers
- **Target**: L4
- **Resume link**: p99 -60%
- **STAR ref**: Story 1

### 话题3：Distributed systems
- **Category**: architecture
- **Covers**: consensus, CAP, exactly-once vs at-least-once, partitioning, clocks
- **Can answer**: "How do you guarantee exactly-once payment across retries?"
- **Pass bar**: idempotency + dedup + partition reasoning with a real design
- **Target**: L4
- **STAR ref**: Story 2

### 话题4：API design & reliability
- **Category**: architecture
- **Covers**: idempotency keys, versioning, rate limiting, backpressure, timeouts/retries
- **Can answer**: "Design a payment API that's safe to retry."
- **Target**: L4
- **STAR ref**: Story 2

### 话题5：Algorithms
- **Category**: algorithm
- **Target**: L3

### 话题6：System design
- **Category**: architecture
- **Can answer**: "Design a global payments ledger."
- **Pass bar**: layering + consistency model + failure handling + scale path
- **Target**: L4

### 话题7：Incident response & observability
- **Category**: behavioral / ops
- **Can answer**: "Walk me through a payment outage you handled end-to-end."
- **Target**: L4
