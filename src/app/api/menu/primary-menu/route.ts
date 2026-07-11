/*
|-----------------------------------------
| setting up Primary Menu Route for the App
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '../../utils/mongoose';
import { handleRateLimit } from '../../utils/rate-limit';
import { getMenu, getPrimaryMenu, updateMenu, updatePrimaryMenu } from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const isAccess = await isUserHasAccessByRole({ db_name: 'menu editor', access: 'read' } as IWantAccess);
      if (isAccess) return isAccess;
    }
    const type = req.nextUrl.searchParams.get('type');
    if (type) return getMenu(type);
    return NextResponse.json(await getPrimaryMenu(), { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch primary menu settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const isAccess = await isUserHasAccessByRole({ db_name: 'menu editor', access: 'create' } as IWantAccess);
      if (isAccess) return isAccess;
    }
    const body = await req.json();
    if (Array.isArray(body?.items)) return updateMenu(new Request(req.url, { method: 'POST', body: JSON.stringify(body) }));
    const updatedSettings = await updatePrimaryMenu(body);
    revalidatePath('/');
    return NextResponse.json({ success: true, data: updatedSettings }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update primary menu settings' }, { status: 500 });
  }
}
