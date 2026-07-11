import { NextResponse } from 'next/server';

import { handleRateLimit } from '@/app/api/utils/rate-limit';

import { createEpsPayment } from '../service';

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const payload = await req.json();
    const result = await createEpsPayment(req, payload);
    return NextResponse.json({ data: result.data, message: result.message, status: result.status }, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: error instanceof Error ? error.message : 'Unable to initialize EPS payment.',
        status: 500,
      },
      { status: 500 },
    );
  }
}
