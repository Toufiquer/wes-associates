import { handleRateLimit } from '@/app/api/utils/rate-limit';
// import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

import {
  bulkDeleteOrders,
  bulkUpdateOrders,
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getOrdersSummary,
  updateOrder,
} from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const wantToAccess: IWantAccess = {
  //   db_name: 'orders',
  //   access: 'read',
  // };
  // const isAccess = await isUserHasAccessByRole(wantToAccess);
  // if (isAccess) return isAccess;

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const isSummary = url.searchParams.get('summary') === 'true';
  const result: IResponse = isSummary ? await getOrdersSummary(req) : id ? await getOrderById(req) : await getOrders(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const wantToAccess: IWantAccess = {
  //   db_name: 'orders',
  //   access: 'create',
  // };
  // const isAccess = await isUserHasAccessByRole(wantToAccess);
  // if (isAccess) return isAccess;

  const result = await createOrder(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const wantToAccess: IWantAccess = {
  //   db_name: 'orders',
  //   access: 'update',
  // };
  // const isAccess = await isUserHasAccessByRole(wantToAccess);
  // if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateOrders(req) : await updateOrder(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const wantToAccess: IWantAccess = {
  //   db_name: 'orders',
  //   access: 'delete',
  // };
  // const isAccess = await isUserHasAccessByRole(wantToAccess);
  // if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteOrders(req) : await deleteOrder(req);

  return formatResponse(result.data, result.message, result.status);
}
