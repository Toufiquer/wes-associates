import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { handleRateLimit } from '@/app/api/utils/rate-limit';

import { createServiceCountry, deleteServiceCountry, getServiceCountries, getServiceCountryById, updateServiceCountry } from './controller';

const respond = (result: IResponse) => formatResponse(result.data, result.message, result.status);

export async function GET(req: Request) {
  const limited = handleRateLimit(req);
  if (limited) return limited;
  const result = new URL(req.url).searchParams.get('id') ? await getServiceCountryById(req) : await getServiceCountries(req);
  return respond(result);
}

export async function POST(req: Request) {
  const limited = handleRateLimit(req);
  if (limited) return limited;
  return respond(await createServiceCountry(req));
}

export async function PUT(req: Request) {
  const limited = handleRateLimit(req);
  if (limited) return limited;
  return respond(await updateServiceCountry(req));
}

export async function DELETE(req: Request) {
  const limited = handleRateLimit(req);
  if (limited) return limited;
  return respond(await deleteServiceCountry(req));
}
