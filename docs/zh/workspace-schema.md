# 工作区数据规范

*[English](../workspace-schema.md) · [中文]*

本文件是工作区内所有文件、表格、记录格式的**唯一权威定义**。所有 skill 按此读写；
`web/scripts/check-workspace.ts` 校验器和 Web 看板（`web/`）也按此解析。

> 原则：Markdown 依然给人读，但**所有机器需要的事实都放在列已知的表格或记录的 YAML front-matter 里**。
> 说明文字放备注列或正文——绝不塞进状态 / 层级 / 日期单元格。

## 1. 全局约定

| 项 | 规则 |
|---|---|
| 日期 | 一律 ISO `YYYY-MM-DD`（表格、front-matter、文件名）。禁止 `01-28`、`1/28`。时间用 `HH:mm`（24 小时）。 |
| 空单元格 | `—`（全角破折号），也表示"未测 / 未到达"。 |
| 话题 ID | 取自 `knowledge-base/topics.md` 标题：`话题N` 或 `Topic N`（等价，N 为编号）。引用话题的表格/front-matter 以 ID 开头，如 `话题3 分布式`。矩阵 `#` 列 = N。 |
| 层级 | `L1`–`L5`，未测/未到达用 `—`。 |
| 表头 | 每张表的中英文别名都合法（见各表）。一个工作区统一用一种语言（`profile.md` 的 `language`）。允许在末尾加额外列，必需列不可缺。 |
| 章节标题 | 按 `##` / `###` 标题文本定位，各表规范中的中英文标题等价。 |
| "今天" | 真实当前日期。`profile.md` 可设 `as_of: YYYY-MM-DD` 冻结"今天"（示例工作区和测试用，避免过期判定随时间漂移）。 |

## 2. 文件清单

skill 读写的每个路径都必须在此登记（CI 会比对每个 skill 的「工作区路径」表）。

| 路径 | 层 | 写入方 | 用途 |
|---|---|---|---|
| `profile.md` | 配置 | setup | 身份、目标、**锁定量化数据**、简历路径 |
| `knowledge-base/topics.md` | 配置 | setup / 用户 | 话题体系 + 核心集合 + 目标 |
| `knowledge-base/analogy-bank.md` | 配置 | setup / debrief | 类比银行 |
| `knowledge-base/answer-norms.md` | 配置 | setup | 答题规范、数据一致性优先级 |
| `knowledge-base/methodologies.md` | 配置 | setup | 方法论 |
| `knowledge-base/star-stories.md` | 配置 | setup / debrief（使用回写） | STAR 故事库 |
| `knowledge-base/deep-dive-questions.md` | 配置 | 用户 / coach | 深度追问清单 |
| `knowledge-base/diagrams.md` | 配置 | 用户 / coach | Mermaid 图库 |
| `knowledge-base/hr-questions.md` | 配置 | 用户 | HR 问题（可选） |
| `knowledge-base/company-styles/*.md` | 配置 | setup / debrief | 公司 / archetype 面试官风格 |
| `knowledge-base/guides/*.md` | 配置 | 用户 | 可选专题指南 |
| `data/self-intro.md` | 数据 | 用户 / coach | 自我介绍稿（可选） |
| `data/pipeline.md` | 数据 | apply / debrief | 面试管线 |
| `data/capability-profile.md` | 数据 | mock / debrief / deep-review / analytics | 能力画像 |
| `data/analytics.md` | 数据 | analytics | 跨面试分析 |
| `data/records/<公司>/*.md` | 数据 | debrief | 真实面试记录 |
| `data/mock-records/*.md` | 数据 | mock | 模拟面试记录 |
| `data/mock-records/progress.md` | 数据 | mock | 模拟进度总览 |
| `data/prep/*.md` | 数据 | prep / apply | 准备文档 |
| `data/deep-review-records/*.md` | 数据 | deep-review | 掌握度档案 + 学程记录 |

## 3. `profile.md`

YAML front-matter（**粗体**必填）：**`name`**、**`role`**、`years`、`target`、`resume_path`、`resume_dir`、
**`language`**（`zh` | `en`）、`as_of`（可选，见 §1）、`readiness_thresholds`（可选，覆盖 §9 的 `[40, 70, 90]`）。

锁定数据表——章节 `## 量化数据锁定区` / `## Locked Metrics`：列 `指标|Metric`、`数字|Number`、`出处/项目|Project`、`怎么测量的|How it was measured`。

## 4. `knowledge-base/topics.md`

