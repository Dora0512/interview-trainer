---
name: resume-tailor
description: Resume tailoring — given a target company's JD, generates a targeted optimized resume from your base resume. Supports match scoring, ATS keyword optimization, and STAR result rewriting, with a strict no-fabrication rule.
user_invocable: true
---

# 简历定制优化 Skill / Resume Tailor

根据目标公司 JD，对基础简历进行针对性优化，输出匹配分析报告 + 定制简历。

> **语言规则**：指令用中文写，但用**用户的语言**（与简历语言一致）输出。

## 使用方式

```
/resume-tailor <JD文本>                              # 直接粘贴职位描述
/resume-tailor --url <招聘链接>                        # 抓取招聘页面提取 JD
/resume-tailor --company <公司> --role <岗位>          # 联网搜索该公司典型 JD
/resume-tailor --list                                # 查看已生成的定制简历索引
```

可组合：`/resume-tailor --company <公司> --role <岗位> --focus <方向>`

### 参数解析规则（强制）
按优先级判断输入类型：`--list` → 索引查看；`--url` → URL 抓取；`--company` → 联网搜索；否则 → 全部参数视为 JD 文本直接解析。
**`--focus`**：可选，指定优化侧重（如 `--focus AI` 额外突出 AI 经验）。

## 工作区路径

| 内容 | 路径 |
|------|------|
| 用户画像（含基础简历路径 + 定制简历目录） | `profile.md` |
| 基础简历 | `profile.md` 的 `resume_path` 指向的文件 |
| STAR 故事库 | `knowledge-base/star-stories.md` |
| 话题/技能体系 | `knowledge-base/topics.md` |
| 公司特化策略（如有） | `knowledge-base/company-styles/*.md` |
| 定制简历索引 | `profile.md` 的 `resume_dir`/定制版 README（自动维护） |
| 面试管线 | `data/pipeline.md` |

> 简历路径和定制版输出目录都从 `profile.md` 读取，不写死。

## 核心流程（5 步，强制按顺序执行）

### Step 1：JD 解析
方式 A 直接文本；方式 B 用 WebFetch 抓 URL；方式 C 用 WebSearch 搜 `<公司> <岗位> 招聘 JD 要求`。解析输出结构化 JD 画像：

```markdown
## JD 画像
- **公司** / **岗位** / **职级推断** / **团队/业务**
### 硬性技术要求（必须匹配）
### 职责要求
### 加分项
### ATS 关键词清单
```

### Step 2：匹配度分析（百分制）
读基础简历，逐维度对比：

```markdown
## 匹配度评分报告
### 总分：XX / 100
| 维度 | 权重 | 得分 | 说明 |
| 技术栈覆盖率 | 30% | XX/30 | JD 要求 N 项，简历覆盖 M 项 |
| 经验年限匹配 | 10% | XX/10 | |
| 项目相关性 | 25% | XX/25 | |
| 关键词密度 | 15% | XX/15 | |
| 成果量化度 | 10% | XX/10 | |
| 差异化竞争力 | 10% | XX/10 | |
### 维度详细分析
#### 技术栈覆盖 | JD 要求 | 简历状态 | 匹配 |
#### 关键词覆盖 | ATS 关键词 | 简历出现 | 建议 |
```

### Step 3：优化建议报告
三栏对比（🔴 P0 必须改 / 🟡 P1 建议改 / 🟢 P2 可选）+ ATS 关键词补充清单 + STAR 成果重写建议。
**STAR 故事库联动**：读 `star-stories.md`，JD 强调的方向找对应故事关键细节，建议融入简历。

**然后使用 AskUserQuestion 询问用户**：1. 确认全部建议直接生成 / 2. 逐条确认后生成 / 3. 只看建议不生成。
等用户确认后进入 Step 4。

### Step 4：生成优化简历

**修改原则（红线，不可违反）**：
1. **不编造经历** — 只调整措辞、排序、重点，不虚构项目或技术。每条描述必须在基础简历中有出处
2. **保持量化数据一致** — 所有数字必须与基础简历 / `profile.md` 锁定数据完全一致
3. **自然融入关键词** — 不堆砌，在合适上下文自然使用
4. **突出相关性** — 按与 JD 相关度重排项目成果

**生成后校验（强制）**：逐条回溯基础简历，确认每个项目描述有原文对应、所有量化数字一致、没有简历中不存在的技术或经历。发现偏差立即修正再输出。

**调整策略**：个人优势（重写 3 条匹配 JD 最看重方向）/ 工作职责（按相关度重排）/ 核心项目成果（STAR 重写，按相关度重排，融入关键词）/ 技术栈表格（按 JD 重排，补已掌握的）。

**保存文件**：保存到 `profile.md` 的定制简历目录下，文件名含 `<公司>_<岗位>_<日期>`。

### Step 5：优化前后对比
匹配度评分变化表 + 修改清单（位置/类型/内容/理由）+ 预估 ATS 通过率。

## 公司特化策略
优先从 `knowledge-base/company-styles/<公司>.md` 读该公司简历侧重；若无，按 archetype 推断（算法深挖型→技术深度+源码；数据驱动型→ROI+数据验证；稳定性型→crash/ANR/监控；系统设计型→架构+大规模；行为面型→协作+推进）。其他公司用 WebSearch 搜技术博客/开源推断技术栈偏好。

## `--list` 模式
读定制简历目录，展示已生成简历索引表（#/公司/岗位/日期/匹配度/文件）。每次生成新简历后自动更新索引，目录 README 不存在则创建。

## 管线联动
定制简历生成后检查 `data/pipeline.md`：已在管线 → 只提示；不在管线 → 提示是否加入（`/interview apply` 或确认后写入 📝已投递 + 今天日期）。

## 输出格式
Markdown：表格对比、callout、代码块展示修改 diff。Obsidian 中使用时可用 wiki-link。
