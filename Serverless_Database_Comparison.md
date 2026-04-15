# ☁️ Serverless 平台对比 & 数据库选型

> 版本：v1.0 | 日期：2026-04-15

---

## 一、免费 Serverless 平台对比

### 主流平台总览

| 平台 | 网址 | 免费额度 | 计费方式 |
|------|------|---------|---------|
| **Vercel** | vercel.com | 100GB 带宽/月 | 超额计费 |
| **Cloudflare Workers** | cloudflare.com | 100K 请求/天 | 超额计费 |
| **Netlify** | netlify.com | 100GB 带宽/月 | 超额计费 |
| **Railway** | railway.app | $5 免费/月 | 按用量 |
| **Render** | render.com | 750 小时/月 | 超额计费 |
| **Supabase Edge** | supabase.com | 50K 请求/天 | 超额计费 |
| **Deno Deploy** | deno.com | 100K 请求/月 | 按 CPU 时间 |

---

## 二、Vercel vs Cloudflare Workers 深度对比

### 1️⃣ 核心定位

| 对比项 | Vercel | Cloudflare Workers |
|-------|--------|-------------------|
| **创始人** | Next.js 母公司 | CDN 公司转型 |
| **擅长** | **前端 + Full-stack** | **Edge Functions + 网络** |
| **上手难度** | ⭐ 简单 | ⭐⭐ 稍复杂 |
| **TypeScript** | 原生支持 | 原生支持 |
| **冷启动** | ~200ms | **< 5ms** |

---

### 2️⃣ 免费额度对比

| 功能 | Vercel | Cloudflare Workers |
|------|--------|-------------------|
| **带宽** | 100GB / 月 | 100K 请求 / 天 |
| **Serverless 函数** | 100K 请求 / 月 | 100K 请求 / 天 |
| **Edge Functions** | ❌ 无 | ✅ 有 |
| **部署数量** | 无限 | 无限 |
| **自定义域名** | ✅ 免费 | ✅ 免费 |
| **SSL 证书** | ✅ 自动 | ✅ 自动 |
| **中国访问** | ⚠️ 一般 | ⚠️ 一般 |

**结论：免费额度差不多，Cloudflare 按天计算更灵活**

---

### 3️⃣ 性能对比

| 指标 | Vercel | Cloudflare Workers |
|------|--------|-------------------|
| **全球节点** | 20+ | **300+** |
| **冷启动** | 200-800ms | **< 5ms** |
| **边缘计算** | ❌ | ✅ **超强** |
| **响应速度** | 快速 | **最快** |

**Winner: Cloudflare Workers**（节点多，冷启动快）

---

### 4️⃣ AI / 模型支持

| 功能 | Vercel | Cloudflare Workers |
|------|--------|-------------------|
| **AI 模型调用** | ❌ 不内置 | ✅ **Workers AI 内置** |
| **Llama/Flux 等** | 需第三方 API | ✅ 直接调用 |
| **向量数据库** | 需第三方 | ✅ 内置 vectorize |
| **AI 推理成本** | N/A | $0.000055/请求 |

**Winner: Cloudflare Workers**（AI 能力更强）

---

### 5️⃣ 开发者体验

| 方面 | Vercel | Cloudflare Workers |
|------|--------|-------------------|
| **Next.js 集成** | ⭐⭐⭐⭐⭐ 完美 | ⭐⭐⭐⭐ 良好 |
| **文档质量** | ⭐⭐⭐⭐⭐ 优秀 | ⭐⭐⭐⭐ 良好 |
| **本地调试** | ⭐⭐⭐⭐⭐ 简单 | ⭐⭐⭐⭐ 稍复杂 |
| **CLI 工具** | vercel CLI | wrangler CLI |
| **Git 集成** | ✅ 原生 | ✅ 原生 |

**Winner: Vercel**（Next.js 开发体验更好）

---

### 6️⃣ 定价对比（超出免费额度后）

| 平台 | 方案 | 价格 |
|------|------|------|
| **Vercel** | Pro | $20 / 月 / 成员 |
| **Cloudflare Workers** | Pay as you go | **$5 / 月起** |
| **Vercel** | Enterprise | 面议 |
| **Cloudflare Workers** | Enterprise | 面议 |

