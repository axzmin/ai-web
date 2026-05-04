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

// ─── GET /api/admin/gallery ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const adminId = await adminAuth();
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.galleryItem.findMany({
      include: {
        generation: {
          select: { id: true, prompt: true, imageUrl: true, thumbnailUrl: true, model: true, type: true, user: { select: { id: true, email: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.galleryItem.count(),
  ]);

  return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit) });
}

// ─── DELETE /api/admin/gallery ───────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const adminId = await adminAuth();
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.galleryItem.delete({ where: { id } }).catch(() => {
    throw new Error('Not found');
  });

  return NextResponse.json({ success: true });
}
