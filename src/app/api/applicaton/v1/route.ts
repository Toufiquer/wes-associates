import { formatResponse, type IResponse } from '@/app/api/utils/jwt-verify';
import { handleRateLimit } from '@/app/api/utils/rate-limit';

import { createApplication, deleteApplication, getApplications, updateApplication } from './controller';

const respond = (result: IResponse) => formatResponse(result.data, result.message, result.status);

export async function GET(req: Request) {
  const limited = handleRateLimit(req);
  if (limited) return limited;
  return respond(await getApplications(req));
}

export async function POST(req: Request) {
  const limited = handleRateLimit(req);
  if (limited) return limited;
  return respond(await createApplication(req));
}

export async function PUT(req: Request) {
  const limited = handleRateLimit(req);
  if (limited) return limited;
  return respond(await updateApplication(req));
}

export async function DELETE(req: Request) {
  const limited = handleRateLimit(req);
  if (limited) return limited;
  return respond(await deleteApplication(req));
}
