# 🚀 Vercel + Cloudflare 部署完整指南

> 版本：v1.0 | 日期：2026-04-15

---

## 部署架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户请求                            │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │     Cloudflare CDN       │
              │     (全球 300+ 节点)     │
              └───────────┬─────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌───────────────────┐             ┌───────────────────────┐
│   Vercel          │             │   Cloudflare Workers  │
│   (前端 Next.js)  │             │   (API + AI)          │
│                   │             │                       │
│   负责:           │             │   负责:               │
│   - 页面渲染      │             │   - AI 推理           │
│   - SSG/SSR      │             │   - 业务 API          │
│   - 静态资源      │             │   - 外部 API 代理     │
│   - Vercel CLI   │             │   - CORS 处理         │
└───────────────────┘             └───────────────────────┘
        │                                   │
        │    ┌──────────────────────────┐   │
        │    │     Neon PostgreSQL      │   │
        │    │     (共享数据库)          │   │
        │    └──────────────────────────┘   │
        │                                   │
        └───────────────┬───────────────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │   GitHub Actions     │
              │   (CI/CD 自动部署)    │
              └─────────────────────┘
```

---

## 方式一：分别部署（推荐）

### 架构说明

```
Vercel 部署：
└── src/app/            # Next.js 前端页面
└── src/app/api/        # Vercel Serverless Functions

Cloudflare Workers 部署：
└── api/                # Cloudflare Workers API
```

---

## 方式二：统一 Next.js 项目结构

```
my-ai-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页
│   │   ├── about/             # 页面
│   │   └── api/               # Vercel Serverless Functions
│   │       └── v1/            # Vercel API (部分)
│   │
│   └── workers/               # Cloudflare Workers (独立)
│       └── src/
│           ├── index.ts        # Worker 入口
│           ├── ai.ts          # AI 路由
│           └── proxy.ts       # API 代理
│
├── vercel.json                 # Vercel 配置
├── wrangler.toml              # Cloudflare Workers 配置
└── package.json
```

---

## 一、Vercel 部署前端

### 1️⃣ GitHub 关联 Vercel（最简单）

#### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 创建 GitHub 仓库
gh repo create my-ai-site --public --push
# 或
git remote add origin https://github.com/yourname/my-ai-site.git
git push -u origin main
```

#### 步骤 2: Vercel 导入项目

1. 打开 **https://vercel.com**
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 选择你的 GitHub 仓库 `my-ai-site`
5. 配置项目：

```
Framework Preset:      Next.js
Root Directory:        ./
Build Command:         npm run build
Output Directory:      .next
Install Command:       npm install
```

#### 步骤 3: 配置环境变量

在 Vercel Dashboard → **Settings** → **Environment Variables**：

```env
# 数据库
DATABASE_URL=postgresql://user:pass@host/neondb

# Clerk 认证
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx

# AI API (可选，让 Vercel 也调用)
GROQ_API_KEY=gsk_xxxx
ANTHROPIC_API_KEY=sk-ant-xxxx

# Stripe 支付
STRIPE_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
```

#### 步骤 4: Deploy

点击 **"Deploy"**，等待 1-3 分钟完成！

---

### 2️⃣ Vercel CLI 部署

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 进入项目目录
cd my-ai-site

# 4. 部署（预览）
vercel

# 5. 生产部署
vercel --prod

# 6. 查看部署状态
vercel logs my-ai-site
```

---

### 3️⃣ Vercel 配置文件

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "regions": ["iad1", "sfo1", "hnd1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "@app-url"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE" }
      ]
    }
  ]
}
```

---

## 二、Cloudflare Workers 部署 API

### 1️⃣ 初始化 Cloudflare Workers

```bash
# 1. 安装 Wrangler CLI
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login
# 会打开浏览器，点击 "Authorize" 授权

# 3. 创建 Workers 项目
wrangler generate my-ai-api
# 或在现有项目添加：
wrangler init --name my-ai-api
```

