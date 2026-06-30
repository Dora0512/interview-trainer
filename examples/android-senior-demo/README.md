# Example Workspace — "android-senior-demo"

> ⚠️ **Everything here is FICTIONAL.** The candidate (*Alex Rivera*), the company (*Acme*, a made-up
> video app), the projects, class names, and metrics are all invented to demonstrate the **shape** of
> a filled-in workspace. Copy the structure, not the content.
>
> ⚠️ **本目录内容全部为虚构**。候选人、公司、项目、类名、数据都是为了演示一个填好的工作区
> **长什么样**而编造的。学它的结构，别照搬内容。

This is what your workspace looks like after running `/interview setup` and a few rounds of mock
interviews and debriefs. It shows the full loop:

```
android-senior-demo/
├── profile.md                          # identity + locked metrics
├── knowledge-base/
│   ├── topics.md                       # the candidate's topic taxonomy
│   ├── star-stories.md                 # filled STAR stories
│   ├── analogy-bank.md                 # filled analogies
│   └── company-styles/Acme.md          # one concrete company, inheriting an archetype
└── data/
    ├── pipeline.md                     # populated funnel
    ├── capability-profile.md           # populated topic matrix + weak spots
    ├── records/Acme/Acme-round2.md     # a real-interview debrief record
    └── mock-records/2026-01-15-mock.md # a mock interview record
```

To try the engine against this example, copy this directory somewhere private and run Claude Code
from inside it:

```
cp -r examples/android-senior-demo ~/my-demo && cd ~/my-demo
# then in Claude Code:
/interview status
```
