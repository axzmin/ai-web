import { NextRequest, NextResponse } from 'next/server';

// Replicate API configuration
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

// Flux.1 Dev model - high quality text-to-image
const FLUX_MODEL = 'black-forest-labs/flux-dev';

// Demo mode flag - when true, returns placeholder images
const DEMO_MODE = !REPLICATE_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, aspectRatio, quality, imageUrl, mode, strength } = body;

    // Validate prompt
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Demo mode - return placeholder
    if (DEMO_MODE) {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return a placeholder image from picsum
      const seed = Math.floor(Math.random() * 10000);
      const width = aspectRatio === '16:9' ? 800 : aspectRatio === '3:4' ? 600 : 700;
      const height = aspectRatio === '16:9' ? 450 : aspectRatio === '3:4' ? 800 : 700;
      
      return NextResponse.json({
        imageUrl: `https://picsum.photos/seed/${seed}/${width}/${height}`,
        prompt,
        status: 'complete',
        demo: true
      });
    }

    // Real mode - use Replicate API
    const model = mode === 'remix' && imageUrl 
      ? 'black-forest-labs/flux-dev-lora' // LoRA model for image-to-image
      : FLUX_MODEL;

    // Create prediction
    const predictionPayload = mode === 'remix' && imageUrl
      ? {
          version: 'flux-dev-lora',
          input: {
            prompt,
            image: imageUrl,
            strength: strength || 0.7,
          }
        }
      : {
          version: 'flux-dev',
          input: {
            prompt,
            aspect_ratio: aspectRatio || '1:1',
            num_inference_steps: quality === 'hd' ? 50 : 30,
          }
        };

    // Create prediction request
    const createResponse = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(predictionPayload),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('Replicate API error:', error);
      return NextResponse.json(
        { error: 'Failed to create prediction. Please try again.' },
        { status: 500 }
      );
    }

    const prediction = await createResponse.json();

    // Poll for completion
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pollResponse = await fetch(`${REPLICATE_API_URL}/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        },
      });
      
      result = await pollResponse.json();
      attempts++;
    }

    if (result.status === 'failed') {
      return NextResponse.json(
        { error: result.error || 'Generation failed. Please try again.' },
        { status: 500 }
      );
    }

    if (result.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Generation timed out. Please try again.' },
        { status: 504 }
      );
    }

    // Get the output image URL
    const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    return NextResponse.json({
      imageUrl: outputUrl,
      prompt,
      status: 'complete',
      predictionId: result.id
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint for checking prediction status
export async function GET(request: NextRequest) {
  const predictionId = request.nextUrl.searchParams.get('id');
  
  if (!predictionId) {
    return NextResponse.json(
      { error: 'Prediction ID required' },
      { status: 400 }
    );
  }

  if (!REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { status: 'demo', message: 'Running in demo mode' }
    );
  }

  try {
    const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      },
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch prediction status' },
      { status: 500 }
    );
  }
}
