# STAR Story Bank — Frontend (FICTIONAL DEMO)

### Story 1: Canvas render engine for large documents
- **Topic**: 话题1, 话题2
- **Situation**: Editing documents with 10k+ objects caused dropped frames and >400ms interaction latency; whole-canvas re-renders on every change.
- **Task**: As render lead, keep interactions under 200ms (INP) at 10k objects.
- **Action**: Switched to a virtualized scene graph, memoized object components with stable keys, moved diffing to a layer cache, and batched updates via a scheduler.
- **Result**: INP p75 < 200ms at 10k objects, dropped frames -85%, no regressions on small docs.
- **Anchor line**: "I stopped re-rendering the whole canvas and started diffing only the layers that changed."
- **Project block**: module `editor/render/` | class `SceneGraphRenderer` | design: virtualization + layer cache + memoized nodes
- **Follow-ups**: ① why not just React.memo everything → measured, memo overhead vs win ② how measured INP → RUM p75

### Story 2: Core Web Vitals + accessibility program
- **Topic**: 话题3, 话题4
- **Situation**: LCP was 3.8s on the editor landing, initial bundle 1.2MB, and axe flagged many a11y issues; conversion was flat.
- **Task**: Own Core Web Vitals and accessibility across the app.
- **Action**: Route-based code splitting, deferred non-critical JS, prioritized the LCP image, and fixed focus/ARIA in the component library with an axe CI gate.
- **Result**: LCP 3.8s → 1.9s (-50%), initial bundle 1.2MB → 780KB (-35%), a11y issues -80%, editor conversion +7% (A/B).
- **Anchor line**: "I made the critical path smaller and the app usable by keyboard/screen reader, and it moved conversion."
- **Project block**: module `app/shell/` | design: route-split + LCP prioritization + axe CI gate
- **Follow-ups**: ① prove +7% is perf → A/B holdout ② hydration cost trade-off → measured TBT
