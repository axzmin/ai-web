# AI Web - Setup Guide

## Prerequisites

- Node.js 18+
- GitHub account
- Clerk account (for authentication)
- Neon PostgreSQL account (for database)
- Groq API account (for image generation)

## Environment Setup

### 1. Clone and Install

```bash
git clone https://github.com/axzmin/ai-web.git
cd ai-web
npm install
```

### 2. Configure Environment Variables

Copy `.env.local` and fill in your credentials:

```bash
cp .env.local .env.local.local  # for your actual keys
```

Required variables:

#### Clerk Authentication
1. Go to https://dashboard.clerk.com
2. Create a new application
3. Get your API keys from the API Keys page
4. Enable Google OAuth in Social Connections
5. Configure authorized redirect URIs

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

#### Google OAuth (via Clerk)
1. In Clerk Dashboard → Social Connections → Google
2. Enable Google OAuth
3. Create OAuth credentials at https://console.cloud.google.com/
4. Add authorized redirect URI: `https://accounts.clerk.com/oauth_callback`

#### Neon PostgreSQL Database
1. Go to https://neon.tech
2. Create a new project
3. Copy your connection string

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

#### Groq API (Image Generation)
1. Go to https://console.groq.com
2. Create an account and get your API key
3. The free tier includes FLUX.1 image generation

```env
GROQ_API_KEY=gsk_...
```

### 3. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Neon
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, register)
│   ├── api/              # API routes
│   │   ├── generate/     # Image generation API
│   │   └── user/        # User profile API
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/           # React components
├── lib/
│   └── prisma.ts        # Prisma client singleton
├── middleware.ts        # Clerk route protection
└── styles/              # Global styles
```

## Tech Stack

- **Frontend**: Next.js 15, React 18
- **Auth**: Clerk (Email/Password + Google OAuth)
- **Database**: Neon PostgreSQL + Prisma ORM
- **Image API**: Groq (FLUX.1 models)
- **Deployment**: Vercel (recommended)

## API Endpoints

### POST /api/generate
Generate an image (requires auth).

Request:
```json
{
  "prompt": "A majestic dragon flying over a cyberpunk city",
  "model": "flux-schnell",
  "aspectRatio": "1:1",
  "quality": "standard",
  "seed": 12345  // optional
}
```

Response:
```json
{
  "imageUrl": "https://...",
  "seed": 12345,
  "model": "flux-schnell"
}
```

### GET /api/user
Get current user profile and recent generations (requires auth).

## Deployment

The app is configured for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

All required environment variables must be set in Vercel.
