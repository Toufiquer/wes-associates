/*
|-----------------------------------------
| setting up Mobile Bottom Menu Route for the App
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '../../../utils/mongoose';
import { handleRateLimit } from '../../../utils/rate-limit';
import { getMobileBottomMenu, updateMobileBottomMenu } from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../../../utils/is-user-has-access-by-role';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const isAccess = await isUserHasAccessByRole({ db_name: 'footer editor', access: 'read' } as IWantAccess);
      if (isAccess) return isAccess;
    }
    return NextResponse.json(await getMobileBottomMenu(), { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch mobile bottom menu settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const isAccess = await isUserHasAccessByRole({ db_name: 'footer editor', access: 'update' } as IWantAccess);
      if (isAccess) return isAccess;
    }
    const updatedSettings = await updateMobileBottomMenu(await req.json());
    revalidatePath('/');
    return NextResponse.json({ success: true, data: updatedSettings }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update mobile bottom menu settings' }, { status: 500 });
  }
}
