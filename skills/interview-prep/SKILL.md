---
name: interview-prep
description: Interview prep orchestrator — given a target company and round, analyzes history, predicts what will be assessed, identifies weak spots, and generates a targeted prep plan.
user_invocable: true
---

# 面试准备编排 Skill / Interview Prep Orchestrator

根据目标公司和即将到来的面试轮次，生成针对性准备计划。

> **语言规则**：指令用中文写，但用**用户的语言**输出准备计划。

## 使用方式

```
/interview-prep <公司>                 # 生成准备计划（自动推断轮次）
/interview-prep <公司> --round 二面     # 指定轮次
/interview-prep <公司> --jd <JD文本>    # 带 JD 上下文
/interview-prep <公司> --hr            # 针对 HR 面准备
/interview-prep <公司> --readiness     # 只看准备度评分
```

---

## 工作区路径（准备开始前读取）

| 内容 | 路径 |
|------|------|
| 用户画像（身份/简历卖点/量化数据锁定/目标） | `profile.md` |
| 话题体系 + 各话题 L1-L5 标准答案 | `knowledge-base/topics.md` |
| 深度追问清单 | `knowledge-base/deep-dive-questions.md` |
| STAR 故事库 | `knowledge-base/star-stories.md` |
| 公司风格库 | `knowledge-base/company-styles/*.md` |
| HR 问题参考（如有） | `knowledge-base/hr-questions.md` |
| 面试管线 | `data/pipeline.md` |
| 能力画像 | `data/capability-profile.md` |
| 该公司历史面试记录 | `data/records/<公司>/*.md` |
| 该公司已有准备文档 | `data/prep/*<公司>*.md` |
| 该公司定制简历 | `profile.md` 中简历目录下的 `*<公司>*.md`（如有） |
| 跨面试分析（如有） | `data/analytics.md` |

---

## 执行流程

### Step 1：收集上下文
1. 从管线读该公司当前阶段，推断即将到来的轮次
2. 读该公司所有历史记录，提取每轮考察话题、难度风格、表现和暴露弱点
3. 有 JD 或定制简历则提取技术要求
4. 从能力画像读各话题当前水平

### Step 2：分析与预测

**公司风格推断**：优先从 `knowledge-base/company-styles/<公司>.md` 读；若无该文件，从历史记录归纳，并匹配最接近的 archetype（算法深挖型 / 数据驱动型 / 稳定性型 / 系统设计型 / 行为面型 / 领域专项型）。

**考察方向预测逻辑**：
- 上轮已考话题：二面通常不重复但更深
- 上轮暴露弱点：面试官可能交叉验证
- JD 核心要求但未考的话题：高概率本轮出现
- 该公司特色方向（从 company-styles 取）
- 二面/三面通常增加：系统设计、技术决策、架构思维

### Step 3：生成准备计划

```markdown
# <公司><轮次>面试准备
> 预计面试时间：<从管线或用户输入> | 管线状态：<当前阶段> | 准备度评分：<X>%

## 上轮回顾
> 上轮日期：<日期> | 考察方向：<话题列表> | 表现：<强项>✅ <弱点>❌
> 详细复盘：<面试记录链接>

## 本轮预测
| # | 预测考察方向 | 预测概率 | 你的当前水平 | 目标 | 差距 | 紧急度 |
|---|---|---|---|---|---|---|
| 1 | <话题> | 🔴 高 | L<N> | L<M> | <差距> | P0 |

## 紧急复习清单
### P0（高概率 + 有差距，必须复习）
1. **<话题>** — <差距> 复习：`/interview review <话题>` 重点：<知识点> 来源：<在哪找>
### P1（中概率或差距小）
### 模拟练习
3. `/interview mock <核心话题> --company <公司>` — 针对最弱话题模拟一次

## 自查 Checklist
□ <话题1> 能用类比开场 + 30 秒说清核心概念？
□ <话题2> 能画出关键 Mermaid 图？
□ <话题3> 能说出项目实战模块 + 量化数据？
□ 自我介绍准备好？（结构见 profile.md）
□ 简历量化数据背熟？（profile.md 锁定数据）
□ 该公司相关 STAR 故事准备好？
□ 薪资期望准备好？（目标见 profile.md）

## 准备度评估
准备度：🟡 <X>%（<关键差距>）
建议：<具体，如"用 2 小时复习 X + 做 1 次模拟可提升到 🟢 80%">
```

---

## `--hr` 模式

针对 HR 面/终面（参考 `knowledge-base/hr-questions.md`，如有）：

```markdown
# <公司> HR 面准备
## 必问题准备
### 1. 离职原因 > 通用答法 + 针对 <公司> 的定制版
### 2. 为什么选择我们公司 > 结合公司业务特点
### 3. 你的优势/短板
### 4. 职业规划 > 结合目标岗位方向
### 5. 薪资期望 > 目标见 profile.md > 策略：<具体> > 当前 offer 情况：<从管线提取>
### 6. 你有什么想问我们的 > 准备 3-5 个高质量反问
```

## `--readiness` 模式
只输出准备度评分表（预测话题 | 你的水平 | 目标 | 状态）+ 综合准备度 + 核心短板 + 1-2 个最高优先级 `/interview review` 命令。

## 输出文件
保存到 `data/prep/YYYY-MM-DD-<公司>-面试准备.md`。同一公司已有准备文档时，新文档命名区分轮次。
