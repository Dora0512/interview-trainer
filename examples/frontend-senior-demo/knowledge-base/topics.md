# Topic Taxonomy — Frontend (FICTIONAL DEMO)

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

### 话题1：Rendering & reconciliation
- **Category**: system mechanism
- **Covers**: virtual DOM diffing, reconciliation, keys, batching, when to bail out
- **Can answer**: "How does reconciliation decide to re-render? How did you cut renders?"
- **Pass bar**: explains diffing + a real render-cost optimization with data
- **Target**: L4
- **Resume link**: Canvas Render Engine (INP < 200ms)
- **STAR ref**: Story 1

### 话题2：State management
- **Category**: architecture
- **Covers**: local vs global state, selectors/memoization, derived state, server-state caching
- **Can answer**: "How did you structure state for a 10k-object canvas without over-rendering?"
- **Pass bar**: state shape + memoization reasoning + real result
- **Target**: L4
- **STAR ref**: Story 1

### 话题3：Web performance (Core Web Vitals)
- **Category**: system mechanism
- **Covers**: LCP/INP/CLS, code splitting, critical path, hydration, image/asset strategy
- **Can answer**: "Why did LCP drop 50%? Walk me through the critical path."
- **Pass bar**: measure→locate→fix→verify loop + field data
- **Target**: L4
- **Resume link**: LCP -50%, bundle -35%
- **STAR ref**: Story 2

### 话题4：Accessibility
- **Category**: domain-specific
- **Covers**: semantics, ARIA, focus management, keyboard nav, screen readers
- **Target**: L3
- **STAR ref**: Story 2

### 话题5：Component architecture
- **Category**: architecture
- **Covers**: composition, boundaries, design systems, API design for components
- **Target**: L4

### 话题6：Frontend system design
- **Category**: architecture
- **Can answer**: "Design a real-time collaborative canvas frontend."
- **Pass bar**: rendering strategy + state sync + perf budget + failure/offline
- **Target**: L4

### 话题7：Build tooling & browser internals
- **Category**: system mechanism
- **Covers**: bundlers, tree-shaking, event loop, layout/paint/composite
- **Target**: L3
