# Topic Taxonomy (FICTIONAL DEMO)

Core topics: 话题1, 话题2, 话题3, 话题5

## L1-L5 levels
| Level | Meaning |
|------|---------|
| L1 | Knows the concept |
| L2 | Understands the mechanism / can diagram it |
| L3 | Real project + quantified result (pass line) |
| L4 | Trade-offs + decisions (senior) |
| L5 | System design / cross-domain transfer (offer-level) |

Answer frame: **Background → Principle → Solution → Trade-off → Data → Extension**

---

### 话题1：App startup & launch optimization
- **Category**: system mechanism
- **Covers**: cold/warm/hot start, startup trace, deferred init
- **Can answer**: "What happens during a cold start? How did you optimize it?"
- **Pass bar**: explains full launch chain + has a real optimization with data
- **Target**: L4
- **Resume link**: Feed Video Pipeline (first-frame -45%)
- **STAR ref**: Story 1

### 话题2：Rendering & jank analysis
- **Category**: system mechanism
- **Covers**: vsync, Choreographer, RenderThread, frame budget
- **Can answer**: "Why 16ms/frame? How did you keep the feed at 60fps?"
- **Pass bar**: explains the frame pipeline + has a real jank fix with FPS data
- **Target**: L4
- **Resume link**: Feed scroll FPS 58-60
- **STAR ref**: Story 1

### 话题3：Memory & crash governance
- **Category**: system mechanism
- **Covers**: leak detection, OOM, ANR, crash monitoring loop
- **Can answer**: "How did you bring crash rate down? How do you verify it?"
- **Pass bar**: monitor→locate→fix→verify loop + quantified result
- **Target**: L4
- **Resume link**: Crash rate -50%
- **STAR ref**: Story 2

### 话题4：Coroutines / async
- **Category**: architecture
- **Target**: L3

### 话题5：Architecture & modularization
- **Category**: architecture
- **Can answer**: "How would you design the feed module from scratch?"
- **Pass bar**: layering + trade-offs + evolution path
- **Target**: L4

### 话题6：Tech decisions & leadership
- **Category**: behavioral
- **Target**: L4
