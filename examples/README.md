# Example Workspaces

> ⚠️ **Every example here is FICTIONAL** — invented candidates, companies, projects, and metrics.
> They exist to show the **shape** of a filled-in workspace for different roles. Copy the structure,
> not the content. Keep your own real workspace private (never commit it to a public repo).
>
> ⚠️ **所有示例均为虚构** —— 候选人、公司、项目、数据都是编的，只为演示不同岗位的工作区**长什么样**。
> 学结构，别照搬内容。你自己的真实工作区请保持私有。

These demonstrate that the engine is **role-agnostic within tech** — the engine (mock / debrief /
drill / capability profile) is identical across all of them; only the **config layer** differs
(`profile.md` + `knowledge-base/topics.md` + company styles + STAR stories).

| Demo | Role | Candidate | Company | What's distinct |
|------|------|-----------|---------|-----------------|
| [`android-senior-demo`](android-senior-demo/) | Senior Android | Alex Rivera | Acme (video app) | startup/rendering/crash topics; stability-focused style |
| [`backend-senior-demo`](backend-senior-demo/) | Senior Backend | Jordan Park | Meridian (payments) | concurrency/DB/distributed topics; system-design + data-driven style |
| [`frontend-senior-demo`](frontend-senior-demo/) | Senior Frontend | Sam Ito | Canvas (design SaaS) | rendering/state/Core-Web-Vitals topics; system-design + behavioral style |
| [`data-engineer-demo`](data-engineer-demo/) | Senior Data Eng | Priya Nadar | Streamline (analytics) | batch/streaming/reliability topics; data-driven style |

## Try one

```bash
cp -r examples/backend-senior-demo ~/be-demo && cd ~/be-demo
# then in Claude Code:
/interview status      # see the populated pipeline + capability profile
/interview mock        # run a mock against this fictional profile
```

## Notice the pattern

Open any two `knowledge-base/topics.md` side by side. The **taxonomy** is completely different
(concurrency vs reconciliation vs batch-streaming), but every workspace has the same file layout and
the same engine reads it. To adapt to *your* role, that's the file you rewrite first — see
[docs/customization.md](../docs/customization.md).
