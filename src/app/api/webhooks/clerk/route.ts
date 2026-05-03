import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing CLERK_WEBHOOK_SECRET' }, { status: 500 });
  }

  // Get headers
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  console.log(`Webhook received: ${eventType}`);

  // User created
  if (eventType === 'user.created') {
    const { id, email_addresses, primary_email_address_id, first_name, last_name, image_url } = data;
    const emailObj = email_addresses?.find((e: any) => e.id === primary_email_address_id);
    const email = emailObj?.email_address;

    if (email) {
      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          name: [first_name, last_name].filter(Boolean).join(' ') || null,
          image: image_url || null,
          lastLoginAt: new Date(),
        },
        create: {
          clerkId: id,
          email,
          name: [first_name, last_name].filter(Boolean).join(' ') || null,
          image: image_url || null,
          credits: 25, // Registration bonus
          lastLoginAt: new Date(),
        },
      });
      console.log(`User upserted: ${user.email} (${user.credits} credits)`);
    }
  }

  // User updated
  if (eventType === 'user.updated') {
    const { id, email_addresses, primary_email_address_id, first_name, last_name, image_url } = data;
    const emailObj = email_addresses?.find((e: any) => e.id === primary_email_address_id);
    const email = emailObj?.email_address;

    await prisma.user.updateMany({
      where: { clerkId: id },
      data: {
        email: email || undefined,
        name: [first_name, last_name].filter(Boolean).join(' ') || null,
        image: image_url || null,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
