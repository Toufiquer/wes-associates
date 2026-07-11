import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
// import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

import {
  bulkDeleteMembers,
  bulkUpdateMembers,
  createMember,
  createMembershipUser,
  deleteMember,
  deleteMembershipUser,
  checkMemberByMobile,
  getMemberById,
  getMembers,
  getMembersSummary,
  getMembershipUsers,
  updateMember,
  updateMembershipUser,
} from './controller';

// const checkAccess = async (access: IWantAccess['access']) => {
//   if (process.env.AuthorizationEnable !== 'true') return null;
//   return isUserHasAccessByRole({ db_name: 'members', access });
// };

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const url = new URL(req.url);
  const checkMobile = url.searchParams.get('checkMobile');
  if (checkMobile) {
    const result = await checkMemberByMobile(checkMobile);
    return formatResponse(result.data, result.message, result.status);
  }

  // const isAccess = await checkAccess('read');
  // if (isAccess) return isAccess;

  const id = url.searchParams.get('id');
  const isSummary = url.searchParams.get('summary') === 'true';
  const isMembershipUsers = url.searchParams.get('membershipUsers') === 'true';
  const result: IResponse = isMembershipUsers ? await getMembershipUsers(req) : isSummary ? await getMembersSummary() : id ? await getMemberById(req) : await getMembers(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const isAccess = await checkAccess('create');
  // if (isAccess) return isAccess;

  const result = new URL(req.url).searchParams.get('membershipUsers') === 'true' ? await createMembershipUser(req) : await createMember(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const isAccess = await checkAccess('update');
  // if (isAccess) return isAccess;

  const url = new URL(req.url);
  const result = url.searchParams.get('membershipUsers') === 'true' ? await updateMembershipUser(req) : url.searchParams.get('bulk') === 'true' ? await bulkUpdateMembers(req) : await updateMember(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const isAccess = await checkAccess('delete');
  // if (isAccess) return isAccess;

  const url = new URL(req.url);
  const result = url.searchParams.get('membershipUsers') === 'true' ? await deleteMembershipUser(req) : url.searchParams.get('bulk') === 'true' ? await bulkDeleteMembers(req) : await deleteMember(req);
  return formatResponse(result.data, result.message, result.status);
}
