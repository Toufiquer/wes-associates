import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';

import Orders from './model';

interface OrderAggregationResult {
  _id: {
    month: number;
    year: number;
  };
  totalAmount: number;
  totalSubtotal: number;
  totalDiscount: number;
}

const buildOrderPayload = (payload: Record<string, unknown>) => {
  const orderNo = payload.orderNo || `ORD-${Date.now()}`;
  return { ...payload, orderNo };
};

export async function createOrder(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const orderData = await req.json();
      const newOrder = await Orders.create(buildOrderPayload(orderData));
      return formatResponse(newOrder, 'Order created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function getOrderById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Order ID is required', 400);

    const order = await Orders.findById(id);
    if (!order) return formatResponse(null, 'Order not found', 404);

    return formatResponse(order, 'Order fetched successfully', 200);
  });
}

export async function getOrders(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');
    const paymentStatus = url.searchParams.get('paymentStatus');
    const deliveryStatus = url.searchParams.get('deliveryStatus');
    const orderStatus = url.searchParams.get('orderStatus');

    let searchFilter: FilterQuery<unknown> = {};

    if (paymentStatus) searchFilter.paymentStatus = paymentStatus;
    if (deliveryStatus) searchFilter.deliveryStatus = deliveryStatus;
    if (orderStatus) searchFilter.orderStatus = orderStatus;

    if (searchQuery) {
      if (searchQuery.startsWith('createdAt:range:')) {
        const datePart = searchQuery.split(':')[2];
        const [startDateString, endDateString] = datePart.split('_');

        if (startDateString && endDateString) {
          const startDate = new Date(startDateString);
          const endDate = new Date(endDateString);
          endDate.setUTCHours(23, 59, 59, 999);
          searchFilter = { ...searchFilter, createdAt: { $gte: startDate, $lte: endDate } };
        }
      } else {
        const orConditions: FilterQuery<unknown>[] = [];
        const stringFields = [
          'orderNo',
          'customerName',
          'customerEmail',
          'customerPhone',
          'paymentMethod',
          'paymentStatus',
          'deliveryStatus',
          'orderStatus',
          'shippingAddress',
          'note',
          'items.title',
        ];

        stringFields.forEach(field => {
          orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
        });

        const numericQuery = parseFloat(searchQuery);
        if (!Number.isNaN(numericQuery)) {
          ['subtotal', 'shippingCharge', 'discount', 'totalAmount', 'items.quantity', 'items.price'].forEach(field => {
            orConditions.push({ [field]: numericQuery });
          });
        }

        if (orConditions.length > 0) searchFilter = { ...searchFilter, $or: orConditions };
      }
    }

    const orders = await Orders.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);
    const totalOrders = await Orders.countDocuments(searchFilter);

    return formatResponse({ orders: orders || [], total: totalOrders, page, limit }, 'Orders fetched successfully', 200);
  });
}

export async function getOrdersSummary(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [totalDocs, paidDocs, pendingDocs, deliveredDocs, last24HoursDocs, monthlyStatsRaw] = await Promise.all([
      Orders.countDocuments({}),
      Orders.countDocuments({ paymentStatus: 'paid' }),
      Orders.countDocuments({ orderStatus: 'pending' }),
      Orders.countDocuments({ deliveryStatus: 'delivered' }),
      Orders.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
      Orders.aggregate<OrderAggregationResult>([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            totalAmount: { $sum: '$totalAmount' },
            totalSubtotal: { $sum: '$subtotal' },
            totalDiscount: { $sum: '$discount' },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
      ]),
    ]);

    const fullMonthlyTable = monthlyStatsRaw.map(stat => {
      const date = new Date();
      date.setMonth(stat._id.month - 1);
      const monthName = date.toLocaleString('default', { month: 'long' });

      return {
        month: `${monthName} ${stat._id.year}`,
        totalAmount: stat.totalAmount || 0,
        totalSubtotal: stat.totalSubtotal || 0,
        totalDiscount: stat.totalDiscount || 0,
      };
    });

    const tableSummary = fullMonthlyTable.reduce(
      (acc, curr) => {
        acc.totalMonths += 1;
        acc.grandTotalAmount += curr.totalAmount;
        acc.grandTotalSubtotal += curr.totalSubtotal;
        acc.grandTotalDiscount += curr.totalDiscount;
        return acc;
      },
      { totalMonths: 0, grandTotalAmount: 0, grandTotalSubtotal: 0, grandTotalDiscount: 0 },
    );

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return formatResponse(
      {
        overall: {
          totalRecords: totalDocs,
          paidRecords: paidDocs,
          pendingRecords: pendingDocs,
          deliveredRecords: deliveredDocs,
          recordsLast24Hours: last24HoursDocs,
        },
        monthlyTable: fullMonthlyTable.slice(startIndex, endIndex),
        tableSummary,
        pagination: {
          currentPage: page,
          limit,
          totalMonths: fullMonthlyTable.length,
          totalPages: Math.ceil(fullMonthlyTable.length / limit),
        },
      },
      'Summary fetched successfully',
      200,
    );
  });
}

export async function updateOrder(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedOrder = await Orders.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedOrder) return formatResponse(null, 'Order not found', 404);
      return formatResponse(updatedOrder, 'Order updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function bulkUpdateOrders(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json();
    const results = await Promise.allSettled(updates.map(({ id, updateData }) => Orders.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })));

    const successfulUpdates = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value).map(r => r.value);
    const failedUpdates = results
      .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
      .filter((id): id is string => id !== null);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

export async function deleteOrder(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedOrder = await Orders.findByIdAndDelete(id);
    if (!deletedOrder) return formatResponse(null, 'Order not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Order deleted successfully', 200);
  });
}

export async function bulkDeleteOrders(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const doc = await Orders.findById(id);
        if (doc) {
          const deletedDoc = await Orders.findByIdAndDelete(id);
          if (deletedDoc) deletedIds.push(id);
        } else {
          invalidIds.push(id);
        }
      } catch {
        invalidIds.push(id);
      }
    }

    return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete operation completed', 200);
  });
}
