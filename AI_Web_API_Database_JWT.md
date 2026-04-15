# 🔧 API / 数据库 / JWT 完整指南

> 版本：v1.0 | 日期：2026-04-15

---

## 一、免费 AI API 提供商

### 1️⃣ Groq API（强烈推荐 ⭐⭐⭐⭐⭐）

| 项目 | 说明 |
|------|------|
| **官网** | https://console.groq.com |
| **免费额度** | 30,000 请求/分钟，14,400 tokens/分钟 |
| **支持模型** | Llama-3.1, Llama-3.2, Mixtral-8x7B, Gemma-2 |
| **速度** | **目前最快**（推理速度快） |
| **价格** | **免费**，无信用卡 |

```javascript
// Groq API 调用示例
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer gsk_xxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
})
```

---

### 2️⃣ Together AI

| 项目 | 说明 |
|------|------|
| **官网** | https://together.ai |
| **免费额度** | $5 免费额度 |
| **支持模型** | Llama-3, Mistral, Flux, FLUX.1 等 |
| **特点** | 开源模型丰富 |

---

### 3️⃣ OpenAI API

| 项目 | 说明 |
|------|------|
| **官网** | https://platform.openai.com |
| **免费额度** | $5 新用户赠送 |
| **模型** | GPT-4o, GPT-4o-mini, o1 |
| **价格** | GPT-4o: $5/1M 输入 |

```javascript
// OpenAI API
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-xxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
})
```

---

### 4️⃣ Anthropic API

| 项目 | 说明 |
|------|------|
| **官网** | https://console.anthropic.com |
| **免费额度** | $5 新用户赠送 |
| **模型** | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude Opus |
| **特点** | 长上下文，性价比高 |

---

### 5️⃣ Cohere API

| 项目 | 说明 |
|------|------|
| **官网** | https://cohere.com |
| **免费额度** | 免费 1000 API 调用/天 |
| **模型** | Command R+, Command R |
| **特点** | RAG 优化，工具调用强 |

---

### 6️⃣ Replicate API（文生图推荐）

| 项目 | 说明 |
|------|------|
| **官网** | https://replicate.com |
| **免费额度** | $5 新用户 |
| **模型** | Flux, SDXL, LoRA 训练 |
| **特点** | 图像生成最强 |

```javascript
// Replicate 文生图示例
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers': {
    'Authorization': 'Token r8_xxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    version: 'stability-ai/sdxl:...',
    input: {
      prompt: 'a beautiful sunset over ocean',
      num_inference_steps: 20
    }
  })
})
```

---

### 7️⃣ 免费 API 综合对比

| 提供商 | 免费额度 | 速度 | 推荐用途 |
|-------|---------|------|---------|
| **Groq** | ⭐⭐⭐⭐⭐ 很高 | ⭐⭐⭐⭐⭐ 最快 | 对话、文案 |
| **Together AI** | ⭐⭐⭐ $5 | ⭐⭐⭐⭐ 快 | 多模型 |
| **OpenAI** | ⭐⭐ $5 | ⭐⭐⭐⭐ 稳定 | 复杂任务 |
| **Anthropic** | ⭐⭐ $5 | ⭐⭐⭐ 稳定 | 长文本 |
| **Cohere** | ⭐⭐⭐ 1000/天 | ⭐⭐⭐ 中 | RAG/搜索 |
| **Replicate** | ⭐⭐ $5 | ⭐⭐⭐ 中 | **文生图** |

---

## 二、免费数据库推荐

### 1️⃣ PostgreSQL

| 服务 | 免费额度 | 说明 |
|------|---------|------|
| **Neon** | 3GB 存储，无限分支 | 分支功能强大 |
| **Supabase** | 500MB，2GB 备份 | 内置 Auth, Realtime |
| **Render** | 1GB，100小时/月 | PostgreSQL |
| **Railway** | $5 免费额度/月 | 方便，但限时间 |
| **ElephantSQL** | 20MB，5并发 | 轻量 |

**推荐：Neon** ⭐⭐⭐⭐⭐

```javascript
// Neon 连接示例
const { NeonQueryFunction } = require('@neondatabase/serverless')
const sql = new NeonQueryFunction(process.env.DATABASE_URL)
```

---

### 2️⃣ MySQL

| 服务 | 免费额度 | 说明 |
|------|---------|------|
| **PlanetScale** | 1GB，1亿行读/月 | Serverless MySQL |
| **TiDB** | 500MB | 分布式 |
| **FreeSQL** | 有限 | 测试用 |

