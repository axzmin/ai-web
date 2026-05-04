import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/alerts — fetch recent alert logs (admin only)
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Simple admin check: ADMIN_CLERK_USER_IDS env var (comma-separated)
  const adminIds = process.env.ADMIN_CLERK_USER_IDS || '';
  const isAdmin = adminIds.split(',').includes(userId);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');
  const level = searchParams.get('level'); // 'critical' | 'error' | 'warning'
  const resolved = searchParams.get('resolved'); // 'true' | 'false'

  const where: Record<string, unknown> = {};
  if (level) where.level = level;
  if (resolved !== null) where.resolved = resolved === 'true';

  const [alerts, total] = await Promise.all([
    prisma.alertLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.alertLog.count({ where }),
  ]);

  return NextResponse.json({ alerts, total, limit, offset });
}

// PATCH /api/admin/alerts — mark alerts as resolved
export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminIds = (process.env.ADMIN_CLERK_USER_IDS || '').split(',');
  if (!adminIds.includes(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { ids, resolved = true } = body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids array required' }, { status: 400 });
  }

  await prisma.alertLog.updateMany({
    where: { id: { in: ids } },
    data: { resolved },
  });

  return NextResponse.json({ updated: ids.length });
}
