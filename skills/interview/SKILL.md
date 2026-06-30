---
name: interview
description: Unified entry point for the interview training system — a smart router that drives the whole flow (apply, prep, mock, debrief, analyze, review). With no args it analyzes your current state and recommends the next best action.
user_invocable: true
---

# 面试系统统一入口 / Interview System Router

**你是面试全流程管家。** 根据用户的子命令路由到对应功能，无参数时自动分析当前状态并推荐最优下一步。

> **语言规则**：本 skill 的指令用中文写，但你必须**用用户的语言**主持对话和输出报告。用户用英文就全程英文，用中文就全程中文。
> **Language rule**: these instructions are written in Chinese, but you MUST conduct the session and write output in *the user's* language.

## 工作区约定（强制先读）

本系统的所有数据都在**当前工作目录（workspace 根）**下，使用相对路径：

| 内容 | 路径 |
|------|------|
| 用户画像（身份/目标/量化数据锁定/简历路径） | `profile.md` |
| 话题体系 | `knowledge-base/topics.md` |
| 类比银行 | `knowledge-base/analogy-bank.md` |
| 答题规范 + 数据一致性优先级 | `knowledge-base/answer-norms.md` |
| 方法论库 | `knowledge-base/methodologies.md` |
| STAR 故事库 | `knowledge-base/star-stories.md` |
| 深度追问清单 | `knowledge-base/deep-dive-questions.md` |
| Mermaid 图库 | `knowledge-base/diagrams.md` |
| 公司风格库 | `knowledge-base/company-styles/*.md` |
| 面试管线 | `data/pipeline.md` |
| 能力画像 | `data/capability-profile.md` |
| 跨面试分析 | `data/analytics.md` |
| 真实面试记录 | `data/records/<公司>/*.md` |
| 模拟记录 + 进度总览 | `data/mock-records/*.md`、`data/mock-records/progress.md` |
| 面试准备文档 | `data/prep/*.md` |
| 掌握度档案 / 单次学程记录 | `data/deep-review-records/*.md` |

### 初始化检测（每次执行前先做）

如果 `profile.md` 不存在，说明工作区还没初始化。**不要**继续执行任何子命令，直接提示：

```
看起来这个目录还没初始化为面试工作区（没找到 profile.md）。
先运行 `/interview setup` 完成一次性引导（约 5 分钟），它会创建你的画像、知识库模板和数据骨架。
```

例外：`/interview setup` 本身不需要这个检测。

## 使用方式

```
/interview                              # 智能导航 — 分析状态，推荐下一步
/interview setup                        # 一次性初始化 — 创建画像 + 知识库 + 数据骨架
/interview apply <公司> <JD文本>         # 投递 — 定制简历 + 加入管线
/interview prep <公司>                   # 准备 — 面试前针对性准备编排
/interview mock [选项]                   # 模拟 — 模拟面试练习
/interview debrief                      # 复盘 — 面试后交互式复盘
/interview review <话题>                 # 复习 — 一站式快照（review-skill）
/interview review-deep <话题>            # 复习 — 渐进式学程（deep-review）
/interview status                       # 状态 — 管线仪表盘 + 能力画像
/interview analytics                    # 分析 — 跨面试数据分析
/interview coach <问题>                  # 教练 — 生成面试回答
```

---

## 子命令路由

### 路由规则（强制）

收到 `/interview` 后，先解析子命令：

| 子命令 | 路由到 | 说明 |
|--------|--------|------|
| （无参数） | **本 Skill 智能导航** | 见下方"智能导航"章节 |
| `setup` | interview-setup Skill | 一次性引导，透传参数 |
| `apply` | resume-tailor + 管线写入 | 投递流程编排 |
| `prep` | interview-prep Skill | 透传参数 |
| `mock` | mock-interview Skill | 透传参数 |
| `debrief` | interview-debrief Skill | 透传参数 |
| `review` | review-skill Skill | 一站式快照，透传参数 |
| `review-deep` | deep-review Skill | 渐进式学程，跨会话续上，透传参数 |
| `status` | **本 Skill 状态面板** | 见下方"状态面板"章节 |
| `analytics` | **本 Skill 分析引擎** | 见下方"分析引擎"章节 |
| `coach` | interview-coach Skill | 透传参数 |

**透传规则**：子命令后的所有参数原样传递给目标 Skill。例如：
- `/interview mock 协程 --company A公司` → 执行 `/mock-interview 协程 --company A公司`
- `/interview review 技能4` → 执行 `/review-skill 技能4`
- `/interview review-deep 技能4 --company A公司` → 执行 `/deep-review 技能4 --company A公司`
- `/interview prep B公司 --hr` → 执行 `/interview-prep B公司 --hr`