- **核心集合**——一行：`核心话题：话题1, 话题2, 话题5` 或 `Core topics: 话题1, 话题2, 话题5`。核心准备度只统计这些。
- **话题标题**——`### 话题N：<名称>` 或 `### Topic N: <name>`（全角/半角冒号均可）。
- **话题字段**——`- **<字段>**：值`。目标层级字段 `目标 L 级` / `Target`（缺省 `L3`；核心话题必须写明）。其他字段为自由文本。

## 5. `data/pipeline.md`

管线表——章节 `## 管线状态` / `## Pipeline`：

| key | 中文列 | 英文列 | 格式 |
|---|---|---|---|
| company | 公司 | Company | 文本 |
| role | 岗位 | Role | 文本 |
| stage | 当前阶段 | Stage | 自由标签（`二面完成` / `R2 done`） |
| applied | 投递日期 | Applied | `YYYY-MM-DD` |
| r1 / r2 / r3 / hr / offer | 一面 / 二面 / 三面/终面 / HR面 / Offer | R1 / R2 / R3/Final / HR / Offer | 轮次单元格 |
| status | 状态 | Status | `🟢` / `🟡` / `🔴`，可跟一个标签词（`🟢 进行中`） |
| notes | 备注 | Notes | 自由文本 |

**轮次单元格**：`—`，或 `YYYY-MM-DD` + 结果标记：`✅` 通过、`❌` 未通过、`⏳` 已约/待结果。
日期存在且标记为 `✅`、`❌` 或无标记时，该轮算**已到达**（`⏳` 不算）。

漏斗——章节 `## 漏斗统计` / `## Funnel`，恰好一行，每次写入时从表格重算：
`投递 N → 一面 N → 二面 N → 三面 N → HR N → Offer N`。投递 = 行数；其余 = 该轮已到达的行数。

更新日志——`## 更新日志`：`日期|Date`、`动作|Action`、`说明|Note`。

## 6. `data/capability-profile.md`

### 话题能力矩阵 `## 话题能力矩阵` / `## Topic matrix`

| key | 中文列 | 英文列 | 格式 |
|---|---|---|---|
| id | # | # | 话题编号 N |
| topic | 话题 | Topic | 名称 |
| current | 当前水平 | Current | 层级 |
| target | 目标 | Target | 层级 |
| last_tested | 上次测试 | Last tested | 日期或 `—` |
| trend | 趋势 | Trend | `↑` `→` `↓` `—` |
| status | 状态 | Status | 只能是 `🔲` `🟡` `🟢` `🕐` 之一 |
| note | 备注 | Note | 自由文本（子点差距写这里，**不要**写进状态列） |

状态规则：`🔲` 未测 · `🟡` 测过且当前 < 目标 · `🟢` 当前 ≥ 目标 · `🕐` 曾 `🟢` 但上次测试距今超过 **30 天**（待复测）。

### 通用能力评估 `## 通用能力评估` / `## General skills`
`能力维度|Dimension`、`当前水平|Level`（`强/中/弱/待测` 或 `strong/medium/weak/untested`）、`说明|Note`。固定 5 行：自我介绍、项目因果链表达、量化数据引用准确度、类比开场习惯、追问应对。

### 面试准备度判定 `## 面试准备度判定` / `## Readiness`
三条，每次写入按 §9 重算：
```
- 核心话题达标数：3 / 5
- 全部话题达标数：3 / 7
- 准备度：🟡 备战（60%）
```

### 真实面试验证记录 `## 真实面试验证记录`
`话题|Topic`（以话题 ID 开头）、`达到水平|Reached`、`来源|Source`（`<公司> R<n>`）、`日期|Date`、`表现备注|Note`。

### 薄弱点追踪 `## 薄弱点追踪` / `## Weak-spot tracking`
`薄弱点|Weak spot`、`话题|Topic`（话题 ID 或 `—`）、`首次出现|First seen`（日期）、`出现次数|Count`（整数）、
`最近状态|Latest status`（`🟡 待改进` / `✅ 已改善`）、`根因|Root cause`（§8 之一或 `—`）、
`来源/备注|Source/Note`（`<公司> R<n>`、`[mock-YYYY-MM-DD]`、`[deep-review-YYYY-MM-DD]`）。

### 校准追踪 `## 校准追踪` / `## Calibration`
- `### 自评 vs 教练评分`：`日期`、`来源`、`自评`、`AI 判定`、`偏差`——全部用 1-5 分制（§10），`偏差 = 自评 − AI 判定`，带符号。
- `### 模拟 vs 真实结果`：`日期`、`漂移结论`、`校准动作`。

