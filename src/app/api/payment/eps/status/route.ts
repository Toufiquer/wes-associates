import { NextResponse } from 'next/server';

import { handleRateLimit } from '@/app/api/utils/rate-limit';

import { getEpsOrderStatus } from '../service';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await getEpsOrderStatus(req);
  return NextResponse.json({ data: result.data, message: result.message, status: result.status }, { status: result.status });
}
