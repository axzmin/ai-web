import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, credits: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [logs, total] = await Promise.all([
      prisma.creditLog.findMany({
        where: { userId: dbUser.id },
        include: {
          generation: {
            select: {
              id: true,
              prompt: true,
              imageUrl: true,
              thumbnailUrl: true,
              model: true,
              type: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.creditLog.count({ where: { userId: dbUser.id } }),
    ]);

    return NextResponse.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      balance: dbUser.credits,
    });
  } catch (error) {
    console.error('[CreditLog API]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
