import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// kie.ai Image Generation API
// https://docs.kie.ai

// Model configurations with kie.ai model IDs and credit costs
const MODEL_CONFIGS = {
  'gpt-image-2': {
    textToImage: 'gpt-image-2-text-to-image',
    imageToImage: 'gpt-image-2-image-to-image',
    resolutions: { '1K': 6, '2K': 10, '4K': 16 },
  },
  'nano-banana-pro': {
    textToImage: 'google/nano-banana-pro',
    imageToImage: 'google/nano-banana-edit',
    resolutions: { '1K': 1, '2K': 2, '4K': 3 },
  },
  'nano-banana': {
    textToImage: 'google/nano-banana',
    imageToImage: 'google/nano-banana-edit',
    resolutions: { '1K': 1, '2K': 1, '4K': 2 },
  },
};

const ASPECT_RATIOS: Record<string, string> = {
  'auto': 'auto',
  '1:1': '1:1',
  '9:16': '9:16',
  '16:9': '16:9',
  '4:3': '4:3',
  '3:4': '3:4',
};

interface KieTaskResponse {
  code: number;
  msg?: string;
  data?: {
    taskId: string;
  };
}

interface KieTaskStatusResponse {
  code: number;
  msg?: string;
  data?: {
    taskId: string;
    state: 'waiting' | 'queuing' | 'generating' | 'success' | 'fail';
    resultJson?: string;
  };
}

// Poll for task completion with exponential backoff
async function pollForResult(
  taskId: string,
  apiKey: string,
  maxAttempts = 60,
  intervalMs = 2000
): Promise<string> {
  const startTime = Date.now();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));

    const response = await fetch(
      `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Poll attempt ${attempt + 1} failed: ${response.status}`);
      continue;
    }

    const data: KieTaskStatusResponse = await response.json();

    if (data.code !== 200) {
      console.error(`Task status error: ${data.code} - ${data.msg}`);
      throw new Error(data.msg || 'Task polling failed');
    }

    const state = data.data?.state;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (state === 'success') {
      console.log(`Task ${taskId} completed in ${elapsed}s (attempt ${attempt + 1})`);
      try {
        const resultJson = JSON.parse(data.data?.resultJson || '{}');
        console.log(`[Poll] resultJson raw:`, JSON.stringify(resultJson));
        // Try common image URL patterns
        const imageUrl = resultJson.resultUrls?.[0]
          || resultJson.image_url
          || resultJson.url
          || resultJson.output?.url
          || resultJson.outputUrl
          || resultJson.images?.[0]?.url;
        if (imageUrl) {
          return imageUrl;
        }
      } catch (e) {
        console.error(`[Poll] Parse error:`, e);
        throw new Error('Failed to parse result JSON');
      }
      throw new Error('No image URL in result');
    }

    if (state === 'fail') {
      throw new Error('Image generation failed on kie.ai');
    }

    console.log(`Task ${taskId} status: ${state} (${elapsed}s)`);

    // Exponential backoff: 2s, 4s, 6s, 8s...
    if (attempt > 2) {
      intervalMs = Math.min(intervalMs + 1000, 10000);
    }
  }

  throw new Error('Task polling timed out');
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log(`[Generate] Request started at ${new Date().toISOString()}`);

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check and deduct credits
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits === null || user.credits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' },
        { status: 402 }
      );
    }

    const body = await req.json();
    const {
      prompt,
      model = 'gpt-image-2',
      aspectRatio = '1:1',
      resolution = '1K',
      inputImageUrl,
    } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const modelConfig = MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS];
    if (!modelConfig) {
      return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }

    // Calculate credit cost based on resolution
    const creditCost = modelConfig.resolutions[resolution as keyof typeof modelConfig.resolutions] || 2;

    // Check credits but DON'T deduct yet — deduct only after successful generation
    if (user.credits < creditCost) {
      return NextResponse.json(
        { error: `Insufficient credits. This model requires ${creditCost} credits.` },
        { status: 402 }
      );
    }

    const isImageToImage = !!inputImageUrl;
    const kieModel = isImageToImage
      ? modelConfig.imageToImage
      : modelConfig.textToImage;

    // Build request body for kie.ai
    const kieInput: Record<string, unknown> = {
      prompt: prompt.trim(),
      aspect_ratio: ASPECT_RATIOS[aspectRatio] || '1:1',
      resolution: resolution || '1K',
    };

    if (isImageToImage && inputImageUrl) {
      kieInput.input_urls = [inputImageUrl];
    }

    const kieRequest: Record<string, unknown> = {
      model: kieModel,
      input: kieInput,
    };

    const apiKey = process.env.KIE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    console.log(`[Generate] Creating kie.ai task: ${kieModel}`);
    const createResponse = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kieRequest),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error(`[Generate] Task creation failed: ${createResponse.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to create generation task' }, { status: 500 });
    }

    const createData: KieTaskResponse = await createResponse.json();

    if (createData.code !== 200 || !createData.data?.taskId) {
      console.error(`[Generate] Task creation error: ${createData.code} - ${createData.msg}`);
      return NextResponse.json(
        { error: createData.msg || 'Failed to create task' },
        { status: 500 }
      );
    }

    const taskId = createData.data.taskId;
    console.log(`[Generate] Task created: ${taskId}`);

    // Poll for result
    try {
      const imageUrl = await pollForResult(taskId, apiKey);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[Generate] Task ${taskId} completed in ${elapsed}s - ${imageUrl}`);

      // Deduct credits AFTER successful generation
      await prisma.user.update({
        where: { clerkId: userId },
        data: { credits: { decrement: creditCost } },
      });

      // Save generation to database
      try {
        await prisma.generation.create({
          data: {
            userId,
            prompt: prompt.trim(),
            imageUrl,
            model,
            aspectRatio,
            quality: resolution,
            status: 'completed',
          },
        });
      } catch (dbError) {
        console.error('Failed to save generation:', dbError);
        // Continue anyway - we still have the image URL
      }

      return NextResponse.json({
        imageUrl,
        taskId,
        model,
        aspectRatio,
        resolution,
        creditsUsed: creditCost,
      });
    } catch (pollError) {
      console.error(`[Generate] Polling failed for task ${taskId}:`, pollError);
      // Credits already deducted, but we should mark this somehow
      return NextResponse.json(
        { error: pollError instanceof Error ? pollError.message : 'Generation timed out' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Generate] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
