# 🚀 AI Web 出海站点 - 最佳技术栈方案

> 版本：v1.0 | 日期：2026-04-15 | 作者：Hermes Agent

---

## 一、完整技术栈一览

```
┌─────────────────────────────────────────────────────────────────┐
│                         前端 (Frontend)                          │
├─────────────────────────────────────────────────────────────────┤
│  Framework:    Next.js 15 (App Router)                         │
│  Language:     TypeScript 5                                     │
│  UI:           TailwindCSS + shadcn/ui                          │
│  State:        Zustand / React Query                           │
│  i18n:         next-intl (多语言)                               │
│  Animation:    Framer Motion                                    │
│  Deploy:       Vercel (免费)                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         后端 (Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│  Runtime:      Next.js API Routes / Cloudflare Workers         │
│  ORM:          Prisma                                           │
│  Auth:         Clerk (推荐) / NextAuth.js (开源)               │
│  Validation:   Zod                                              │
│  Deploy:       Cloudflare Workers ($5/月)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         数据库 (Database)                        │
├─────────────────────────────────────────────────────────────────┤
│  Primary:      Neon PostgreSQL (免费 3GB)                       │
│  Cache:        Upstash Redis (免费 10K/天)                     │
│  Vector:       Pinecone (免费 1GB) - AI/RAG 用                 │
│  Deploy:       Serverless 自动扩缩                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         AI 大模型 (AI Models)                    │
├─────────────────────────────────────────────────────────────────┤
│  对话/文案:     Groq API - Llama-3.1 (免费,最快)               │
│  高质量任务:    Anthropic - Claude 3.5 Sonnet ($3/1M)          │
│  快速预览:      Groq - Llama-3.1 8B (免费)                     │
│  文生图:        Replicate - Flux ($0.02/张)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         存储 & CDN                               │
├─────────────────────────────────────────────────────────────────┤
│  Static:       Cloudflare R2 (免费 10GB)                        │
│  CDN:          Cloudflare (全球 300+ 节点)                     │
│  Deploy:       Cloudflare Pages (免费)                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         DevOps & CI/CD                          │
├─────────────────────────────────────────────────────────────────┤
│  Code:         GitHub (免费)                                    │
│  CI/CD:        GitHub Actions (免费)                            │
│  Deploy:       Vercel + Cloudflare Workers                      │
│  Domain:       Namecheap / Cloudflare Registrar ($10/年)        │
│  SSL:          自动 (Cloudflare)                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、各层详细选型

### 1️⃣ 前端框架

| 选型 | 技术 | 理由 |
|------|------|------|
| **主框架** | Next.js 15 | React 官方推荐，SSR/SSG 最强 |
| **语言** | TypeScript | 类型安全，AI 代码必需 |
| **UI 库** | shadcn/ui + Tailwind | 好看、快速、可定制 |
| **状态管理** | Zustand | 轻量，比 Redux 简单 |
| **国际化** | next-intl | 支持多语言，出海必备 |
| **部署** | Vercel | Next.js 亲生，免费额度大 |

### 2️⃣ 后端 & API

| 选型 | 技术 | 理由 |
|------|------|------|
| **API** | Next.js API Routes | 和前端统一，够用 |
| **AI API** | Cloudflare Workers AI | 内置 Llama/Flux，省钱 |
| **AI 路由** | 自建路由层 | Groq 免费 + Claude 质量 |
| **验证** | Zod | 类型安全的参数校验 |

### 3️⃣ 数据库

| 选型 | 技术 | 理由 |
|------|------|------|
| **主数据库** | Neon PostgreSQL | 免费 3GB + 无限分支 |
| **ORM** | Prisma | 类型安全，迁移方便 |
| **缓存** | Upstash Redis | Serverless，10K/天免费 |
| **向量** | Pinecone | AI/RAG 专用，1GB 免费 |

### 4️⃣ 认证系统

| 选型 | 技术 | 理由 |
|------|------|------|
| **主方案** | Clerk | 10K MAU 免费，UI 好看 |
| **备选** | NextAuth.js | 开源免费，完全可控 |

### 5️⃣ AI 大模型

| 用途 | 推荐模型 | API | 成本 |
|------|---------|-----|------|
| **日常对话** | Llama-3.1 8B | Groq | **免费** |
| **文案生成** | Llama-3.1 8B | Groq | **免费** |
| **复杂推理** | Claude 3.5 Sonnet | Anthropic | $3/1M |
| **长文本总结** | Claude 3.5 Haiku | Anthropic | $0.80/1M |
| **文生图** | Flux Schnell | Replicate | $0.02/张 |

---

## 三、部署架构图

```
                          用户请求
                              │
                              ▼
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   Global CDN    │
                    │   (300+ 节点)   │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Vercel         │ │  Cloudflare     │ │  Cloudflare R2  │
│  (前端 Next.js) │ │  Workers AI     │ │  (文件存储)     │
│  免费 100GB/月  │ │  $5/月          │ │  免费 10GB      │
└─────────────────┘ └────────┬────────┘ └─────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌─────────┐   ┌──────────┐   ┌──────────┐
        │  Groq   │   │ Claude   │   │ Replicate│
        │ (免费)  │   │ (付费)   │   │ (按量)   │
        └─────────┘   └──────────┘   └──────────┘
                             │
                    ┌────────┴────────┐
                    │  Neon PostgreSQL│
                    │  (免费 3GB)     │
                    └─────────────────┘
