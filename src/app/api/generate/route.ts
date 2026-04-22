import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Groq Image Generation API
// https://console.groq.com/docs/image-generation

interface GroqImageRequest {
  model: string; // "black-forest-labs/FLUX.1-schnell" or "black-forest-labs/FLUX.1-dev"
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
  num_inference_steps?: number;
  prompt_strength?: number;
}

interface GroqImageResponse {
  created?: string;
  data?: Array<{ url: string; base64?: string }>;
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

const MODEL_CONFIGS = {
  'flux-schnell': {
    model: 'black-forest-labs/FLUX.1-schnell',
    steps: 4,
    width: 1024,
    height: 1024,
  },
  'flux-dev': {
    model: 'black-forest-labs/FLUX.1-dev',
    steps: 28,
    width: 1024,
    height: 1024,
  },
  'flux-pro': {
    model: 'black-forest-labs/FLUX.1-pro',
    steps: 50,
    width: 1024,
    height: 1024,
  },
};

const ASPECT_RATIOS: Record<string, { width: number; height: number }> = {
  '1:1': { width: 1024, height: 1024 },
  '3:4': { width: 768, height: 1024 },
  '4:3': { width: 1024, height: 768 },
  '16:9': { width: 1024, height: 576 },
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check and deduct credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits === null || user.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits. Please upgrade your plan.' }, { status: 402 });
    }

    // Deduct one credit
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } }
    });

    const body = await req.json();
    const { prompt, model = 'flux-schnell', aspectRatio = '1:1', quality = 'standard', seed } = body;

    if (!prompt || prompt.trim().length === 0) {
      // Refund credit if prompt is invalid
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 1 } }
      });
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const modelConfig = MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS] || MODEL_CONFIGS['flux-schnell'];
    const aspect = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['1:1'];

    // Adjust steps based on quality
    const numSteps = quality === 'hd'
      ? Math.round(modelConfig.steps * 1.5)
      : modelConfig.steps;

    const groqRequest: GroqImageRequest = {
      model: modelConfig.model,
      prompt: prompt.trim(),
      width: aspect.width,
      height: aspect.height,
      seed: seed || Math.floor(Math.random() * 2147483647),
      num_inference_steps: numSteps,
    };

    const response = await fetch('https://api.groq.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groqRequest),
    });

    const data: GroqImageResponse = await response.json();

    if (!response.ok || data.error) {
      console.error('Groq API error:', data.error);
      // Refund credit on API error
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 1 } }
      });
      return NextResponse.json(
        { error: data.error?.message || 'Image generation failed' },
        { status: 500 }
      );
    }

    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      // Refund credit if no image returned
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 1 } }
      });
      return NextResponse.json({ error: 'No image returned' }, { status: 500 });
    }

    // Save generation to database
    try {
      await prisma.generation.create({
        data: {
          userId,
          prompt: prompt.trim(),
          imageUrl,
          model,
          aspectRatio,
          quality,
          seed: groqRequest.seed,
          status: 'completed',
        },
      });
    } catch (dbError) {
      console.error('Failed to save generation:', dbError);
      // Continue anyway - we still have the image URL
    }

    return NextResponse.json({
      imageUrl,
      thumbnailUrl: imageUrl, // Groq returns the same URL, in production you'd create a thumbnail
      seed: groqRequest.seed,
      model,
      aspectRatio,
      quality,
    });

  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
