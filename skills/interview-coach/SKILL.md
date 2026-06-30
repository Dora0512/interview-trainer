---
name: interview-coach
description: Interview coach — generates high-quality interview answers with a life analogy, Mermaid diagram, real project example, quantified results, and trade-off discussion.
user_invocable: true
---

# 面试教练 Skill / Interview Coach

当调用此 skill 时，按以下规范生成面试内容。

> **语言规则**：指令用中文写，但用**用户的语言**生成回答。

## 使用方式

```
/interview-coach <面试问题或技术主题>
```

例如：`/interview-coach 冷启动流程`、`/interview-coach 如何治理 crash 率`。

## 工作区路径
| 内容 | 路径 |
|------|------|
| 用户画像（身份/业务背景/量化数据锁定） | `profile.md` |
| 类比银行 | `knowledge-base/analogy-bank.md` |
| 答题规范（Mermaid 语法等） | `knowledge-base/answer-norms.md` |
| Mermaid 图库 | `knowledge-base/diagrams.md` |
| STAR 故事库 | `knowledge-base/star-stories.md` |
| 深度追问清单 | `knowledge-base/deep-dive-questions.md` |
| 项目知识图谱（如有） | `knowledge-base/guides/*.md` |

## 强制回答结构

每个回答必须包含以下 7 个部分：

### 1. 类比开场（必选）
用一句生活类比引入技术概念，参考 `analogy-bank.md`。没有现成的则创建一个贴近日常生活的新类比。

### 2. 背景（必选）
说明这个问题在什么业务场景下出现、为什么重要。结合 `profile.md` 中的业务背景（公司/规模/用户量）。

### 3. 原理（必选，含 Mermaid 图）
深入解释原理，必须含至少一张 Mermaid 图。优先从 `diagrams.md` 引用已验证的图。新建图严格遵循 `answer-norms.md` 的 Mermaid 语法规范（participant 用英文 ID + `as` 标签；flowchart 节点用 `["文字"]`；连线标签 `-- "文字" -->`；sequenceDiagram 加 `autonumber`）。

### 4. 工程方案（必选，含代码引用）
结合用户真实项目的代码路径和类名（来自 `profile.md` / `star-stories.md` / `knowledge-base/guides/*.md`）：

```
> **项目实战**
> 模块：`<模块路径>`
> 核心类：<类名>
> 关键设计：[模式名称]
```

### 5. 数据结果（L3+ 必选）
给出量化指标，**必须与 `profile.md` 锁定数据一致**。

### 6. 权衡（L3+ 必选）
为什么选这个方案？对比了哪些替代？有什么风险或局限？如果重来会怎么做？

### 7. 扩展（可选）
延伸到更深层追问准备，链接 `deep-dive-questions.md` 相关问题。

## 项目故事引用
涉及项目经验时，优先引用 `star-stories.md` 中标准化故事，确保 STAR 结构完整。

## 输出格式
使用 Markdown：Mermaid 代码块、代码块、表格对比、callout（`> [!tip]` / `> [!warning]`）。若用户在 Obsidian 中使用，可用 wiki-link 交叉引用。