---

## 智能导航（`/interview` 无参数）

### 执行前自检（强制）

生成任何状态或推荐前，先做轻量数据一致性检查（依据 `knowledge-base/answer-norms.md` 的数据一致性优先级）：

1. 统计 `data/records/**/*.md` 的实际文件数量，作为真实面试场次数。
2. 从 `data/pipeline.md` 当前表格重算总投递、进行中、等待、终止、各轮转化，不使用文档中的旧统计块。
3. 从 `data/capability-profile.md` 当前表格重算核心话题达标数、全部话题达标数、最弱话题。
4. 对比 `data/pipeline.md` 的漏斗统计和实际文件数；若不一致，在输出开头增加「数据告警」。
5. 推荐动作只能引用当前数据源中实际存在的公司、日期、状态和话题，禁止编造或沿用文档示例。

```markdown
## 数据告警（仅不一致时输出）

- 真实面试记录：目录实际 <N> 场，统计块写 <M> 场，已按实际文件数计算。
- 管线统计：表格重算为 <重算结果>，原统计块为 <旧结果>，建议更新统计块。
```

### 执行逻辑

读取所有数据源后，依次分析：

**1. 管线状态摘要**（基于当前 `data/pipeline.md` 动态生成）

```markdown
## 管线概览

| 状态 | 公司 |
|------|------|
| 🟢 进行中 | <从当前管线表格提取> |
| 🟡 等待 | <从当前管线表格提取> |
| 🔴 终止 | <从当前管线表格提取> |

漏斗：投递 <N> → 一面 <N> → 二面 <N> → HR <N> → Offer <N>
```

**2. 能力快照**（基于当前 `data/capability-profile.md` 和最新面试记录动态生成）

```markdown
## 能力快照

准备度：<等级> | 核心话题达标：<N>/<核心话题总数> | 全部话题达标：<N>/<话题总数>
最弱：<未达标且优先级最高的话题>
最近面试：<按日期倒序取最近 3 场>
```

> 核心话题总数和全部话题总数来自 `knowledge-base/topics.md`（用户定义），不写死数字。

**3. 智能推荐（核心）**（按优先级排序，最多 5 条）

```markdown
## 推荐下一步

1. **<推荐标题>** — <基于当前管线/能力画像/记录的事实依据>
   → `<可直接执行的命令>`
```

### 推荐优先级算法

按以下优先级从高到低生成推荐。同一优先级内按影响面、时间紧迫度、出现频率排序：

| 优先级 | 条件 | 推荐动作 |
|--------|------|----------|
| P0 | 近 48 小时内有面试但缺记录或复盘不完整 | `debrief --company <公司>` |
| P0 | 管线中有明确下一轮日期或备注出现"已约/明天/今天/今晚/终面/HR面" | `prep <公司>` 或 `prep <公司> --hr` |
| P1 | 进行中公司已完成二面或更高轮次 | `prep <公司> --hr` 或 `prep <公司> --round <下一轮>` |
| P1 | 核心话题未达标且最近真实面试暴露 | `review-deep <话题> --company <目标公司>` + `mock <话题> --company <目标公司>` |
| P1 | 薄弱点出现 2+ 次且最近状态不是"已改善" | `review-deep <话题>`；若只需快速回顾用 `review <话题>` |
| P2 | 等待状态超过 5 天无进展 | 提醒跟进并建议准备下一轮 |
| P2 | 最近 3 天无模拟练习且核心话题未达标 | `mock --weak` |
| P3 | 无紧急事项 | `analytics` 周度分析 / `mock` 最弱话题 |

> 每次执行必须重新读取数据源，绝不把任何示例当作永久事实。

---

## 状态面板（`/interview status`）

读取管线 + 能力画像 + 面试记录目录，输出完整仪表盘：