---

### 3️⃣ NoSQL / 其他

| 类型 | 服务 | 免费额度 | 说明 |
|------|------|---------|------|
| **MongoDB** | MongoDB Atlas | 512MB | 文档数据库 |
| **Redis** | Upstash | 10K 命令/天 | Serverless |
| **Vector** | Pinecone | 1GB | 向量数据库（RAG） |
| **Firebase** | Spark | 1GB | BaaS |

---

### 4️⃣ 数据库选择建议

| 场景 | 推荐数据库 |
|------|-----------|
| **通用 SaaS** | Neon PostgreSQL |
| **需要向量搜索** | Neon + Pinecone |
| **需要 Auth 内置** | Supabase PostgreSQL |
| **轻度使用** | PlanetScale MySQL |

---

## 三、JWT 认证详解

### JWT 是什么？

```
JWT = JSON Web Token

组成：Header.Payload.Signature
```

### JWT 结构图解

```
┌─────────────────────────────────────────────────────────┐
│                     JWT 字符串                           │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                │
│  eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNzA...       │
│  .SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c        │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
      Header              Payload              Signature
       (算法)            (数据)             (防伪造)
```

---

### JWT 完整认证流程

#### Step 1: 用户注册

```
用户 POST /api/auth/register
{
  email: "user@example.com",
  password: "123456"
}
        │
        ▼
   密码加密 (bcrypt)
        │
        ▼
   数据库存储用户
        │
        ▼
   生成 JWT Token
        │
        ▼
   返回给用户
```

#### Step 2: 登录获取 Token

```
用户 POST /api/auth/login
{
  email: "user@example.com", 
  password: "123456"
}
        │
        ▼
   查询数据库验证密码
        │
        ▼
   ✅ 密码正确
        │
        ▼
   生成 Access Token (短期)
   {
     accessToken: "eyJhbG...",
     expiresIn: "15m"
   }
        │
        ▼
   生成 Refresh Token (长期)
   {
     refreshToken: "eyJhbG...",
     expiresIn: "7d"
   }
        │
        ▼
   返回给用户 (存到 cookie/localStorage)
```

#### Step 3: 访问受保护资源

```
用户 GET /api/user/profile
Headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIs..."
}
        │
        ▼
   验证 JWT Token
        │
        ▼
   验证签名是否正确
   (用 secret key 检查是否被篡改)
        │
        ▼
   检查是否过期
        │
        ▼
   ✅ 有效 → 提取 userId → 返回数据
   ❌ 过期 → 401 Unauthorized
```

#### Step 4: Token 过期处理

```
Access Token 过期 (15分钟后)
        │
        ▼
   前端检测到 401 错误
        │
        ▼
   用 Refresh Token 换取新 Access Token
   POST /api/auth/refresh
   {
     refreshToken: "eyJhbG..."
   }
        │
        ▼
   验证 Refresh Token
        │
        ▼
   ✅ 有效 → 生成新的 Access Token
   ❌ 过期 → 重新登录
```

---

### JWT 核心代码实现

#### 1. 安装依赖

```bash
npm install jsonwebtoken bcryptjs cookie-parser
```

#### 2. 生成 Token

```javascript
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// .env
// JWT_SECRET=your-super-secret-key-min-32-chars

// 注册
async function register(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await db.users.create({
    email,
    password: hashedPassword
  })
  
  return user
}

// 登录 - 生成 Token
function generateTokens(userId) {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }  // 短期
  )
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }  // 长期
  )
  
  return { accessToken, refreshToken }
}

// 登录接口
async function login(email, password) {
  const user = await db.users.findUnique({ email })
  
  if (!user) {
    throw new Error('User not found')
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Invalid password')
  }
  
  const tokens = generateTokens(user.id)
  
  // 保存 refreshToken 到数据库
  await db.users.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken }
  })
  
  return tokens
}
```

#### 3. 验证 Token（中间件）

```javascript
const jwt = require('jsonwebtoken')

// JWT 验证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]  // "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' })
      }
      return res.status(403).json({ error: 'Invalid token' })
    }
    
    req.user = decoded  // { userId: "123" }
    next()
  })
}

// Refresh Token 接口
async function refreshToken(req, res) {
  const { refreshToken } = req.body
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' })
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
    
    // 从数据库验证 refreshToken
    const user = await db.users.findUnique({
      where: { id: decoded.userId }
    })
    
    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' })
    }
    
    // 生成新的 Access Token
    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )
    
    res.json({ accessToken: newAccessToken })
    
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' })
  }
}
```

