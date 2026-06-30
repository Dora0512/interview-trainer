# Acme Round 2 Debrief — 2026-01-10 (FICTIONAL DEMO)

> Role: Sr Android · Previous round: Acme R1 (2026-01-06) · Style: stability deep-dive, gentle pace

## Question overview
| # | Question | Dimension / Level | Difficulty | Project mapping |
|---|----------|-------------------|------------|-----------------|
| 1 | Walk me through your crash governance | 话题3 L4 | ⭐⭐⭐ | core/stability, CrashGuard, -50% |
| 2 | How do you keep the feed at 60fps? | 话题2 L3 | ⭐⭐⭐ | feed/player, FPS 58-60 |
| 3 | RenderThread vs UI thread — who does what? | 话题2 L4 | ⭐⭐⭐⭐ | — |

## Q1: Crash governance
### Intent: does the candidate own a real, measurable stability loop?
### My answer: described monitor→locate→fix→verify, gave 4‱→2‱, staged rollout.
### Follow-up: "how do you prove the drop is your fix?" → answered with version cohort + staged A/B.
### Assessment
| Dimension | Verdict | Improvement |
|-----------|---------|-------------|
| Loop completeness | ✅ | — |
| Metric accuracy | ✅ | matched locked -50% |
| Attribution | ✅ | cohort + staged |

## Q2: Feed 60fps
### My answer: prefetch + warm player pool + off-main decode, FPS 58-60.
### Assessment: ✅ solid project answer with data.

## Q3: RenderThread vs UI thread
### My answer: vague — said "RenderThread draws" but couldn't explain DisplayList handoff or pipelining.
### Assessment
| Dimension | Verdict | Improvement |
|-----------|---------|-------------|
| Depth | ❌ | missed: UI thread builds DisplayList → syncs to RenderThread → GPU; they pipeline |

## Reinforcement TODO
- [ ] (high) RenderThread vs UI thread pipeline — see review-skill 话题2

## Overall
| Dimension | Verdict |
|-----------|---------|
| Style | stability-first, pushes on verification |
| Strong | crash governance (L4), feed perf (L3) |
| Weak | rendering internals (L4 question, answered ~L2) |

**Next-round prediction (if R3)**: architecture of feed module, tech decisions, possibly leadership.

## Next steps
1. `/interview review 话题2` — close RenderThread gap (cited above)
2. `/interview mock 话题2 --company Acme` — re-drill rendering
3. `/interview prep Acme --round 3`
