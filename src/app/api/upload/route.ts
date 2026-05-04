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

    // Upload to Cloudflare Images using multipart/form-data
    const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;

    const cfFormData = new FormData();
    cfFormData.append('file', file);

    const cfResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: cfFormData,
    });

    const cfResponseText = await cfResponse.text();
    console.log('[Upload] Cloudflare raw response:', cfResponse.status, cfResponseText.substring(0, 500));

    if (!cfResponse.ok) {
      console.error('[Upload] Cloudflare API error:', cfResponse.status, cfResponseText);
      return NextResponse.json({ error: 'Failed to upload image to Cloudflare', details: cfResponseText }, { status: 500 });
    }

    let cfData;
    try {
      cfData = JSON.parse(cfResponseText);
    } catch {
      console.error('[Upload] Failed to parse CF response as JSON:', cfResponseText.substring(0, 200));
      return NextResponse.json({ error: 'Invalid response from Cloudflare', details: cfResponseText.substring(0, 200) }, { status: 500 });
    }

    // Cloudflare returns: { result: { id, url, variants, ... }, success, errors, messages }
    if (!cfData.success) {
      console.error('[Upload] Cloudflare upload failed:', cfData.errors);
      const errorMsg = cfData.errors?.[0]?.message || cfData.errors?.[0]?.code || 'Cloudflare upload failed';
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    // Prefer result.url, fall back to variants[0]
    const imageUrl = cfData.result?.url || (cfData.result?.variants?.[0] ? cfData.result.variants[0].split('/public')[0] + '/public' : cfData.result?.variants?.[0]);
    const imageId = cfData.result?.id;
    console.log('[Upload] Image URL:', imageUrl, 'ID:', imageId);

    return NextResponse.json({
      url: imageUrl,
      id: imageId,
    });
  } catch (error) {
    console.error('[Upload] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
