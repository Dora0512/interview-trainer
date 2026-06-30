# Interview Trainer · 面试训练官

> A personal **interview training officer** for tech roles — runs as a Claude Code plugin.
> One `/interview` command orchestrates mock interviews, post-interview debriefs, progressive
> skill drilling, a self-updating capability profile, pipeline tracking, and resume tailoring.
>
> 一套技术岗 **面试训练官**（Claude Code 插件）。一个 `/interview` 命令打通模拟面试、面试复盘、
> 渐进式技能闯关、自动更新的能力画像、面试管线追踪和简历定制。

*[English](#english) · [中文](#中文)*

---

## English

### What is this?

Interview Trainer is a Claude Code plugin distilled from a real interview-prep system that was
battle-tested across a full job-hunting season (18+ real interviews). It is **not** a static
question bank. It is a closed-loop coaching system:

- **Mock interview engine** — Claude role-plays a hiring-bar interviewer, asks **one question at a
  time**, adaptively drills deeper, and never leaks the answer mid-interview. Scores you afterward.
- **Debrief** — after a real interview, Claude walks you through recall, diagnoses each answer
  against a target level, and writes a structured record.
- **Progressive drilling (L1→L5)** — a graded ladder per skill (analogy → principle → project →
  resisting follow-ups → cross-domain transfer) with a cross-session mastery profile. Low scores
  flow back as targeted remediation next time.
- **Capability profile** — a living matrix of topics × levels × weak-spot tracking × readiness,
  updated automatically by both mock and real interviews.
- **Pipeline + analytics** — track every company through the funnel; get cross-interview analysis.
- **Resume tailoring** — JD-driven match scoring and ATS optimization with a strict no-fabrication
  rule.

Everything is connected by feedback loops: a weak spot exposed in a real debrief automatically
becomes a remediation level in your next drill; mock results update your capability profile; the
smart navigator reads all of it to tell you what to do next.

### Three-layer design

The plugin ships the **engine**. *You* own your **profile** and **knowledge base**. Your interview
**state** is auto-maintained.

```
ENGINE  (this repo, shared)        skills/  — 9 skills behind one /interview router
   │
   ▼ reads / writes
WORKSPACE  (yours, private)
├── profile.md            ← who you are, your target, your locked metrics, resume path
├── knowledge-base/       ← your topics, analogies, STAR stories, company styles, methodologies
└── data/                 ← auto-maintained: pipeline, capability profile, records, mock logs…
```

Your workspace is just a directory you run Claude Code from. `/interview setup` creates it for you.

### Install

```
/plugin marketplace add Dora0512/interview-trainer
/plugin install interview-trainer
```

### Quickstart (60 seconds)

```
# 1. Create a directory to be your interview workspace, and run Claude Code from inside it.
mkdir my-interview-prep && cd my-interview-prep

# 2. In Claude Code, bootstrap your profile + knowledge base (interactive):
/interview setup

# 3. From then on, just ask the navigator what to do next:
/interview
```

### Command reference

| Command | What it does | Writes files? |
|---|---|---|
| `/interview` | Smart navigation — analyzes your state, recommends next action | No |
| `/interview setup` | One-time onboarding: builds profile + knowledge-base + data skeleton | Yes |
| `/interview status` | Pipeline dashboard + capability profile + weak-spot tracker | No |
| `/interview analytics` | Cross-interview analysis report | Yes |
| `/interview apply <company> <JD>` | Tailor resume + add to pipeline | Yes |
| `/interview prep <company>` | Targeted prep plan for an upcoming round | Yes |
| `/interview mock [topic] [--company X]` | Interactive mock interview, then scoring | Yes |
| `/interview debrief` | Post-interview debrief (interactive) | Yes |
| `/interview review <topic>` | One-shot review card for a skill | Usually no |
| `/interview review-deep <topic>` | Progressive L1-L5 drilling, cross-session | Yes |
| `/interview coach <question>` | Generate a high-quality answer | No |

Each sub-skill is also callable directly: `/mock-interview`, `/interview-debrief`, `/deep-review`,
`/review-skill`, `/interview-coach`, `/interview-prep`, `/resume-tailor`.

### Customize it for your role

Interview Trainer is **role-agnostic within tech**. Backend, frontend, mobile, data, infra, PM-ish
hybrid roles — you define your own topic taxonomy and company styles in `knowledge-base/`. See
[docs/customization.md](docs/customization.md).

### Docs

- [Architecture](docs/architecture.md) — the three layers and how the feedback loops fit together.
- [Customization](docs/customization.md) — define your own topics, company styles, methodologies.
- An example workspace lives in [`examples/android-senior-demo/`](examples/android-senior-demo/)
  (a fictional candidate — copy its shape, not its content).

### Privacy

Your `profile.md`, resume, STAR stories, and real interview records are **personal**. Keep your
workspace in a private directory, **not** committed to this public repo (see `.gitignore`). The
example workspace uses an entirely fictional candidate and company.

---

## 中文

### 这是什么？

Interview Trainer 是一个 Claude Code 插件，源自一套经过完整求职季（18+ 场真实面试）打磨的面试备战系统。
它**不是**静态题库，而是一个闭环教练系统：

- **模拟面试引擎** —— Claude 扮演卡线面试官，**一次只问一个问题**，自适应深挖，面试中绝不透露答案，结束后评分。
- **面试复盘** —— 真实面试后，Claude 引导你回忆、按目标层级诊断每道题、生成结构化记录。
- **渐进式闯关（L1→L5）** —— 每个技能一条评分阶梯（类比 → 原理 → 项目落地 → 抗追问 → 跨场景迁移），
  跨会话维护掌握度档案，低分自动倒灌成下次的针对性补强关。
- **能力画像** —— 话题 × 层级 × 薄弱点追踪 × 准备度 的活矩阵，模拟和真实面试都会自动更新它。
- **管线 + 分析** —— 追踪每家公司在漏斗中的位置，生成跨面试分析。
- **简历定制** —— 按 JD 做匹配评分和 ATS 优化，严守不编造红线。

所有模块由反馈回路串联：真实复盘暴露的薄弱点，自动变成下次闯关的补强关；模拟结果更新能力画像；
智能导航读取这一切，告诉你下一步该做什么。

### 三层架构

插件发布的是**引擎**。**你**拥有自己的**画像**和**知识库**。你的面试**状态**自动维护。

```
引擎层（本仓库，共享）            skills/  —— 一个 /interview 路由器 + 9 个 skill
   │
   ▼ 读 / 写
工作区（你的，私有）
├── profile.md            ← 你是谁、目标、锁定的量化数据、简历路径
├── knowledge-base/       ← 你的话题体系、类比、STAR 故事、公司风格、方法论
└── data/                 ← 自动维护：管线、能力画像、面试记录、模拟记录……
```

工作区就是你启动 Claude Code 的那个目录。`/interview setup` 会帮你建好。

### 安装

```
/plugin marketplace add Dora0512/interview-trainer
/plugin install interview-trainer
```

### 60 秒上手

```
# 1. 建一个目录作为你的面试工作区，在里面启动 Claude Code
mkdir my-interview-prep && cd my-interview-prep

# 2. 在 Claude Code 里交互式初始化画像 + 知识库
/interview setup

# 3. 之后只管问导航该做什么
/interview
```

### 命令一览

| 命令 | 作用 | 写文件？ |
|---|---|---|
| `/interview` | 智能导航 —— 分析状态，推荐下一步 | 否 |
| `/interview setup` | 一次性初始化：建画像 + 知识库 + 数据骨架 | 是 |
| `/interview status` | 管线仪表盘 + 能力画像 + 薄弱点追踪 | 否 |
| `/interview analytics` | 跨面试分析报告 | 是 |
| `/interview apply <公司> <JD>` | 定制简历 + 加入管线 | 是 |
| `/interview prep <公司>` | 针对下一轮的准备计划 | 是 |
| `/interview mock [话题] [--company X]` | 交互式模拟面试 + 评分 | 是 |
| `/interview debrief` | 面试后交互式复盘 | 是 |
| `/interview review <话题>` | 技能点一站式复习卡片 | 通常否 |
| `/interview review-deep <话题>` | 渐进式 L1-L5 闯关，跨会话 | 是 |
| `/interview coach <问题>` | 生成高质量面试回答 | 否 |

每个子 skill 也可独立调用：`/mock-interview`、`/interview-debrief`、`/deep-review`、`/review-skill`、
`/interview-coach`、`/interview-prep`、`/resume-tailor`。

### 按你的岗位定制

Interview Trainer 在技术岗内**领域无关**。后端、前端、移动、数据、基础架构、偏产品的混合岗都行——
你在 `knowledge-base/` 里定义自己的话题体系和公司风格。见 [docs/customization.md](docs/customization.md)。

### 文档

- [架构](docs/zh/architecture.md) —— 三层结构和反馈回路如何拼合。
- [定制](docs/zh/customization.md) —— 定义你自己的话题、公司风格、方法论。
- 示例工作区在 [`examples/android-senior-demo/`](examples/android-senior-demo/)（虚构候选人——学它的结构，别照搬内容）。

### 隐私

你的 `profile.md`、简历、STAR 故事、真实面试记录都是**个人信息**。把工作区放在私有目录里，
**不要**提交到这个公开仓库（见 `.gitignore`）。示例工作区使用完全虚构的候选人和公司。

---

*Built from a real, battle-tested interview system. Engine is shared; your data stays yours.*
*源自一套真实打磨的面试系统。引擎共享，数据归你。*