### 2️⃣ Cloudflare Workers 项目结构

```
my-ai-api/
├── src/
│   ├── index.ts          # Worker 入口
│   ├── ai.ts             # AI 路由
│   ├── proxy.ts          # API 代理
│   └── utils.ts          # 工具函数
├── wrangler.toml         # 配置文件
├── package.json
└── tsconfig.json
```

### 3️⃣ wrangler.toml 配置

```toml
# wrangler.toml
name = "my-ai-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "my-ai-api"
routes = [
  { pattern = "api.yoursite.com", zone_name = "yoursite.com" }
]

# 绑定 R2 存储（可选）
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "my-ai-assets"

# KV 命名空间（可选）
[[kv_namespaces]]
binding = "CACHE"
id = "xxxx"

# 环境变量（敏感信息放这里）
[vars]
API_VERSION = "v1"

# Secret 变量（通过 CLI 设置）
# wrangler secret put GROQ_API_KEY
# wrangler secret put ANTHROPIC_API_KEY
```

### 4️⃣ Cloudflare Workers 代码示例

#### 入口文件 `src/index.ts`

```typescript
export interface Env {
  GROQ_API_KEY: string
  ANTHROPIC_API_KEY: string
  AI: Ai
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    
    // CORS 处理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
    }

    // 路由分发
    const path = url.pathname

    if (path.startsWith('/api/ai/')) {
      return handleAI(request, env)
    }

    return new Response('Not Found', { status: 404 })
  }
}

// AI 处理函数
async function handleAI(request: Request, env: Env): Promise<Response> {
  const { prompt, model = 'llama-3.1-8b-instant' } = await request.json()

  // 调用 Groq API
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

### 5️⃣ 部署 Cloudflare Workers

```bash
# 1. 开发调试
wrangler dev
# 本地预览：http://localhost:8787

# 2. 部署到生产
wrangler deploy

# 3. 查看日志
wrangler tail

# 4. 设置 Secret 变量
wrangler secret put GROQ_API_KEY
# 输入你的 API key

wrangler secret put ANTHROPIC_API_KEY
# 输入你的 API key
```

### 6️⃣ 绑定自定义域名（可选）

```bash
# 通过 CLI
wrangler route create --pattern api.yoursite.com --zone-name yoursite.com

# 或在 Cloudflare Dashboard
# Workers & Pages → my-ai-api → Triggers → Custom Domains
```

---

## 三、GitHub Actions 自动部署

### 1️⃣ Vercel 自动部署

Vercel Dashboard 自动配置，也可以手动创建：

```yaml
# .github/workflows/vercel.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

获取 Vercel Token：
1. https://vercel.com/account/tokens
2. Create Token
3. GitHub → Settings → Secrets 添加 `VERCEL_TOKEN`

---

### 2️⃣ Cloudflare Workers 自动部署

```yaml
# .github/workflows/cloudflare.yml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Wrangler
        run: npm install -g wrangler

      - name: Deploy to Cloudflare
        run: wrangler deploy --env production
        env:
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

设置 Secrets：
1. GitHub → Settings → Secrets → Actions
2. 添加 `CLOUDFLARE_API_TOKEN`
3. 添加 `GROQ_API_KEY`
4. 添加 `ANTHROPIC_API_KEY`

获取 Cloudflare API Token：
1. https://dash.cloudflare.com/profile/api-tokens
2. Create Token → Edit Cloudflare Workers

---

## 四、统一部署脚本

### 快速部署命令

```bash
#!/bin/bash
# deploy.sh

echo "🚀 开始部署..."

# 前端部署到 Vercel
echo "📦 部署前端到 Vercel..."
vercel --prod

# API 部署到 Cloudflare
echo "📦 部署 API 到 Cloudflare Workers..."
wrangler deploy --env production

echo "✅ 部署完成！"
```

```bash
# 使用
chmod +x deploy.sh
./deploy.sh
```

---

## 五、完整 .gitignore

```gitignore
# Dependencies
node_modules/
.pnp/
.pnp.js

