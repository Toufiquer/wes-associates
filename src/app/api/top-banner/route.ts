/*
|-----------------------------------------
| setting up Top Banner Route for the App
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '../utils/mongoose';
import { handleRateLimit } from '../utils/rate-limit';
import { getTopBanner, updateTopBanner } from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../utils/is-user-has-access-by-role';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const isAccess = await isUserHasAccessByRole({ db_name: 'top banner', access: 'read' } as IWantAccess);
      if (isAccess) return isAccess;
    }
    return NextResponse.json(await getTopBanner(), { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch top banner settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const isAccess = await isUserHasAccessByRole({ db_name: 'top banner', access: 'update' } as IWantAccess);
      if (isAccess) return isAccess;
    }
    const updatedSettings = await updateTopBanner(await req.json());
    revalidatePath('/');
    return NextResponse.json({ success: true, data: updatedSettings }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update top banner settings' }, { status: 500 });
  }
}