```markdown
# 面试全局状态 YYYY-MM-DD

## 数据健康度

| 检查项 | 结果 | 说明 |
|--------|------|------|
| 面试记录数量 | ✅/⚠️ | 目录实际 <N> 场 |
| 管线统计一致性 | ✅/⚠️ | 表格重算 vs 统计块 |
| 能力画像一致性 | ✅/⚠️ | 达标数重算 vs 判定区 |
| 待补全记录 | ✅/⚠️ | 是否存在"待补充/TODO" |

## 管线

| 公司 | 岗位 | 阶段 | 上次面试 | 下次安排 | 状态 |
|------|------|------|---------|---------|------|
| ... |

**漏斗**：投递 X → 一面 X → 二面 X → 三面 X → HR X → Offer X
**转化率**：一面→二面 X% | 二面→终面 X%

---

## 能力画像

| # | 话题 | 模拟水平 | 真实面试水平 | 目标 | 状态 |
|---|------|---------|-------------|------|------|
| ... |

**通用能力**：自我介绍 <等级> | 项目因果链 <等级> | 数据准确度 <等级> | 类比习惯 <等级> | 追问应对 <等级>

**准备度**：<等级图标> <百分比> — 核心达标 X/<核心总数>，全部达标 X/<话题总数>

---

## 薄弱点追踪

| 薄弱点 | 出现次数 | 涉及公司 | 最近状态 | 建议 |
|--------|---------|---------|---------|------|
| ... |

---

## 推荐行动
<同智能导航的推荐部分>
```

---

## 分析引擎（`/interview analytics`）

读取所有面试记录，生成跨面试分析报告：

```markdown
# 面试数据分析 YYYY-MM-DD

## 数据基线

- 真实面试记录：<按目录实际文件数> 场
- 分析时间范围：<最早记录日期> ~ <最新记录日期>
- 参与统计公司：<公司列表>
- 数据质量：<完整/存在待补充/存在统计不一致>

## 技能点热力图（基于 <总场次> 场真实面试）

| 话题 | 被问频次 | 涉及公司 | 平均表现 | 趋势 |
|------|---------|---------|---------|------|
| <话题> | <N>/<总场次> | <公司列表> | <L等级> | ↑/→/↓ |

## 公司考察偏好

| 公司 | 偏好方向 | 追问风格 | 整体难度 |
|------|---------|---------|---------|
| <公司> | <从该公司历史记录归纳> | <追问风格> | ⭐×<难度> |

## 薄弱点演进

| 薄弱点 | 首次暴露 | 出现次数 | 最近表现 | 已复习 | 改善情况 |
|--------|---------|---------|---------|--------|---------|
| <薄弱点> | <日期+公司> | <N> | <最近记录> | ✅/❌ | ✅/⚠️/❌ |

## 面试通过率趋势

| 周次 | 面试场次 | 自评均分 | 核心话题达标率 | 新暴露弱点 |
|------|---------|---------|--------------|-----------|

## 目标差距分析

当前准备度：<从能力画像重算>
目标准备度：⭐ 90%（或 profile.md 设定）

差距分析：
- 核心话题需全部达目标 L 级，当前 <N> 个未达标
- 最大风险点：<按真实面试暴露频率 + 目标差距排序>
- 最大亮点：<按通过面试认可度 + 当前等级排序>
- 未验证项：<核心话题中未测试项>

建议集中攻关顺序：
1. <话题>（<优先级>，<原因>）
2. <话题>（<优先级>，<原因>）
```

分析完成后，将结果保存到 `data/analytics.md`。

---

## `apply` 子命令（投递流程编排）

`/interview apply <公司> <JD文本>` 执行以下编排：

### Step 1：简历定制
调用 resume-tailor 的逻辑：
- 解析 JD → 匹配分析 → 生成定制简历
- 简历保存路径见 resume-tailor skill（基于 `profile.md` 的简历目录设置）

### Step 2：加入管线
在 `data/pipeline.md` 中新增一行：
- 公司、岗位（从 JD 提取）、当前阶段=📝已投递、投递日期=今天
- 状态=🟡 等待
- 重新计算并更新漏斗统计，不保留旧统计数字
- 在更新日志中追加：日期 | 投递新增 | 新增 <公司> 并重算漏斗

### Step 3：输出投递报告

```markdown
## 投递完成：<公司> - <岗位>

✅ 定制简历已生成：<简历文件路径>
✅ 已加入面试管线

匹配度：<X>%
<匹配分析摘要>

📌 下一步：
- 收到面试通知后 → `/interview prep <公司>`
- 查看管线全局 → `/interview status`
```

---

## 错误处理

- **工作区未初始化**（无 `profile.md`）：提示先运行 `/interview setup`。
- 子命令不识别：提示用法列表。
- 管线文件不存在：自动创建空管线（带表头，参照 templates）。
- 能力画像全部未测试：提示"建议先用 `/interview debrief` 回溯已有面试，或用 `/interview mock` 开始模拟"。
- 统计不一致：不静默修正用户未请求修改的历史记录；先输出数据告警，再基于实际文件和当前表格给出结果。
- 记录内容不完整：在推荐中提高该公司的复盘补全优先级。
