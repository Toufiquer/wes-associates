import crypto from 'crypto';
import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import Orders from '@/app/api/orders/v1/model';

import CustomerAccount from './model';

type CustomerPayload = Record<string, unknown> & {
  name?: string;
  mobileNumber?: string;
  email?: string;
  oldPassword?: string;
  password?: string;
  photo?: { url?: string; name?: string };
  isBlocked?: boolean;
};

interface OrderItemValue {
  productId?: string;
  title?: string;
}

interface OrderValue {
  orderNo?: string;
  customerEmail?: string;
  paymentStatus?: string;
  items?: OrderItemValue[];
}

const normalizeEmail = (email?: unknown) => String(email || '').trim().toLowerCase();

const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { passwordSalt: salt, passwordHash: hash };
};

const verifyPassword = (password: string, salt?: string, storedHash?: string) => {
  if (!password || !salt || !storedHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  const hashBuffer = Buffer.from(hash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');
  return hashBuffer.length === storedBuffer.length && crypto.timingSafeEqual(hashBuffer, storedBuffer);
};

const generateLicenseKey = (email: string, productId: string, title: string, orderNo: string) =>
  crypto.createHash('sha256').update(`${email}:${productId}:${title}:${orderNo}`).digest('hex').slice(0, 16).toUpperCase();

export const generateTemporaryPassword = () => crypto.randomBytes(6).toString('hex');

const buildPayload = (payload: CustomerPayload, options: { allowEmail?: boolean } = {}) => {
  const nextPayload: Record<string, unknown> = {
    name: payload.name,
    mobileNumber: payload.mobileNumber,
    photo: payload.photo,
    isBlocked: payload.isBlocked,
  };

  if (options.allowEmail && payload.email) nextPayload.email = normalizeEmail(payload.email);
  if (payload.password) Object.assign(nextPayload, hashPassword(payload.password));

  Object.keys(nextPayload).forEach(key => {
    if (nextPayload[key] === undefined) delete nextPayload[key];
  });

  return nextPayload;
};

export async function syncCustomerLicenses(email: string) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const orders = (await Orders.find({ customerEmail: normalizedEmail, paymentStatus: 'paid' }).lean()) as OrderValue[];
  const licenseMap = new Map<string, { productId: string; productTitle: string; orderNo: string; licenseKey: string }>();

  orders.forEach(order => {
    (order.items || []).forEach(item => {
      const productId = String(item.productId || item.title || '').trim();
      const productTitle = String(item.title || 'Purchased Product').trim();
      const orderNo = String(order.orderNo || '').trim();
      if (!productId && !productTitle) return;
      const licenseKey = generateLicenseKey(normalizedEmail, productId, productTitle, orderNo);
      licenseMap.set(licenseKey, { productId, productTitle, orderNo, licenseKey });
    });
  });

  return CustomerAccount.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $setOnInsert: { email: normalizedEmail },
      $set: { licenses: Array.from(licenseMap.values()) },
    },
    { new: true, upsert: true, runValidators: true },
  );
}

export async function upsertPaidCheckoutCustomerAccount(payload: { name?: string; email?: string; mobileNumber?: string; password?: string }) {
  const email = normalizeEmail(payload.email);
  if (!email) return null;

  const existing = await CustomerAccount.findOne({ email }).select('+passwordHash');
  const password = payload.password || generateTemporaryPassword();
  const updateData: Record<string, unknown> = {
    name: payload.name,
    mobileNumber: payload.mobileNumber,
  };

  Object.keys(updateData).forEach(key => {
    if (!updateData[key]) delete updateData[key];
  });

  if (!existing?.passwordHash) Object.assign(updateData, hashPassword(password));

  const account = await CustomerAccount.findOneAndUpdate(
    { email },
    {
      $setOnInsert: { email },
      $set: updateData,
    },
    { new: true, upsert: true, runValidators: true },
  );
  await syncCustomerLicenses(email);

  return {
    account,
    email,
    password: existing?.passwordHash ? undefined : password,
  };
}

export async function createCustomerAccount(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const body = (await req.json()) as CustomerPayload;
      if (!body.email) return formatResponse(null, 'Email is required', 400);
      const created = await CustomerAccount.create(buildPayload(body, { allowEmail: true }));
      await syncCustomerLicenses(created.email);
      const account = await CustomerAccount.findById(created._id);
      return formatResponse(account, 'Customer account created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) return formatResponse(null, 'A customer account already exists for this email', 400);
      throw error;
    }
  });
}

export async function getCustomerAccountById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Customer account ID is required', 400);
    const account = await CustomerAccount.findById(id);
    if (!account) return formatResponse(null, 'Customer account not found', 404);
    await syncCustomerLicenses(account.email);
    const syncedAccount = await CustomerAccount.findById(id);
    return formatResponse(syncedAccount, 'Customer account fetched successfully', 200);
  });
}

export async function getOwnCustomerAccount(email: string): Promise<IResponse> {
  return withDB(async () => {
    const normalizedEmail = normalizeEmail(email);
    const existingAccount = await CustomerAccount.findOne({ email: normalizedEmail });
    if (!existingAccount) return formatResponse(null, 'Customer account not found', 404);
    const account = await syncCustomerLicenses(normalizedEmail);
    return formatResponse(account, 'Customer account fetched successfully', 200);
  });
}

