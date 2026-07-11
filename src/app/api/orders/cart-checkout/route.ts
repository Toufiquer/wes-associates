import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse } from '@/app/api/utils/jwt-verify';
import { withDB } from '@/app/api/utils/db';
import { upsertPaidCheckoutCustomerAccount } from '@/app/api/customer-accounts/v1/controller';
import { auth } from '@/lib/auth';
import User from '@/app/api/user/v1/model';
import jwt from 'jsonwebtoken';

import { createOrder } from '../v1/controller';

const CUSTOMER_ACCOUNT_COOKIE = 'customer_account_session';
const CUSTOMER_ACCOUNT_AUTO_PASSWORD_COOKIE = 'customer_account_auto_password';
const CUSTOMER_ACCOUNT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const getCustomerAccountSecret = () => process.env.CUSTOMER_ACCOUNT_SECRET || process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'customer-account-local-secret';

const getAccountSessionPayload = (account: unknown) => {
  const value = account as { _id?: { toString?: () => string } | string; email?: string; mobileNumber?: string };
  return {
    sub: typeof value?._id === 'string' ? value._id : value?._id?.toString?.(),
    email: value?.email,
    mobileNumber: value?.mobileNumber,
  };
};

const ensureBetterAuthUser = async (payload: { name?: string; email?: string; password?: string }) => {
  if (!payload.email || !payload.password) return;
  try {
    await auth.api.signUpEmail({
      body: {
        name: payload.name || payload.email,
        email: payload.email,
        password: payload.password,
      },
    });
    await withDB(async () => {
      await User.findOneAndUpdate({ email: payload.email }, { emailVerified: true });
      return { data: null, message: 'Email verified', status: 200 };
    });
  } catch {
    // Existing Better Auth users should still be able to complete checkout and sign in.
  }
};

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const payload = await req.json();
  const result = await createOrder(new Request(req.url, { method: 'POST', headers: req.headers, body: JSON.stringify(payload) }));

  let customerLogin: { email: string; password?: string } | null = null;
  let syncedAccount: unknown = null;
  if (result.status < 300 && payload.paymentStatus === 'paid' && payload.customerEmail) {
    const accountResult = await withDB(async () => {
      const account = await upsertPaidCheckoutCustomerAccount({
        name: payload.customerName,
        email: payload.customerEmail,
        mobileNumber: payload.customerPhone,
      });
      return { data: account, message: 'Customer account synced', status: 200 };
    });
    syncedAccount = (accountResult.data as { account?: unknown } | null)?.account || null;
    customerLogin = accountResult.data ? { email: (accountResult.data as { email: string; password?: string }).email, password: (accountResult.data as { email: string; password?: string }).password } : null;

    await ensureBetterAuthUser({
      name: payload.customerName,
      email: customerLogin?.email || payload.customerEmail,
      password: customerLogin?.password,
    });
  }

  const response = formatResponse({ order: result.data, customerLogin }, result.message, result.status);
  const sessionPayload = getAccountSessionPayload(syncedAccount);
  if (sessionPayload.email) {
    const token = jwt.sign(sessionPayload, getCustomerAccountSecret(), { expiresIn: '30d' });
    response.cookies.set(CUSTOMER_ACCOUNT_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: CUSTOMER_ACCOUNT_COOKIE_MAX_AGE,
    });
  }
  if (customerLogin?.password) {
    response.cookies.set(CUSTOMER_ACCOUNT_AUTO_PASSWORD_COOKIE, customerLogin.password, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: CUSTOMER_ACCOUNT_COOKIE_MAX_AGE,
    });
  }
  return response;
}
