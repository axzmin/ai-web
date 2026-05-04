import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function adminAuth() {
  const { userId } = await auth();
  if (!userId) return null;
  const adminIds = (process.env.ADMIN_CLERK_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!adminIds.includes(userId)) return null;
  return userId;
}

// ─── GET /api/admin/users/:id/credits ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  const adminId = await adminAuth();
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const [user, logs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, credits: true },
    }),
    prisma.creditLog.findMany({
      where: { userId },
      include: { generation: { select: { id: true, prompt: true, imageUrl: true, thumbnailUrl: true, model: true, type: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user, logs });
}
