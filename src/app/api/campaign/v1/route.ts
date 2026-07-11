import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

import { createCampaign, deleteCampaign, getCampaignById, getCampaigns, updateCampaign } from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const campaignId = url.searchParams.get('campaignId');
  const result: IResponse = id || campaignId ? await getCampaignById(req) : await getCampaigns(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await createCampaign(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await updateCampaign(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await deleteCampaign(req);
  return formatResponse(result.data, result.message, result.status);
}