# Build
.next/
out/
build/
dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# Cloudflare
.wrangler/
dist/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## 六、环境变量管理

### .env.example（分享给团队）

```env
# ===================
# 数据库
# ===================
DATABASE_URL=postgresql://user:password@host/database

# ===================
# 认证 (Clerk)
# ===================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx

# ===================
# AI APIs
# ===================
GROQ_API_KEY=gsk_xxxx
ANTHROPIC_API_KEY=sk-ant-xxxx
REPLICATE_API_KEY=r8_xxxx

# ===================
# Stripe
# ===================
STRIPE_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 本地开发

```bash
cp .env.example .env.local
# 编辑 .env.local 填入真实值
```

### Vercel 环境变量

```
Vercel Dashboard → Settings → Environment Variables

名称                          值                              环境
DATABASE_URL                  postgresql://...               Production, Preview, Development
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  pk_test_...             Production, Preview, Development
CLERK_SECRET_KEY              sk_test_...                   Production, Preview, Development
```

### Cloudflare Secrets

```bash
# 设置敏感变量
wrangler secret put GROQ_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put DATABASE_URL
```

---

## 七、常见问题

### Q1: Vercel 和 Cloudflare 怎么通信？

```typescript
// Next.js 前端调用 Cloudflare Workers API
const response = await fetch('https://api.yourdomain.com/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Hello!' })
})
```

### Q2: CORS 问题？

Cloudflare Workers 设置：
```typescript
// 添加入口
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

### Q3: 域名怎么配置？

```
Cloudflare Registrar → 购买域名
    ↓
Cloudflare DNS → 添加记录
    ↓
Vercel Domain → 添加自定义域名
```

### Q4: 费用怎么控制？

```
Vercel: 100GB 带宽/月 免费，超出 $0.4/GB
Cloudflare Workers: $5/月 + $0.50/百万请求
Groq API: 免费额度用完再付费
```

### Q5: 安全补丁升级时 npm install 超时怎么办？

本地 `npm install` 超时时（网络慢），可直接修改 `package.json` 并推送到 GitHub，Vercel 会自动重新构建：

```bash
# 1. 直接编辑 package.json（不改 node_modules）
# 例如升级 Next.js：把 "next": "15.1.0" 改成 "next": "15.5.15"

# 2. 提交推送
git add package.json
git commit -m "fix: upgrade next.js to 15.5.15 (patch CVE-2025-66478)"
git push

# 3. Vercel 自动检测到新提交 → 重新部署
# 本地 node_modules 等下次有空再 npm install
```

**原理**：Vercel 的 CI 构建完全在云端进行，不依赖本地 `node_modules`。只要 `package.json` 改对，Vercel 就会用新版本构建。

---

## 八、部署清单

| 步骤 | 命令/操作 |
|------|----------|
| 1. GitHub 创建仓库 | `gh repo create` |
| 2. Vercel 导入 | Dashboard → Add Project |
| 3. Vercel 设置环境变量 | Dashboard → Settings → Env Vars |
| 4. Wrangler 初始化 | `wrangler init` |
| 5. 设置 Cloudflare Secrets | `wrangler secret put XXX` |
| 6. GitHub Actions 配置 | 创建 `.github/workflows/` |
| 7. 第一次手动部署 | `vercel --prod && wrangler deploy` |
| 8. 验证部署 | 访问 yourdomain.com |

---

## 九、一句话总结

```
Vercel 部署：
→ GitHub 关联 → 自动部署 (push 代码自动生效)

Cloudflare Workers 部署：
→ wrangler deploy (手动)
→ GitHub Actions 自动 (推荐)

CI/CD：
→ GitHub Actions → Vercel + Cloudflare Workers
```

---

**下一步：**
1. 初始化你的项目
2. 推送到 GitHub
3. 配置 Vercel 和 Cloudflare

**要我帮你执行哪一步？** 🚀
