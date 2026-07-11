import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

import {
  bulkDeleteCustomerAccounts,
  bulkUpdateCustomerAccounts,
  createCustomerAccount,
  deleteCustomerAccount,
  getCustomerAccountById,
  getCustomerAccounts,
  getCustomerAccountsSummary,
  getOwnCustomerAccount,
  findCustomerAccountByMobile,
  loginCustomerAccount,
  updateCustomerAccount,
  updateOwnCustomerAccount,
} from './controller';

const CUSTOMER_ACCOUNT_COOKIE = 'customer_account_session';
const CUSTOMER_ACCOUNT_AUTO_PASSWORD_COOKIE = 'customer_account_auto_password';
const CUSTOMER_ACCOUNT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type CustomerSessionPayload = {
  email?: string;
  mobileNumber?: string;
};

type CustomerAccountCookiePayload = CustomerSessionPayload & {
  sub?: string;
};

const getCustomerAccountSecret = () => process.env.CUSTOMER_ACCOUNT_SECRET || process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'customer-account-local-secret';

const getAccountSessionPayload = (account: unknown): CustomerAccountCookiePayload => {
  const value = account as { _id?: { toString?: () => string } | string; email?: string; mobileNumber?: string };
  return {
    sub: typeof value?._id === 'string' ? value._id : value?._id?.toString?.(),
    email: value?.email,
    mobileNumber: value?.mobileNumber,
  };
};

const withCustomerCookie = (response: NextResponse, account: unknown) => {
  const payload = getAccountSessionPayload(account);
  if (!payload.email) return response;

  const token = jwt.sign(payload, getCustomerAccountSecret(), { expiresIn: '30d' });
  response.cookies.set(CUSTOMER_ACCOUNT_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: CUSTOMER_ACCOUNT_COOKIE_MAX_AGE,
  });
  return response;
};

const getCustomerCookieEmail = async () => {
  const token = (await cookies()).get(CUSTOMER_ACCOUNT_COOKIE)?.value;
  if (!token) return '';

  try {
    const payload = jwt.verify(token, getCustomerAccountSecret()) as CustomerSessionPayload;
    return payload.email || '';
  } catch {
    return '';
  }
};

const checkAdminAccess = async (access: IWantAccess['access']) => {
  if (process.env.AuthorizationEnable !== 'true') return null;
  return isUserHasAccessByRole({ db_name: 'customer-accounts', access });
};

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const url = new URL(req.url);
  const lookupMobile = url.searchParams.get('lookupMobile');
  if (lookupMobile) {
    const result = await findCustomerAccountByMobile(lookupMobile);
    return formatResponse(result.data, result.message, result.status);
  }

  const isMe = url.searchParams.get('me') === 'true';
  if (isMe) {
    const email = await getCustomerCookieEmail();
    if (!email) return formatResponse(null, 'Customer account login required', 401);
    const result = await getOwnCustomerAccount(email);
    return formatResponse(result.data, result.message, result.status);
  }

  const isAccess = await checkAdminAccess('read');
  if (isAccess) return isAccess;

  const id = url.searchParams.get('id');
  const isSummary = url.searchParams.get('summary') === 'true';
  const result: IResponse = isSummary ? await getCustomerAccountsSummary() : id ? await getCustomerAccountById(req) : await getCustomerAccounts(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const url = new URL(req.url);
  if (url.searchParams.get('logout') === 'true') {
    const response = formatResponse(null, 'Logged out successfully', 200);
    response.cookies.delete(CUSTOMER_ACCOUNT_COOKIE);
    response.cookies.delete(CUSTOMER_ACCOUNT_AUTO_PASSWORD_COOKIE);
    return response;
  }

  if (url.searchParams.get('login') === 'true') {
    const payload = await req.json();
    const result = await loginCustomerAccount(payload);
    return withCustomerCookie(formatResponse(result.data, result.message, result.status), result.data);
  }

  if (url.searchParams.get('register') === 'true') {
    const payload = await req.json();
    if (!payload.email || !payload.password || !payload.name || !payload.mobileNumber) {
      return formatResponse(null, 'Name, mobile number, email, and password are required', 400);
    }

    const result = await createCustomerAccount(new Request(req.url, { method: 'POST', headers: req.headers, body: JSON.stringify(payload) }));
    return withCustomerCookie(formatResponse(result.data, result.message, result.status), result.data);
  }

  const isAccess = await checkAdminAccess('create');
  if (isAccess) return isAccess;

  const result = await createCustomerAccount(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const url = new URL(req.url);
  if (url.searchParams.get('me') === 'true') {
    const email = await getCustomerCookieEmail();
    if (!email) return formatResponse(null, 'Customer account login required', 401);
    const result = await updateOwnCustomerAccount(email, req);
    return formatResponse(result.data, result.message, result.status);
  }

  const isAccess = await checkAdminAccess('update');
  if (isAccess) return isAccess;

  const result = url.searchParams.get('bulk') === 'true' ? await bulkUpdateCustomerAccounts(req) : await updateCustomerAccount(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const isAccess = await checkAdminAccess('delete');
  if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteCustomerAccounts(req) : await deleteCustomerAccount(req);
  return formatResponse(result.data, result.message, result.status);
}
