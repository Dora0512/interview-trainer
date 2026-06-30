---
name: review-skill
description: One-shot skill review — given a topic number or name, pulls together its principle, analogy, Mermaid diagram, project example, resume link, STAR story, and mock follow-ups into a single review card.
user_invocable: true
---

# 复习技能点 Skill / One-Shot Review Card

当用户要复习某个面试技能点时，自动拉齐所有关联内容，生成一站式复习卡片。

> **语言规则**：指令用中文写，但用**用户的语言**输出复习卡片。

## 使用方式

```
/review-skill <技能编号或名称>
```

例如：`/review-skill 技能3`、`/review-skill <话题名>`、`/review-skill 协程`。

## 工作区路径

| 内容 | 路径 |
|------|------|
| 技能定义 + 简历关联 | `knowledge-base/topics.md` |
| 用户画像（简历卖点 + 量化数据锁定） | `profile.md` |
| STAR 故事库 | `knowledge-base/star-stories.md` |
| Mermaid 图库 | `knowledge-base/diagrams.md` |
| 深度追问清单 | `knowledge-base/deep-dive-questions.md` |
| 深度技能指南（如有） | `knowledge-base/guides/*.md` |
| 类比银行 | `knowledge-base/analogy-bank.md` |
| 真实面试记录 | `data/records/**/*.md` |
| 能力画像 | `data/capability-profile.md` |

## 执行步骤

1. **定位技能点**：从 `knowledge-base/topics.md` 找对应技能完整内容（掌握内容/能回答问题/达标判定/项目实践/简历关联）。
2. **拉简历原文**：从 `profile.md` 指向的简历读「简历关联」对应条目原文。
3. **拉 STAR 故事**：从 `star-stories.md` 读关联故事全文（S→T→A→R→追问准备）。
4. **拉 Mermaid 图**：从 `diagrams.md` 读关联图代码，直接嵌入。
5. **拉深度追问**：从 `deep-dive-questions.md` 找该技能对应追问列表。
6. **拉技能深度指南（如有）**：从 `knowledge-base/guides/*.md` 提取关键章节。
7. **拉真实面试失分点（如有）**：从 `data/records/**/*.md` 搜该技能相关记录，提取 哪些公司哪轮考过/当时水平/追问/答错点/发挥评估 ⚠️❌ 条目；从能力画像「真实面试验证记录」提取历史水平。

## 输出格式：一站式复习卡片

```markdown
# 复习卡片：技能 X — [技能名称]

## 一句话类比
> [从 analogy-bank.md 取对应类比]

## 核心原理（含图）
[原理要点 + 嵌入 diagrams.md 的 Mermaid 图]

## 简历原文
> [简历对应段落完整引用] 量化数据：[profile.md 锁定的数字]

## STAR 故事
[完整 STAR 故事]

## 项目实战代码
> 模块：`<模块路径>` 核心类：`<类名>` 关键设计：[模式名称]

## 面试模拟
### 面试官可能问的问题
[从 deep-dive-questions.md 列 3-5 个追问]
### 每题参考回答结构
[类比开场 → 背景 → 原理 → 工程方案 → 数据结果 → 权衡]

## 真实面试复盘
> 你在真实面试中被考到该技能的表现记录：
| 公司 | 轮次 | 日期 | 达到水平 | 面试官追问 | 你的失分点 |
|------|------|------|---------|-----------|-----------|
**重点补强**：（基于真实失分点，给最需补强的 1-2 个知识点）
> 该技能未被真实面试考过时，显示"暂无真实面试记录，建议 `/interview mock` 模拟验证"。

## 自测清单
□ 能用类比解释核心概念（30秒）
□ 能画出关键流程图（1分钟）
□ 能讲出项目实战案例 + 量化数据（2分钟）
□ 能应对 3 个以上追问
□ 简历数字能脱口而出
□ 真实面试失分点已补强（如有）
```

## 关键规则
1. **类比必须有**：从 analogy-bank.md 取，没有则新建并标注
2. **量化数字锁定**：与 `profile.md` 锁定数据一致
3. **Mermaid 图必须嵌入**：是代码块，不是链接
4. **追问至少 3 个**
5. **自测清单必须有**
6. **真实面试复盘必须有**：被考过则展示失分点和补强建议
