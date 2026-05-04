import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// POST /api/upload — upload image to Cloudflare Images, return public URL
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Please upload JPEG, PNG, WebP, or GIF.' }, { status: 400 });
    }

    // Max size: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json({ error: 'Cloudflare not configured' }, { status: 500 });
    }

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudflare Images
    // Using Cloudflare Images API v2: direct upload
    const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;

    const cfResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': file.type,
      },
      body: buffer,
    });

    if (!cfResponse.ok) {
      const errorText = await cfResponse.text();
      console.error('[Upload] Cloudflare API error:', cfResponse.status, errorText);
      return NextResponse.json({ error: 'Failed to upload image to Cloudflare' }, { status: 500 });
    }

    const cfData = await cfResponse.json();

    // Cloudflare returns: { result: { id, url, ... }, success, errors, messages }
    if (!cfData.success) {
      console.error('[Upload] Cloudflare upload failed:', cfData.errors);
      return NextResponse.json({ error: 'Cloudflare upload failed' }, { status: 500 });
    }

    const imageUrl = cfData.result.url;
    const imageId = cfData.result.id;

    return NextResponse.json({
      url: imageUrl,
      id: imageId,
    });
  } catch (error) {
    console.error('[Upload] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
