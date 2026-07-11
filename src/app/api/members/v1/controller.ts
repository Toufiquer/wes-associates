import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import Orders from '@/app/api/orders/v1/model';
import CustomerAccount from '@/app/api/customer-accounts/v1/model';

import Member from './model';

type MemberPayload = {
  title?: string;
  description?: string;
  realPrice?: number | string;
  discountPrice?: number | string;
  endDiscount?: string | Date | null;
  productIds?: string[];
};

type MembershipUserPayload = {
  orderId?: string;
  accountId?: string;
  email?: string;
  mobileNumber?: string;
  name?: string;
  membershipIds?: string[];
};

const toNumber = (value: unknown) => {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : 0;
};

const buildPayload = (payload: MemberPayload) => {
  const nextPayload: Record<string, unknown> = {
    title: payload.title,
    description: payload.description,
    realPrice: toNumber(payload.realPrice),
    discountPrice: toNumber(payload.discountPrice),
    endDiscount: payload.endDiscount ? new Date(payload.endDiscount) : null,
    productIds: Array.isArray(payload.productIds) ? payload.productIds.filter(Boolean) : [],
  };

  Object.keys(nextPayload).forEach(key => {
    if (nextPayload[key] === undefined) delete nextPayload[key];
  });

  return nextPayload;
};

const membershipOrderFilter = {
  paymentStatus: 'paid',
  $or: [
    { 'items.productId': { $regex: '^membership:' } },
    { 'items.title': { $regex: 'membership', $options: 'i' } },
    { note: { $regex: 'membership', $options: 'i' } },
  ],
};

const getMembershipItems = (plans: Array<{ _id?: unknown; title?: string; discountPrice?: number; realPrice?: number }>) =>
  plans.map(plan => {
    const id = String(plan._id || plan.title || '').trim();
    return {
      productId: `membership:${id}`,
      title: `Membership - ${plan.title || 'Untitled plan'}`,
      quantity: 1,
      price: Number(plan.discountPrice) || Number(plan.realPrice) || 0,
    };
  });

const getPlanIdFromOrderItem = (item: { productId?: string }) => String(item.productId || '').replace(/^membership:/, '');

const getMembershipPlansByIds = async (ids?: string[]) => {
  const planIds = (ids || []).filter(Boolean);
  if (!planIds.length) return [];
  return Member.find({ _id: { $in: planIds } });
};

const buildMembershipUserResponse = async (orders: Array<Record<string, unknown>>, total: number, page: number, limit: number) => {
  const emails = orders.map(order => String(order.customerEmail || '').toLowerCase()).filter(Boolean);
  const phones = orders.map(order => String(order.customerPhone || '')).filter(Boolean);
  const accounts = await CustomerAccount.find({
    $or: [{ email: { $in: emails } }, { mobileNumber: { $in: phones } }],
  }).lean();
  const accountByEmail = new Map(accounts.map(account => [String(account.email || '').toLowerCase(), account]));
  const accountByPhone = new Map(accounts.map(account => [String(account.mobileNumber || ''), account]));

  const membershipUsers = orders.map(order => {
    const items = ((order.items as Array<{ productId?: string; title?: string; price?: number }> | undefined) || []).filter(item =>
      String(item.productId || '').startsWith('membership:'),
    );
    const account = accountByEmail.get(String(order.customerEmail || '').toLowerCase()) || accountByPhone.get(String(order.customerPhone || ''));

    return {
      orderId: String(order._id || ''),
      orderNo: order.orderNo,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      account,
      memberships: items.map(item => ({
        id: getPlanIdFromOrderItem(item),
        title: String(item.title || '').replace(/^Membership\s*-\s*/i, ''),
        price: Number(item.price) || 0,
      })),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  });

  return { membershipUsers, total, page, limit };
};

export async function createMember(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const body = (await req.json()) as MemberPayload;
    if (!body.title) return formatResponse(null, 'Member title is required', 400);
    const created = await Member.create(buildPayload(body));
    return formatResponse(created, 'Member created successfully', 201);
  });
}