**Winner: Cloudflare Workers**（按用量付费，成本更低）

---

### 7️⃣ 适用场景推荐

| 场景 | 推荐平台 |
|------|---------|
| **Next.js 全栈应用** | ✅ Vercel |
| **需要 AI 能力** | ✅ Cloudflare Workers |
| **高频 API 调用** | ✅ Cloudflare Workers |
| **静态网站** | ✅ 两者皆可 |
| **复杂 SSR** | ✅ Vercel |
| **边缘计算** | ✅ Cloudflare Workers |

---

### 8️⃣ 两者结合方案（最佳实践）

```
┌─────────────────────────────────────────────────────┐
│                    最佳架构                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Vercel (前端部署)                                  │
│   └── Next.js App Router                           │
│   └── 静态页面 / SSR                                 │
│                                                     │
│   Cloudflare Workers (API + AI)                     │
│   └── API Routes (替代 Serverless Functions)        │
│   └── Workers AI (Llama, Flux)                      │
│   └── R2 Storage (文件存储)                         │
│                                                     │
│   GitHub (代码托管)                                  │
│   └── Vercel 触发部署 (git push → 自动上线)         │
│   └── Cloudflare Workers 单独部署                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**推荐架构：**
- **前端：** Vercel（Next.js 开发体验最佳）
- **AI API：** Cloudflare Workers（成本低 + AI 内置）
- **数据库：** Neon PostgreSQL
- **代码：** GitHub（两端都用 GitHub Actions）

---

## 三、数据库详细对比

### 1️⃣ PostgreSQL 系列（推荐）

| 服务 | 免费额度 | 特点 | 推荐度 |
|------|---------|------|--------|
| **Neon** | 3GB 存储，无限分支 | 分支功能强，Serverless | ⭐⭐⭐⭐⭐ |
| **Supabase** | 500MB，2GB 备份 | Auth + Realtime 内置 | ⭐⭐⭐⭐ |
| **Railway** | $5/月 | 上手简单 | ⭐⭐⭐ |
| **Render** | 1GB，100小时 | 稳定 | ⭐⭐⭐ |
| **ElephantSQL** | 20MB，5并发 | 轻量 | ⭐⭐⭐ |

**推荐：Neon** ⭐⭐⭐⭐⭐

```javascript
// Neon 特点
- Serverless PostgreSQL（自动扩缩容）
- 无限分支（开发/测试超方便）
- 3GB 免费存储
- Prisma 原生支持
```

---

### 2️⃣ MySQL 系列

| 服务 | 免费额度 | 特点 | 推荐度 |
|------|---------|------|--------|
| **PlanetScale** | 1GB，1亿行读/月 | Serverless MySQL，分支强 | ⭐⭐⭐⭐ |
| **TiDB** | 500MB | 分布式 | ⭐⭐⭐ |
| **Clever Cloud** | 30MB | 欧洲节点 | ⭐⭐⭐ |

**推荐：PlanetScale** ⭐⭐⭐⭐

---

### 3️⃣ NoSQL / 文档数据库

| 服务 | 免费额度 | 特点 | 推荐度 |
|------|---------|------|--------|
| **MongoDB Atlas** | 512MB | 最流行 | ⭐⭐⭐⭐ |
| **Firebase** | 1GB | Google 全家桶集成 | ⭐⭐⭐ |
| **Planetscale** | - | 其实不是 NoSQL | - |

---

### 4️⃣ 专用数据库

| 类型 | 服务 | 免费额度 | 用途 |
|------|------|---------|------|
| **向量数据库** | Pinecone | 1GB | AI / RAG |
| **向量数据库** | Weaviate | 1GB | AI / RAG |
| **Redis** | Upstash | 10K 命令/天 | 缓存 / 会话 |
| **Redis** | Redis Cloud | 30MB | 缓存 |
| **时序数据库** | TimescaleDB | 750MB | 监控数据 |
| **图数据库** | Neo4j Aura | 50K 节点 | 关系图谱 |

---

## 四、按场景选择数据库

### 前端 / 全栈 SaaS

```
首选：Neon PostgreSQL
├── 关系型数据最通用
├── Prisma ORM 支持好
├── 3GB 免费够用
└── 分支功能开发友好

