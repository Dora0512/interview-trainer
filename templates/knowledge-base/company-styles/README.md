# 公司风格库 / Company Style Library

模拟面试和准备计划用这里的「风格」来配置面试官人格。

## 两类文件

- **Archetype（通用原型）**：`algorithm-heavy.md`、`data-driven.md`、`stability-focused.md`、
  `system-design.md`、`behavioral.md`。开箱即用，覆盖大多数面试风格。
- **具体公司**：你为某家公司建 `<公司名>.md`，继承一个最接近的 archetype，
  然后随着真实面试复盘（`/interview-debrief`）不断补充该公司的真实考察特征。

## 怎么用

- `/mock-interview --company <公司名>` → 优先读 `<公司名>.md`，找不到就用最接近的 archetype。
- 大多数公司是几种 archetype 的**混合**。建公司文件时写清"以 X 型为主 + Y 型成分"。

## 公司文件模板

```markdown
# <公司名> 面试风格

> 继承 archetype：<algorithm-heavy / data-driven / ...>（以 X 型为主）

## 各轮侧重
- 一面：<重点 + 难度>
- 二面：<重点 + 难度>
- 三面/终面：<重点>

## 追问风格
<这家公司面试官怎么追问，引用真实复盘里的原话最好>

## 高频题型
<从真实面试记录归纳>

## 核心特征
1. <特征>
2. <特征>

## 真实考察记录（复盘自动补充）
<interview-debrief 会把该公司真实考过的话题/追问回填到这里>
```
