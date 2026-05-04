import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/gallery — paginated list of current user's generations
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, parseInt(searchParams.get('pageSize') || '20', 10));
    const skip = (page - 1) * pageSize;

    // Get user internal id
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ generations: [], total: 0, page, pageSize, totalPages: 0 });
    }

    const [generations, total] = await Promise.all([
      prisma.generation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          prompt: true,
          imageUrl: true,
          thumbnailUrl: true,
          model: true,
          aspectRatio: true,
          quality: true,
          creditsCost: true,
          status: true,
          isPublic: true,
          type: true,
          inputImageUrl: true,
          createdAt: true,
        },
      }),
      prisma.generation.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      generations,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
