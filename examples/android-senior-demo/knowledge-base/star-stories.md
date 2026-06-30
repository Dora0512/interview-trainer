# STAR Story Bank (FICTIONAL DEMO)

### Story 1: Rebuilding the feed video pipeline
- **Topic**: 话题1, 话题2
- **Situation**: Home feed video had ~900ms first-frame and visible stalls during fast scroll; watch-time was flat.
- **Task**: As playback lead, cut first-frame latency and keep scrolling at 60fps.
- **Action**: Added a prefetch + warm-player pool, moved decoding off the main thread, and reused surfaces via a `PlayerPool`; tuned the feed adapter to recycle player views.
- **Result**: First-frame 900ms → 495ms (-45%), scroll FPS stable 58-60, watch-time/session +9% (A/B).
- **Anchor line**: "I turned cold per-item player creation into a warm, pooled, prefetched pipeline."
- **Project block**: module `feed/player/` | class `PlayerPool`, `FeedVideoAdapter` | design: object pool + prefetch
- **Follow-ups**: ① how prove +9% is yours → A/B vs control ② pool sizing → tuned by device tier

### Story 2: Crash governance program
- **Topic**: 话题3
- **Situation**: Crash rate spiked to 4‱ after a release, hurting retention.
- **Task**: Own the effort to halve crash rate and build a lasting guardrail.
- **Action**: Set up crash aggregation by Top-N signature → found a concurrency NPE in init → added guard + reordered init → staged rollout with a kill-switch.
- **Result**: Crash rate 4‱ → 2‱ (-50%), zero P0 in the following quarter.
- **Anchor line**: "I moved us from firefighting to a monitor→locate→fix→verify loop."
- **Project block**: module `core/stability/` | class `CrashGuard` | design: interceptor chain + staged rollout
- **Follow-ups**: ① prove it's your fix → version cohort + staged A/B ② Top crash capture → aggregation pipeline