export async function getMemberById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Member ID is required', 400);
    const member = await Member.findById(id);
    if (!member) return formatResponse(null, 'Member not found', 404);
    return formatResponse(member, 'Member fetched successfully', 200);
  });
}

export async function getMembers(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const q = url.searchParams.get('q');
    const filter: FilterQuery<unknown> = {};

    if (q) {
      const numericQuery = Number(q);
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
      if (Number.isFinite(numericQuery)) {
        filter.$or.push({ realPrice: numericQuery }, { discountPrice: numericQuery });
      }
    }

    const [members, total] = await Promise.all([
      Member.find(filter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
      Member.countDocuments(filter),
    ]);

    return formatResponse({ members: members || [], total, page, limit }, 'Members fetched successfully', 200);
  });
}

export async function getMembersSummary(): Promise<IResponse> {
  return withDB(async () => {
    const now = new Date();
    const [totalRecords, activeDiscounts, totals] = await Promise.all([
      Member.countDocuments({}),
      Member.countDocuments({ endDiscount: { $gte: now } }),
      Member.aggregate([
        {
          $group: {
            _id: null,
            totalRealPrice: { $sum: '$realPrice' },
            totalDiscountPrice: { $sum: '$discountPrice' },
          },
        },
      ]),
    ]);

    return formatResponse(
      {
        overall: {
          totalRecords,
          activeDiscounts,
          totalRealPrice: Number(totals?.[0]?.totalRealPrice || 0),
          totalDiscountPrice: Number(totals?.[0]?.totalDiscountPrice || 0),
        },
      },
      'Summary fetched successfully',
      200,
    );
  });
}

export async function checkMemberByMobile(mobileNumber: string): Promise<IResponse> {
  return withDB(async () => {
    const phone = String(mobileNumber || '').trim();
    if (!phone) return formatResponse(null, 'Mobile number is required', 400);

    const orders = await Orders.find({
      customerPhone: phone,
      paymentStatus: 'paid',
      $or: [
        { 'items.productId': { $regex: '^membership:' } },
        { 'items.title': { $regex: 'membership', $options: 'i' } },
        { note: { $regex: 'membership', $options: 'i' } },
      ],
    }).sort({ updatedAt: -1, createdAt: -1 });

    const membershipIds = Array.from(
      new Set(
        orders.flatMap(order =>
          ((order.items || []) as Array<{ productId?: string }>).map(item => getPlanIdFromOrderItem(item)).filter(Boolean),
        ),
      ),
    );

    return formatResponse({ isMember: orders.length > 0, membershipIds }, orders.length ? 'Member found' : 'Member not found', 200);
  });
}

export async function getMembershipUsers(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const q = url.searchParams.get('q');
    const filter: FilterQuery<unknown> = { ...membershipOrderFilter };

    if (q) {
      filter.$and = [
        { ...membershipOrderFilter },
        {
          $or: [
            { orderNo: { $regex: q, $options: 'i' } },
            { customerName: { $regex: q, $options: 'i' } },
            { customerEmail: { $regex: q, $options: 'i' } },
            { customerPhone: { $regex: q, $options: 'i' } },
            { 'items.title': { $regex: q, $options: 'i' } },
          ],
        },
      ];
      delete filter.$or;
      delete filter.paymentStatus;
    }

    const [orders, total] = await Promise.all([
      Orders.find(filter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Orders.countDocuments(filter),
    ]);

    return formatResponse(await buildMembershipUserResponse(orders as Array<Record<string, unknown>>, total, page, limit), 'Membership users fetched successfully', 200);
  });
}

