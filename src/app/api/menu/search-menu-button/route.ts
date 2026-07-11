/*
|-----------------------------------------
| setting up Search Menu Button Route for the App
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '../../utils/mongoose';
import { handleRateLimit } from '../../utils/rate-limit';
import { getSearchMenuButton, updateSearchMenuButton } from './controller';
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
    return NextResponse.json(await getSearchMenuButton(), { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch search menu button settings' }, { status: 500 });
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
    const updatedSettings = await updateSearchMenuButton(await req.json());
    revalidatePath('/');
    return NextResponse.json({ success: true, data: updatedSettings }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update search menu button settings' }, { status: 500 });
  }
}
