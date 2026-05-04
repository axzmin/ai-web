import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// ─── Shared auth guard ────────────────────────────────────────────────────────
async function adminAuth() {
  const { userId } = await auth();
  if (!userId) return null;
  const adminIds = (process.env.ADMIN_CLERK_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!adminIds.includes(userId)) return null;
  return userId;
}

// ─── GET /api/admin/users ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const adminId = await adminAuth();
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = Math.min(parseInt(searchParams.get('page') || '1'), 1);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const skip = (page - 1) * limit;
  const search = searchParams.get('search') || '';

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
          { clerkId: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        image: true,
        credits: true,
        createdAt: true,
        lastLoginAt: true,
        _count: { select: { generations: true, creditLogs: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) });
}

// ─── PATCH /api/admin/users ───────────────────────────────────────────────────
// Body: { userId, action: 'adjust_credits', amount: number, reason?: string }
export async function PATCH(req: NextRequest) {
  const adminId = await adminAuth();
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body || !body.userId || !body.action) {
    return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
  }

  if (body.action === 'adjust_credits') {
    const { userId, amount, reason = 'Admin adjustment' } = body;
    if (typeof amount !== 'number') {
      return NextResponse.json({ error: 'amount must be a number' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    });

    // Log the adjustment
    await prisma.creditLog.create({
      data: {
        userId,
        type: amount > 0 ? 'bonus' : 'refund',
        amount,
        balanceAfter: updated.credits,
        description: `Admin: ${reason}`,
      },
    });

    return NextResponse.json({ success: true, credits: updated.credits });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
