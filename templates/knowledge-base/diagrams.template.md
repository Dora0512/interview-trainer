# Mermaid 图库 / Diagram Bank

> 高频面试题的预验证 Mermaid 图。回答「原理」时直接嵌入。新建图遵循 `answer-norms.md`
> 的 Mermaid 语法规范。用 `/interview-coach <话题>` 可以帮你生成新图。

## 格式

### 图N：<图标题>（对应话题N）

\`\`\`mermaid
<图代码>
\`\`\`

**讲解锚点**：<看着这张图你要讲清的 2-3 个关键点>

---

## 示例（删掉换成你自己的）

### 图1：请求处理全链路（对应话题2）

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant C as 客户端
    participant GW as 网关
    participant S as 服务
    participant DB as 数据库
    C->>GW: 发起请求
    GW->>S: 路由 + 鉴权
    S->>DB: 查询
    DB-->>S: 返回数据
    S-->>GW: 组装响应
    GW-->>C: 返回结果
\`\`\`

**讲解锚点**：① 鉴权在网关层做，服务层不重复 ② 数据库访问是延迟主要来源，要讲缓存/连接池

---

## 你的图

<逐话题添加。>
