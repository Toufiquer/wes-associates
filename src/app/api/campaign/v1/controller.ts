import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';

import Campaign from './model';

interface CampaignPayload {
  campaignId?: string;
  totalImpressions?: number;
  clicks?: number;
  ctr?: number;
  [key: string]: unknown;
}

const normalizeCampaignPayload = (payload: CampaignPayload) => {
  const totalImpressions = Number(payload.totalImpressions) || 0;
  const clicks = Number(payload.clicks) || 0;
  const ctr = payload.ctr !== undefined ? Number(payload.ctr) || 0 : totalImpressions > 0 ? Number(((clicks / totalImpressions) * 100).toFixed(2)) : 0;

  return {
    ...payload,
    totalImpressions,
    clicks,
    ctr,
    conversions: Number(payload.conversions) || 0,
    spend: Number(payload.spend) || 0,
  };
};

export async function createCampaign(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const campaignData = normalizeCampaignPayload(await req.json());
      const newCampaign = await Campaign.create(campaignData);
      return formatResponse(newCampaign, 'Campaign created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function getCampaignById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const campaignId = url.searchParams.get('campaignId');

    if (!id && !campaignId) return formatResponse(null, 'Campaign ID is required', 400);

    const campaign = id ? await Campaign.findById(id) : await Campaign.findOne({ campaignId });
    if (!campaign) return formatResponse(null, 'Campaign not found', 404);

    return formatResponse(campaign, 'Campaign fetched successfully', 200);
  });
}

export async function getCampaigns(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');

    let searchFilter: FilterQuery<unknown> = {};

    if (searchQuery) {
      const orConditions: FilterQuery<unknown>[] = [
        { campaignId: { $regex: searchQuery, $options: 'i' } },
        { name: { $regex: searchQuery, $options: 'i' } },
        { status: { $regex: searchQuery, $options: 'i' } },
        { note: { $regex: searchQuery, $options: 'i' } },
      ];

      const numericQuery = parseFloat(searchQuery);
      if (!Number.isNaN(numericQuery)) {
        ['totalImpressions', 'clicks', 'ctr', 'conversions', 'spend'].forEach(field => {
          orConditions.push({ [field]: numericQuery });
        });
      }

      searchFilter = { $or: orConditions };
    }

    const campaigns = await Campaign.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);
    const totalCampaigns = await Campaign.countDocuments(searchFilter);

    return formatResponse({ campaigns: campaigns || [], total: totalCampaigns, page, limit }, 'Campaigns fetched successfully', 200);
  });
}

export async function updateCampaign(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedCampaign = await Campaign.findByIdAndUpdate(id, normalizeCampaignPayload(updateData), { new: true, runValidators: true });

      if (!updatedCampaign) return formatResponse(null, 'Campaign not found', 404);
      return formatResponse(updatedCampaign, 'Campaign updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function deleteCampaign(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedCampaign = await Campaign.findByIdAndDelete(id);
    if (!deletedCampaign) return formatResponse(null, 'Campaign not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Campaign deleted successfully', 200);
  });
}