export async function findCustomerAccountByMobile(mobileNumber: string): Promise<IResponse> {
  return withDB(async () => {
    const account = await CustomerAccount.findOne({ mobileNumber: String(mobileNumber || '').trim() });
    if (!account) return formatResponse(null, 'Customer account not found', 404);
    return formatResponse(
      {
        name: account.name,
        email: account.email,
        mobileNumber: account.mobileNumber,
      },
      'Customer account found',
      200,
    );
  });
}

export async function loginCustomerAccount(payload: { mobileNumber?: string; password?: string }): Promise<IResponse> {
  return withDB(async () => {
    const mobileNumber = String(payload.mobileNumber || '').trim();
    const password = String(payload.password || '');
    if (!mobileNumber || !password) return formatResponse(null, 'Mobile number and password are required', 400);

    const account = await CustomerAccount.findOne({ mobileNumber }).select('+passwordHash +passwordSalt');
    if (!account || !verifyPassword(password, account.passwordSalt, account.passwordHash)) {
      return formatResponse(null, 'Invalid mobile number or password', 401);
    }
    if (account.isBlocked) return formatResponse(null, 'This account is blocked. Contact support.', 403);

    await syncCustomerLicenses(account.email);
    const safeAccount = await CustomerAccount.findById(account._id);
    return formatResponse(safeAccount, 'Logged in successfully', 200);
  });
}

export async function getCustomerAccounts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const q = url.searchParams.get('q');
    const blocked = url.searchParams.get('blocked');
    const filter: FilterQuery<unknown> = {};

    if (blocked === 'true') filter.isBlocked = true;
    if (blocked === 'false') filter.isBlocked = false;

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { mobileNumber: { $regex: q, $options: 'i' } },
        { 'licenses.licenseKey': { $regex: q, $options: 'i' } },
        { 'licenses.productTitle': { $regex: q, $options: 'i' } },
      ];
    }

    const [accounts, total] = await Promise.all([
      CustomerAccount.find(filter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
      CustomerAccount.countDocuments(filter),
    ]);

    return formatResponse({ customerAccounts: accounts || [], total, page, limit }, 'Customer accounts fetched successfully', 200);
  });
}

export async function getCustomerAccountsSummary(): Promise<IResponse> {
  return withDB(async () => {
    const [totalRecords, blockedRecords, activeRecords, licenses] = await Promise.all([
      CustomerAccount.countDocuments({}),
      CustomerAccount.countDocuments({ isBlocked: true }),
      CustomerAccount.countDocuments({ isBlocked: false }),
      CustomerAccount.aggregate([{ $project: { licenseCount: { $size: { $ifNull: ['$licenses', []] } } } }, { $group: { _id: null, totalLicenses: { $sum: '$licenseCount' } } }]),
    ]);

    return formatResponse(
      {
        overall: {
          totalRecords,
          activeRecords,
          blockedRecords,
          totalLicenses: Number(licenses?.[0]?.totalLicenses || 0),
        },
      },
      'Summary fetched successfully',
      200,
    );
  });
}

export async function updateCustomerAccount(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id, ...body } = (await req.json()) as CustomerPayload & { id?: string };
    if (!id) return formatResponse(null, 'Customer account ID is required', 400);
    const updated = await CustomerAccount.findByIdAndUpdate(id, buildPayload(body, { allowEmail: true }), { new: true, runValidators: true });
    if (!updated) return formatResponse(null, 'Customer account not found', 404);
    await syncCustomerLicenses(updated.email);
    const synced = await CustomerAccount.findById(id);
    return formatResponse(synced, 'Customer account updated successfully', 200);
  });
}

export async function updateOwnCustomerAccount(email: string, req: Request): Promise<IResponse> {
  return withDB(async () => {
    const body = (await req.json()) as CustomerPayload;
    const normalizedEmail = normalizeEmail(email);
    if (body.password) {
      const account = await CustomerAccount.findOne({ email: normalizedEmail }).select('+passwordHash +passwordSalt');
      if (!account) return formatResponse(null, 'Customer account not found', 404);
      if (!verifyPassword(String(body.oldPassword || ''), account.passwordSalt, account.passwordHash)) {
        return formatResponse(null, 'Old password is incorrect', 401);
      }
    }

    const updated = await CustomerAccount.findOneAndUpdate({ email: normalizedEmail }, buildPayload(body), { new: true, upsert: true, runValidators: true });
    await syncCustomerLicenses(updated.email);
    const synced = await CustomerAccount.findById(updated._id);
    return formatResponse(synced, 'Customer account updated successfully', 200);
  });
}

export async function bulkUpdateCustomerAccounts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: CustomerPayload }[] = await req.json();
    const results = await Promise.allSettled(updates.map(({ id, updateData }) => CustomerAccount.findByIdAndUpdate(id, buildPayload(updateData, { allowEmail: true }), { new: true, runValidators: true })));
    const successfulUpdates = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value).map(r => r.value);
    const failedUpdates = results.map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null)).filter((id): id is string => id !== null);
    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

export async function deleteCustomerAccount(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deleted = await CustomerAccount.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Customer account not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Customer account deleted successfully', 200);
  });
}

export async function bulkDeleteCustomerAccounts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const result = await CustomerAccount.deleteMany({ _id: { $in: ids } });
    return formatResponse({ deleted: result.deletedCount || 0 }, 'Bulk delete operation completed', 200);
  });
}
