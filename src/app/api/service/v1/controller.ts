import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import ServiceCountry from './model';

interface ServiceCountryPayload {
  id?: string;
  country?: string;
  city?: unknown[];
  universitys?: unknown[];
  [key: string]: unknown;
}

const normalizePayload = (payload: ServiceCountryPayload) => ({
  ...payload,
  id: String(payload.id || '').trim(),
  country: String(payload.country || '').trim(),
  city: Array.isArray(payload.city) ? payload.city.map(item => String(item).trim()).filter(Boolean) : [],
  universitys: Array.isArray(payload.universitys) ? payload.universitys : [],
});

const duplicateResponse = (error: unknown) => {
  const field = Object.keys((error as { keyValue?: Record<string, unknown> }).keyValue || {})[0] || 'country';
  return formatResponse(null, `A service country with this ${field} already exists`, 409);
};

export async function createServiceCountry(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const item = await ServiceCountry.create(normalizePayload(await req.json()));
      return formatResponse(item, 'Service country created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) return duplicateResponse(error);
      throw error;
    }
  });
}

export async function getServiceCountries(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 50));
    const q = url.searchParams.get('q')?.trim();
    const filter: FilterQuery<unknown> = q
      ? { $or: [{ country: { $regex: q, $options: 'i' } }, { city: { $regex: q, $options: 'i' } }, { 'universitys.name': { $regex: q, $options: 'i' } }] }
      : {};

    const [serviceCountries, total] = await Promise.all([
      ServiceCountry.find(filter)
        .sort({ country: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ServiceCountry.countDocuments(filter),
    ]);

    return formatResponse({ serviceCountries, total, page, limit }, 'Service countries fetched successfully', 200);
  });
}

export async function getServiceCountryById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Service country ID is required', 400);
    const item = await ServiceCountry.findById(id);
    return item ? formatResponse(item, 'Service country fetched successfully', 200) : formatResponse(null, 'Service country not found', 404);
  });
}

export async function updateServiceCountry(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { mongoId, ...payload } = await req.json();
      if (!mongoId) return formatResponse(null, 'Service country ID is required', 400);
      const item = await ServiceCountry.findByIdAndUpdate(mongoId, normalizePayload(payload), { new: true, runValidators: true });
      return item ? formatResponse(item, 'Service country updated successfully', 200) : formatResponse(null, 'Service country not found', 404);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) return duplicateResponse(error);
      throw error;
    }
  });
}

export async function deleteServiceCountry(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'Service country ID is required', 400);
    const item = await ServiceCountry.findByIdAndDelete(id);
    return item ? formatResponse({ deletedCount: 1 }, 'Service country deleted successfully', 200) : formatResponse(null, 'Service country not found', 404);
  });
}
