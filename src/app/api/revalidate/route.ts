/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';

const COOLDOWN_MS = 2 * 60 * 1000;
const lastRevalidationByItem = new Map<string, number>();

type RevalidationType = 'page' | 'layout';

const isRevalidationType = (value: unknown): value is RevalidationType => value === 'page' || value === 'layout';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, secret, itemKey } = body as { path?: unknown; secret?: unknown; itemKey?: unknown; type?: unknown };
    const session = await auth.api.getSession({ headers: request.headers });
    const configuredSecret = process.env.REVALIDATION_SECRET;
    const hasValidSecret = Boolean(configuredSecret) && secret === configuredSecret;

    if (!hasValidSecret && !session?.user) {
      return NextResponse.json({ message: 'Session required' }, { status: 401 });
    }

    if (path !== undefined && (typeof path !== 'string' || !path.startsWith('/'))) {
      return NextResponse.json({ message: 'A valid absolute path is required', revalidated: false }, { status: 400 });
    }

    const revalidationType = isRevalidationType(body.type) ? body.type : undefined;
    const normalizedItemKey = typeof itemKey === 'string' && itemKey.trim() ? itemKey.trim() : undefined;
    const now = Date.now();

    if (normalizedItemKey) {
      const lastRevalidation = lastRevalidationByItem.get(normalizedItemKey) || 0;
      const retryAfterMs = COOLDOWN_MS - (now - lastRevalidation);

      if (retryAfterMs > 0) {
        return NextResponse.json(
          { message: 'Please wait before updating this item again', revalidated: false, lastRevalidatedAt: lastRevalidation, retryAfterMs },
          { status: 429 },
        );
      }
    }

    if (typeof path === 'string') {
      if (revalidationType) revalidatePath(path, revalidationType);
      else revalidatePath(path);
    } else {
      revalidatePath('/', 'layout');
    }

    if (normalizedItemKey) lastRevalidationByItem.set(normalizedItemKey, now);

    return NextResponse.json(
      {
        message: typeof path === 'string' ? `Revalidated path: ${path}` : 'Revalidated all pages',
        revalidated: true,
        lastRevalidatedAt: now,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: 'Error revalidating', revalidated: false }, { status: 500 });
  }
}
