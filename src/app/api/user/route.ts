import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/user - Get current user profile and usage
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    // Get or create user in our database
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { generations: true }
        },
        generations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            prompt: true,
            imageUrl: true,
            model: true,
            aspectRatio: true,
            createdAt: true,
            isPublic: true,
          }
        }
      }
    });

    if (!dbUser) {
      // Create user in database with free credits
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.fullName || clerkUser.firstName || null,
          image: clerkUser.imageUrl || null,
          credits: 25, // Default free credits on registration
        },
        include: {
          _count: { select: { generations: true } },
          generations: { take: 10, orderBy: { createdAt: 'desc' }, select: {
            id: true, prompt: true, imageUrl: true, model: true, aspectRatio: true, createdAt: true, isPublic: true,
          }}
        }
      });
    }

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      image: dbUser.image,
      credits: dbUser.credits,
      generationsCount: dbUser._count.generations,
      recentGenerations: dbUser.generations,
    });

  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