### 更新日志 `## 更新日志`
`日期`、`来源（模拟/真实面试/深度复习）`、`更新了哪些话题`。

## 7. 记录文件（必须带 YAML front-matter）

### 真实面试 `data/records/<公司>/YYYY-MM-DD-<公司>-R<n>.md`
```yaml
---
type: real
company: 某公司
round: R2            # R1 R2 R3 HR
date: 2026-02-03
role: 资深后端
result: pass         # pass | fail | pending
topics: [话题1, 话题2, 话题3]
self_score: 3.3      # 逐题自评均值，1-5
coach_score: 3.0     # AI 判定均值，1-5
stories: [Story 1]   # 实际讲到的 STAR 故事
---
```

### 模拟面试 `data/mock-records/YYYY-MM-DD-HHmm-<风格>-mock.md`
```yaml
---
type: mock
date: 2026-02-03
time: "15:00"
style: system-design
company: 某公司      # 可选，用了 --company 时
topics: [话题6, 话题3]
score: 73            # 综合分 0-100（§11）
self_score: 80       # 盲评 0-100，可省略
top_level: L3
pass_estimate: 65    # %
---
```

### 模拟进度总览 `data/mock-records/progress.md`
表格：`日期`、`风格`、`综合分`、`话题`、`最高层级`、`薄弱点`、`变化`（相对上一行的带符号差值或 `—`）。

### 深度复习
- 掌握度档案 `data/deep-review-records/<话题N>-<简称>-mastery.md`，front-matter：`type: mastery`、`topic`、`target`、`created`、`sessions`、`minutes`；关卡表 `关`、`最高得分`、`最近得分`、`日期`、`状态`（`✅`/`🟡`/`🔲`）、`失分点`。
- 学程记录 `data/deep-review-records/<话题N>-<简称>-YYYY-MM-DD.md`，front-matter：`type: deep-review`、`topic`、`date`、`level`（整体 = 最弱关）、`scores`（关 → 1-5）。

### 准备文档 `data/prep/YYYY-MM-DD-<公司>-<轮次>-prep.md`
front-matter：`type: prep`、`company`、`round`、`date`、`readiness`（0-100）。

## 8. 根因五类

薄弱点和诊断的根因只能取其一：知识盲区（不知道）/ 深度不足（知道但到不了原理层）/ 叙事缺失（做过但讲不出细节和数据）/ 表达结构（有内容但没答到重点）/ 数据模糊（没有量化支撑）。英文：knowledge gap / shallow depth / missing narrative / structure / vague data。

## 9. 准备度公式

```
核心达标 = 状态为 🟢 或 🕐 的核心话题数
全部达标 = 状态为 🟢 或 🕐 的话题数
准备度   = round(100 × 核心达标 / 核心总数)
等级     = 🔴 起步（<40）· 🟡 备战（40–69）· 🟢 就绪（70–89）· ⭐ 冲刺（≥90）
```
`🕐` 仍计入达标（曾证明掌握），但单独提示"待复测"。`profile.md` 的 `readiness_thresholds` 可覆盖 40/70/90。

## 10. 分数换算（校准用）

校准一律用 1–5 分制：
- 0–100 → 1–5：`max(1, ceil(分数 / 20))`（73 → 4，80 → 4，81 → 5）。
- 复盘整体自评 1–10 → 1–5：`max(1, ceil(分数 / 2))`。
- `偏差 = 自评 − AI 判定`。≥3 条才下判定：均值 ≥ +1 持续高估，≤ −1 持续低估，否则校准良好。

## 11. 模拟综合分

名义权重：自我介绍 10% · 项目深挖 30% · 技术追问 30% · 跨界串联 10% · 领导力 10% · 系统设计 10%。
**未进行的阶段剔除**，其余权重按比例归一到 100%（单话题模式 = 技术追问 100%）。每阶段分 = 该阶段 5 维评分均值 × 20。

## 12. 数据一致性优先级

`真实记录 > 管线 > 能力画像 > 文档说明`。漏斗、达标数、准备度一律**从表格重算**（§5、§9），不抄旧统计块。不一致时输出数据告警，不静默改写历史。

## 13. 写入后格式自检

写入后重读刚写的内容，检查：必需列齐全、日期为 ISO、状态/层级单元格只含合法值、front-matter 必填键齐全。任何违规在最终输出的 **格式告警** 中列出。也可在插件仓库手动运行：`cd web && npm run check -- <工作区目录>`。
