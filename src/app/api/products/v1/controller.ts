import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';

import Products from './model';

interface ProductAggregationResult {
  _id: {
    month: number;
    year: number;
  };
  totalRealPrice: number;
  totalDiscountPrice: number;
}

export async function createProduct(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const productData = await req.json();
      const newProduct = await Products.create({ ...productData });
      return formatResponse(newProduct, 'Product created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function getProductById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Product ID is required', 400);

    const product = await Products.findById(id);
    if (!product) return formatResponse(null, 'Product not found', 404);

    return formatResponse(product, 'Product fetched successfully', 200);
  });
}

export async function getProducts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');
    const statusQuery = url.searchParams.get('status');

    let searchFilter: FilterQuery<unknown> = {};

    if (statusQuery) {
      searchFilter.status = statusQuery;
    }

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
          'title',
          'category',
          'description',
          'features',
          'view',
          'status',
          'uploadProduct.name',
          'uploadProduct.url',
          'liveUrl',
          'VideoUrl',
        ];

        stringFields.forEach(field => {
          orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
        });

        const numericQuery = parseFloat(searchQuery);
        if (!Number.isNaN(numericQuery)) {
          ['real_price', 'discount_price', 'star', 'discount'].forEach(field => {
            orConditions.push({ [field]: numericQuery });
          });
        }

        if (orConditions.length > 0) searchFilter = { ...searchFilter, $or: orConditions };
      }
    }

    const products = await Products.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);
    const totalProducts = await Products.countDocuments(searchFilter);

    return formatResponse({ products: products || [], total: totalProducts, page, limit }, 'Products fetched successfully', 200);
  });
}

export async function getProductsSummary(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [totalDocs, activeDocs, draftDocs, last24HoursDocs, monthlyStatsRaw] = await Promise.all([
      Products.countDocuments({}),
      Products.countDocuments({ status: 'active' }),
      Products.countDocuments({ status: 'draft' }),
      Products.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
      Products.aggregate<ProductAggregationResult>([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            totalRealPrice: { $sum: '$real_price' },
            totalDiscountPrice: { $sum: '$discount_price' },
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
        totalRealPrice: stat.totalRealPrice || 0,
        totalDiscountPrice: stat.totalDiscountPrice || 0,
      };
    });

    const tableSummary = fullMonthlyTable.reduce(
      (acc, curr) => {
        acc.totalMonths += 1;
        acc.grandTotalRealPrice += curr.totalRealPrice;
        acc.grandTotalDiscountPrice += curr.totalDiscountPrice;
        return acc;
      },
      { totalMonths: 0, grandTotalRealPrice: 0, grandTotalDiscountPrice: 0 },
    );

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return formatResponse(
      {
        overall: {
          totalRecords: totalDocs,
          activeRecords: activeDocs,
          draftRecords: draftDocs,
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

export async function updateProduct(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedProduct = await Products.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedProduct) return formatResponse(null, 'Product not found', 404);
      return formatResponse(updatedProduct, 'Product updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function bulkUpdateProducts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json();
    const results = await Promise.allSettled(updates.map(({ id, updateData }) => Products.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })));

    const successfulUpdates = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value).map(r => r.value);
    const failedUpdates = results
      .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
      .filter((id): id is string => id !== null);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

export async function deleteProduct(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedProduct = await Products.findByIdAndDelete(id);
    if (!deletedProduct) return formatResponse(null, 'Product not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Product deleted successfully', 200);
  });
}

export async function bulkDeleteProducts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const doc = await Products.findById(id);
        if (doc) {
          const deletedDoc = await Products.findByIdAndDelete(id);
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