#### 4. 使用中间件

```javascript
// Next.js API Route
// app/api/user/profile/route.ts
import { NextResponse } from 'next/server'
import { authenticateToken } from '@/lib/auth'

export async function GET(req) {
  // 使用中间件验证
  try {
    await authenticateToken(req)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 })
  }
  
  // Token 验证通过，获取用户数据
  const user = await db.users.findUnique({
    where: { id: req.user.userId }
  })
  
  return NextResponse.json({
    id: user.id,
    email: user.email
  })
}
```

#### 5. 前端请求示例

```javascript
// 封装请求函数
class ApiClient {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken')
  }
  
  async request(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }
    
    const response = await fetch(url, { ...options, headers })
    
    // Token 过期，尝试刷新
    if (response.status === 401) {
      const data = await response.json()
      
      if (data.code === 'TOKEN_EXPIRED') {
        const refreshed = await this.refreshAccessToken()
        if (refreshed) {
          // 重试原请求
          headers['Authorization'] = `Bearer ${this.accessToken}`
          return fetch(url, { ...options, headers })
        }
      }
      
      // 刷新失败，跳转登录
      window.location.href = '/login'
    }
    
    return response
  }
  
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return false
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })
    
    if (response.ok) {
      const { accessToken } = await response.json()
      this.accessToken = accessToken
      localStorage.setItem('accessToken', accessToken)
      return true
    }
    
    return false
  }
}

const api = new ApiClient()

// 使用
const response = await api.request('/api/user/profile')
const data = await response.json()
```

---

### JWT 最佳实践

| 实践 | 说明 |
|------|------|
| ✅ Access Token 短期 | 15 分钟，防泄露 |
| ✅ Refresh Token 长期 | 7 天，方便续期 |
| ✅ Refresh Token 存数据库 | 可随时撤销 |
| ✅ HTTPS 传输 | 防止中间人攻击 |
| ✅ Token 存 HttpOnly Cookie | 防 XSS（更安全） |
| ❌ 不要存 localStorage | 易受 XSS 攻击 |
| ❌ 不要在 URL 传 Token | 会记录在日志中 |

---

## 四、完整技术栈汇总

### 最终推荐架构

```
前端
├── Next.js 15 (App Router)
├── TypeScript
├── TailwindCSS + shadcn/ui
├── Zustand (状态管理)
└── next-intl (国际化)

后端
├── Next.js API Routes
├── Prisma (ORM)
└── JWT (Auth)

数据库
├── Neon PostgreSQL (免费 3GB)
└── Redis (Upstash, 免费 10K/天)

AI API
├── Groq API (对话, 免费)
├── Replicate (文生图)
└── Claude (长文本)

部署
├── Cloudflare Pages (前端, 免费)
├── Cloudflare Workers (API, $5/月)
├── GitHub Actions (CI/CD, 免费)
└── Cloudflare R2 (文件存储, 免费 10GB)

域名 & SSL
├── Namecheap / Cloudflare Registrar
└── 自动 SSL (Cloudflare)
```

---

## 五、快速启动命令

```bash
# 1. 创建 Next.js 项目
npx create-next-app@latest my-ai-site --typescript --tailwind --app-router

# 2. 安装依赖
cd my-ai-site
npm install prisma @prisma/client jsonwebtoken bcryptjs cookie-parser
npm install @upstash/redis @neondatabase/serverless

# 3. 初始化 Prisma
npx prisma init

# 4. 配置环境变量
cat > .env << EOF
DATABASE_URL="postgresql://..."
JWT_SECRET="your-super-secret-key-at-least-32-characters"
GROQ_API_KEY="gsk_..."
EOF

# 5. GitHub 初始化
git init
git add .
git commit -m "Initial commit"
gh repo create my-ai-site --public --push

# 6. 部署到 Cloudflare
npm install -g wrangler
wrangler login
wrangler pages deploy ./out --project-name=my-ai-site
```

---

## 📋 下一步

- [ ] 确定具体技术栈
- [ ] 注册必要账号（Groq, Neon, Cloudflare）
- [ ] 开始项目初始化
- [ ] 编写核心代码

**准备好开始了吗？**