export async function createMembershipUser(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const body = (await req.json()) as MembershipUserPayload;
    const account = body.accountId
      ? await CustomerAccount.findById(body.accountId)
      : await CustomerAccount.findOne({
          $or: [{ email: String(body.email || '').trim().toLowerCase() }, { mobileNumber: String(body.mobileNumber || '').trim() }],
        });
    if (!account) return formatResponse(null, 'Customer account not found', 404);

    const plans = await getMembershipPlansByIds(body.membershipIds);
    if (!plans.length) return formatResponse(null, 'Please select at least one membership plan', 400);

    const items = getMembershipItems(plans);
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const existing = await Orders.findOne({
      paymentStatus: 'paid',
      $or: [{ customerEmail: account.email }, { customerPhone: account.mobileNumber }],
      'items.productId': { $regex: '^membership:' },
    }).sort({ updatedAt: -1, createdAt: -1 });

    const payload = {
      customerName: account.name,
      customerEmail: account.email,
      customerPhone: account.mobileNumber,
      items,
      subtotal,
      shippingCharge: 0,
      discount: 0,
      totalAmount: subtotal,
      paymentMethod: 'manual-membership',
      paymentStatus: 'paid',
      deliveryStatus: 'delivered',
      orderStatus: 'completed',
      shippingAddress: '',
      note: 'Membership assigned from dashboard.',
    };

    const order = existing
      ? await Orders.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true })
      : await Orders.create({ ...payload, orderNo: `MEM-${Date.now()}` });

    return formatResponse(order, existing ? 'Membership user updated successfully' : 'Membership user added successfully', existing ? 200 : 201);
  });
}

export async function updateMembershipUser(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const body = (await req.json()) as MembershipUserPayload;
    if (!body.orderId) return formatResponse(null, 'Membership order ID is required', 400);
    const plans = await getMembershipPlansByIds(body.membershipIds);
    if (!plans.length) return formatResponse(null, 'Please select at least one membership plan', 400);
    const items = getMembershipItems(plans);
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const updated = await Orders.findByIdAndUpdate(
      body.orderId,
      {
        items,
        subtotal,
        totalAmount: subtotal,
        paymentStatus: 'paid',
        deliveryStatus: 'delivered',
        orderStatus: 'completed',
        note: 'Membership updated from dashboard.',
      },
      { new: true, runValidators: true },
    );
    if (!updated) return formatResponse(null, 'Membership user not found', 404);
    return formatResponse(updated, 'Membership user updated successfully', 200);
  });
}

export async function deleteMembershipUser(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { orderId } = (await req.json()) as MembershipUserPayload;
    if (!orderId) return formatResponse(null, 'Membership order ID is required', 400);
    const deleted = await Orders.findByIdAndDelete(orderId);
    if (!deleted) return formatResponse(null, 'Membership user not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Membership user deleted successfully', 200);
  });
}

export async function updateMember(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id, ...body } = (await req.json()) as MemberPayload & { id?: string };
    if (!id) return formatResponse(null, 'Member ID is required', 400);
    const updated = await Member.findByIdAndUpdate(id, buildPayload(body), { new: true, runValidators: true });
    if (!updated) return formatResponse(null, 'Member not found', 404);
    return formatResponse(updated, 'Member updated successfully', 200);
  });
}

export async function bulkUpdateMembers(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: MemberPayload }[] = await req.json();
    const results = await Promise.allSettled(updates.map(({ id, updateData }) => Member.findByIdAndUpdate(id, buildPayload(updateData), { new: true, runValidators: true })));
    const successfulUpdates = results.filter((result): result is PromiseFulfilledResult<unknown> => result.status === 'fulfilled' && result.value).map(result => result.value);
    const failedUpdates = results.map((result, index) => (result.status === 'rejected' || !('value' in result && result.value) ? updates[index].id : null)).filter((id): id is string => id !== null);
    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

export async function deleteMember(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deleted = await Member.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Member not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Member deleted successfully', 200);
  });
}

export async function bulkDeleteMembers(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const result = await Member.deleteMany({ _id: { $in: ids } });
    return formatResponse({ deleted: result.deletedCount || 0 }, 'Bulk delete operation completed', 200);
  });
}
