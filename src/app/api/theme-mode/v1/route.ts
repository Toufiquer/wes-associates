/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse } from '@/app/api/utils/jwt-verify';
import { getThemeMode, updateThemeMode } from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'theme mode',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }

  const result = await getThemeMode();
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'theme mode',
      access: 'update',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await updateThemeMode(req);
  return formatResponse(result.data, result.message, result.status);
}
