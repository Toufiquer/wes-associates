/*
|-----------------------------------------
| setting up Cart Link Route for the App
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '../../utils/mongoose';
import { handleRateLimit } from '../../utils/rate-limit';
import { getCartLink, updateCartLink } from './controller';
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
    return NextResponse.json(await getCartLink(), { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cart link settings' }, { status: 500 });
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
    const updatedSettings = await updateCartLink(await req.json());
    revalidatePath('/');
    return NextResponse.json({ success: true, data: updatedSettings }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update cart link settings' }, { status: 500 });
  }
}
