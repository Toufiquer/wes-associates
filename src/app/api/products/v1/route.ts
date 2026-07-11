import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';

import {
  bulkDeleteProducts,
  bulkUpdateProducts,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsSummary,
  updateProduct,
} from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const wantToAccess: IWantAccess = {
  //   db_name: 'products',
  //   access: 'read',
  // };
  // const isAccess = await isUserHasAccessByRole(wantToAccess);
  // if (isAccess) return isAccess;

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const isSummary = url.searchParams.get('summary') === 'true';
  const result: IResponse = isSummary ? await getProductsSummary(req) : id ? await getProductById(req) : await getProducts(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'products',
    access: 'create',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const result = await createProduct(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'products',
    access: 'update',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateProducts(req) : await updateProduct(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'products',
    access: 'delete',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteProducts(req) : await deleteProduct(req);
  return formatResponse(result.data, result.message, result.status);
}
