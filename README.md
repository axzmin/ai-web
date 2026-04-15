# AI Studio - Text to Image & Image to Image

> Transform your ideas into stunning visuals with state-of-the-art AI.

![AI Studio](https://img.shields.io/badge/AI-Flux.1-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black)

## ✨ Features

- **Text to Image** - Describe your vision and watch it come to life
- **Image to Image** - Upload an image and transform it with AI
- **Flux.1 Model** - State-of-the-art image generation
- **Vercel Style** - Beautiful, minimal design inspired by Vercel
- **Responsive** - Works perfectly on mobile and desktop

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `REPLICATE_API_TOKEN` | Replicate API token for Flux.1 | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | No |
| `CLERK_SECRET_KEY` | Clerk secret key | No |

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Custom CSS
- **Database**: Neon PostgreSQL + Prisma ORM
- **AI**: Replicate (Flux.1 Dev)
- **Deployment**: Vercel
- **Authentication**: Clerk (optional)

## 📁 Project Structure

```
ai-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── generate/           # Text to Image
│   │   │   ├── page.tsx
│   │   │   └── remix/page.tsx # Image to Image
│   │   ├── gallery/           # Gallery
│   │   │   └── page.tsx
│   │   └── api/generate/      # API route
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── ParticleCanvas.tsx
│   │   └── Footer.tsx
│   └── styles/
│       └── globals.css         # Vercel design system
├── prisma/
│   └── schema.prisma
└── public/
```

## 🎨 Design System

Inspired by Vercel's design system:
- **Colors**: Black (#171717), White (#ffffff), Gray scale
- **Typography**: Geist font family
- **Shadows**: Shadow-as-border technique
- **Animations**: Particle canvas, gradient flows, smooth transitions

## 📄 License

MIT © 2026 AI Studio
