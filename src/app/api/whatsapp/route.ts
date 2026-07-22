/*
|-----------------------------------------
| setting up WhatsApp Settings Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/app/api/utils/mongoose';

import { handleRateLimit } from '../utils/rate-limit';
import { isUserHasAccessByRole, IWantAccess } from '../utils/is-user-has-access-by-role';
import { getWhatsAppSettings, updateWhatsAppSettings } from './controller';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    // The floating button is rendered for public visitors, including signed-out
    // and incognito sessions. Only writes below require dashboard authorization.
    const settings = await getWhatsAppSettings();
    return NextResponse.json(settings, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch WhatsApp settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = { db_name: 'whatsapp', access: 'create' };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }
    const body = await req.json();
    if (!body) return NextResponse.json({ error: 'Missing request body' }, { status: 400 });
    const updatedSettings = await updateWhatsAppSettings(body);
    revalidatePath('/');
    return NextResponse.json({ success: true, data: updatedSettings }, { status: 200 });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update WhatsApp settings' }, { status: 500 });
  }
}
