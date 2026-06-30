# 定制

*[English](../customization.md) · [中文]*

Interview Trainer 在技术岗内领域无关。你只需编辑 `knowledge-base/` 来适配自己——不用动 skill。
最快的路径是 `/interview setup`，下面是各部分的调优方式。

## 1. 话题体系（`knowledge-base/topics.md`）

这是脊柱。模拟面试从中选题，能力画像每个话题一行，闯关和复习都以它为锚。

- 自由增删话题——没有固定数量。
- 给每个话题标**分类**（系统机制 / 架构 / 领域专项 / 算法 / 行为），模拟面试官据此平衡覆盖面。
- 在文件头标出**核心话题**——准备度（"核心达标 N/M"）只统计它们。
- 填齐每个话题的字段（掌握内容 / 能回答 / 达标判定 / 目标 L 级 / 简历关联 / STAR 引用）。越具体，
  AI 出题和评分越准。

**换领域示例**：后端候选人可能用 *并发模型、数据库内核、分布式一致性、API 设计、系统设计、故障处理*；
数据工程师可能用 *批流对比、数据建模、管线可靠性* 等。

## 2. 公司风格（`knowledge-base/company-styles/`）

内置 5 个开箱即用的 archetype：`algorithm-heavy`、`data-driven`、`stability-focused`、
`system-design`、`behavioral`。大多数真实公司是混合型。

加一家具体公司：
1. 建 `company-styles/<公司>.md`，声明继承哪个 archetype。
2. 填各轮侧重、追问风格、高频题型、核心特征。
3. 每次真实面试后，`/interview-debrief` 会把这家公司实际考的内容回填进去，画像越来越准。

`/mock-interview --company <公司>` 读这个文件；没有就用最接近的 archetype。

## 3. 方法论（`knowledge-base/methodologies.md`）

评分时引用的可复用答题框架（如答题三步法、量化数据五步法、问题侦查时间线叙事）。默认内置 3 个通用方法。
按 **何时用 / 步骤 / 反例** 格式加你自己的，这样评分时能被精确引用。

## 4. 类比、STAR 故事、图、深度追问

这些是引擎生成回答、复习卡片、诊断时取用的内容库。不用一开始全填满——`/interview-coach <话题>`
能生成内容供你粘回，`/interview-debrief`、`/mock-interview` 也会在用的过程中提示缺口。

## 5. 量化数据锁定（`profile.md`）

最重要的字段。任何回答里的量化说法都必须能追溯到**量化数据锁定区**。记下数字**以及**测量方法，
因为面试官两样都会追问。在任何地方用一个新数字前，先更新这张表。

## 6. 可选深度指南（`knowledge-base/guides/`）

如果你有长篇子系统/领域文章（如"渲染管线怎么工作"），放进 `knowledge-base/guides/*.md`。
复习和复盘会提取其中关键章节作为评分锚点。

## 不要做的事

- 不要改 skill 去硬编码你的数据——那会破坏分层、让更新失效。
- 不要把工作区（`profile.md`、`data/`、真实 STAR 故事）提交到公开仓库。放私有目录。见仓库 `.gitignore`。