```

---

## 四、成本预估

### 月度成本（1000 用户以内）

| 服务 | 方案 | 月费用 |
|------|------|--------|
| **前端** | Vercel Free | $0 |
| **API/AI** | Cloudflare Workers | $5 |
| **数据库** | Neon Free | $0 |
| **缓存** | Upstash Free | $0 |
| **向量** | Pinecone Free | $0 |
| **存储** | Cloudflare R2 | $0 |
| **域名** | .com | ~$1 |
| **AI API** | Groq (免费额度) | $0 |
| **AI API** | Claude (按量) | $10-30 |
| **AI 图** | Replicate (按量) | $5-20 |
| **总计** | | **$21-56/月** |

### 年度成本

| 项目 | 费用 |
|------|------|
| 服务器 & 服务 | $250-670/年 |
| 域名 | ~$10/年 |
| **总计** | **$260-680/年** |

---

## 五、项目结构

```
my-ai-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 认证页面
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # 用户后台
│   │   │   ├── dashboard/
│   │   │   └── settings/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── ai/
│   │   │   └── user/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # React 组件
│   │   ├── ui/                # shadcn/ui
│   │   └── ai/                # AI 相关组件
│   ├── lib/                   # 工具函数
│   │   ├── prisma.ts          # Prisma 客户端
│   │   ├── auth.ts            # 认证配置
│   │   └── ai-router.ts      # AI 路由
│   └── types/                 # TypeScript 类型
├── prisma/
│   └── schema.prisma          # 数据库模型
├── public/                    # 静态文件
├── .env.local                 # 环境变量
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 六、快速开始清单

### 第一步：注册账号（1 天）

| 账号 | 网址 | 用途 |
|------|------|------|
| GitHub | github.com | 代码托管 |
| Vercel | vercel.com | 前端部署 |
| Cloudflare | cloudflare.com | Workers + R2 |
| Neon | neon.tech | PostgreSQL |
| Groq | console.groq.com | 免费 LLM |
| Anthropic | console.anthropic.com | Claude |
| Replicate | replicate.com | 文生图 |
| Clerk | clerk.com | 认证 |
| Namecheap | namecheap.com | 域名 |

### 第二步：初始化项目（1 天）

```bash
# 1. 创建 Next.js 项目
npx create-next-app@latest my-ai-site \
  --typescript \
  --tailwind \
  --app-router \
  --src-dir

cd my-ai-site

# 2. 安装核心依赖
npm install prisma @prisma/client zod
npm install @clerk/nextjs
npm install tailwindcss postcss autoprefixer

# 3. 初始化 Prisma
npx prisma init

# 4. 初始化 Git
git init
git add .
git commit -m "Initial commit"
```

### 第三步：开发核心功能（3-7 天）

- [ ] 配置 Prisma + Neon 数据库
- [ ] 配置 Clerk 认证
- [ ] 实现 AI 对话功能
- [ ] 实现用户 Dashboard
- [ ] 配置 Stripe 支付

### 第四步：部署上线（1-2 天）

```bash
# 1. 推送到 GitHub
git remote add origin https://github.com/yourname/my-ai-site.git
git push -u origin main

# 2. 关联 Vercel
# vercel.com → Import Project → 选择 GitHub 仓库

# 3. 配置环境变量
# Vercel Dashboard → Settings → Environment Variables
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk...
CLERK_SECRET_KEY=sk...
GROQ_API_KEY=gsk_...

# 4. 购买并配置域名
# Namecheap → DNS → 指向 Vercel
```

---

## 七、关键技术点

### AI 智能路由

```typescript
// lib/ai-router.ts
const AI_ROUTER = {
  quick: { provider: 'groq', model: 'llama-3.1-8b-instant' },
  copywriting: { provider: 'groq', model: 'llama-3.1-8b-instant' },
  highQuality: { provider: 'anthropic', model: 'claude-3.5-sonnet' },
  imageGen: { provider: 'replicate', model: 'flux-schnell' }
}

async function getAIResponse(task: string, prompt: string) {
  const config = AI_ROUTER[task]
  
  if (config.provider === 'groq') {
    return await callGroq(config.model, prompt)
  } else if (config.provider === 'anthropic') {
    return await callAnthropic(config.model, prompt)
  }
}
```

### Prisma 数据模型

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  plan      String   @default("free")
  createdAt DateTime @default(now())
  
  usageLogs     UsageLog[]
  subscriptions Subscription[]
}

model UsageLog {
  id        String   @id @default(uuid())
  userId    String
  model     String
  tokens    Int
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}
```

---

## 八、推荐工具链

| 用途 | 工具 |
|------|------|
| **IDE** | VS Code + Cursor (AI 辅助) |
| **设计** | Figma |
| **图标** | Lucide React |
| **字体** | Inter + Chinese (可选) |
| **代码检查** | ESLint + Prettier |
| **错误追踪** | Sentry |
| **分析** | Plausible Analytics |
| **客服** | Crisp / Intercom |

---

## 九、一句话总结

| 层级 | 最佳选择 |
|------|---------|
| **前端** | Next.js + Vercel |
| **后端** | Next.js API + Cloudflare Workers |
| **数据库** | Neon PostgreSQL + Prisma |
| **AI 对话** | Groq (免费) + Claude (高质量) |
| **文生图** | Replicate Flux |
| **认证** | Clerk |
| **部署** | Vercel + Cloudflare |

---

## 十、下一步行动

1. ✅ 确定技术栈 → **完成**
2. ⬜ 注册必要账号 → **进行中**
3. ⬜ 初始化项目 → 待开始
4. ⬜ 开发核心功能 → 待开始
5. ⬜ 部署上线 → 待开始

---

**准备好开始了吗？我可以帮你：**
1. 初始化完整的 Next.js 项目
2. 配置 Prisma + Neon
3. 配置 Clerk 认证
4. 写 AI 对话核心代码

**选哪个？** 🚀