备选：Supabase PostgreSQL
└── 如果需要内置 Auth
```

### AI 应用 / RAG

```
首选：Neon PostgreSQL + Pinecone
├── Neon 存用户/订单
├── Pinecone 存向量（AI 上下文）
└── 组合成本低

备选：Supabase + pgvector
└── 一个平台搞定
```

### 简单 MVP / 原型

```
首选：PlanetScale MySQL
├── 上手最快
├── 免费额度够用
└── Serverless 免运维
```

---

## 五、最佳数据库组合

### 场景 1: AI Writing SaaS

```
主数据库：Neon PostgreSQL (免费 3GB)
├── 用户表
├── 订阅表
├── 使用量记录表
└── 模板表

缓存：Upstash Redis (免费 10K/天)
├── 限流
├── 会话缓存
└── API 缓存

向量：Pinecone (免费 1GB)
└── RAG 知识库（如有）
```

### 场景 2: 电商 / 内容平台

```
主数据库：Neon PostgreSQL (免费 3GB)
├── 商品/内容
├── 订单
├── 用户
└── 库存

文件：Cloudflare R2 (免费 10GB)
└── 商品图片
```

### 场景 3: 轻量级应用

```
全部：Supabase (一站式)
├── PostgreSQL
├── Auth 内置
├── Realtime
├── Storage
└── Edge Functions
```

---

## 六、实际成本计算

### 月费用估算（1000 用户）

| 服务 | 免费额度 | 超出后费用 | 1000 用户预估 |
|------|---------|----------|-------------|
| **Neon** | 3GB | $4/GB | **免费** |
| **Upstash Redis** | 10K/天 | $0.2/1000 | **免费** |
| **Pinecone** | 1GB | $0.025/GB/h | **免费** |
| **Cloudflare R2** | 10GB | $0.015/GB | **免费** |
| **Vercel** | 100GB | $0.4/GB | **免费** |
| **Workers AI** | 10K/天 | $0.000055/请求 | ~$50/月* |

*取决于 AI 调用量，可结合 Groq 免费 API

---

## 七、最终推荐架构

### 成本最优方案（$0-10/月）

```
前端部署：Vercel (免费)
├── Next.js
└── 静态 + SSR

API + AI：Cloudflare Workers ($5/月)
├── API Routes
├── Workers AI (Llama, Flux)
└── R2 Storage

数据库：Neon PostgreSQL (免费)
├── Prisma ORM
└── 3GB 存储

AI 增强：Groq API (免费)
├── 对话/文案生成
└── 省钱神器

代码：GitHub
└── 关联 Vercel + Wrangler
```

### 高性能方案（$20/月）

```
前端：Vercel Pro ($20/月)
└── 无限带宽

后端：Cloudflare Workers Pro
└── 更多 AI 调用

数据库：Neon Pro ($19/月)
└── 50GB 存储
```

---

## 八、快速选择指南

```
需要内置 AI 能力？     → Cloudflare Workers
需要最好的 Next.js 体验？ → Vercel
想要最便宜的？         → Cloudflare Workers
想要最简单的？         → Supabase（一站式）
需要向量搜索？         → Pinecone / Weaviate
```

---

## 📋 总结表格

| 需求 | 推荐方案 | 理由 |
|------|---------|------|
| **Serverless** | Vercel 或 CF Workers | 两者都行 |
| **Next.js 优先** | Vercel | 开发体验最佳 |
| **AI 功能** | CF Workers | 内置 Workers AI |
| **PostgreSQL** | Neon | 免费额度大 |
| **MySQL** | PlanetScale | Serverless |
| **一站式** | Supabase | 全家桶 |
| **向量/RAG** | Pinecone | 专为 AI 设计 |
| **缓存** | Upstash Redis | Serverless |

---

**还有什么想深入了解的吗？**
