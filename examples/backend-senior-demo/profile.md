---
name: Jordan Park
role: Senior Backend Engineer
years: 9
target: Payments / fintech infra, Senior or Staff level
resume_path: ./resume.md
resume_dir: ./resumes/tailored
language: en
---

# Candidate Profile (FICTIONAL DEMO)

## Background
- **Focus**: 9 years backend, specializing in high-throughput payment processing and distributed systems.
- **Current/representative company**: Meridian (a fictional payments platform).
- **Scale**: ~12k TPS at peak, 99.99% uptime SLA, multi-region.

## Core Projects
1. **Ledger Service** — rebuilt the double-entry ledger for correctness under concurrency and scale.
2. **Idempotency Layer** — added an exactly-once payment API guard across retries and partitions.

## Locked Metrics ⚠️
| Metric | Number | Project | How it was measured |
|--------|--------|---------|---------------------|
| API p99 latency | -60% (480ms → 190ms) | Ledger Service | Distributed tracing, weekly p99 |
| Throughput | +3x (4k → 12k TPS) | Ledger Service | Load test + prod peak |
| Duplicate charges | -99% | Idempotency Layer | Reconciliation job |
| Incident MTTR | -40% | on-call program | Incident tracker |
| Infra cost/txn | -25% | Ledger Service | Cost per 1k txn |

## Target & Compensation
- **Target company type**: fintech infra / payments / core platform teams
- **Target level**: Senior → Staff
- **Pass line**: all core topics L3+, overall ≥ 70

## Self-Intro Checklist
- [ ] 9 yrs backend + payments/distributed focus
- [ ] Meridian, 12k TPS, 99.99%
- [ ] 2 core projects (Ledger, Idempotency)
- [ ] ≥1 locked metric
- [ ] Differentiator: correctness-under-concurrency + cost efficiency
