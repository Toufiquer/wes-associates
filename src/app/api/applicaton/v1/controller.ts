import { auth } from '@/lib/auth';
import mongoose from 'mongoose';
import { withDB } from '@/app/api/utils/db';
import { formatResponse, type IResponse } from '@/app/api/utils/utils';
import { isUserHasAccessByRole } from '@/app/api/utils/is-user-has-access-by-role';

import StudentApplication from './model';

const sessionFor = (req: Request) => auth.api.getSession({ headers: req.headers });

const cleanPayload = (body: Record<string, unknown>) => ({
  fullName: String(body.fullName || '').trim(),
  mobileWhatsApp: String(body.mobileWhatsApp || '').trim(),
  age: body.age === '' || body.age === undefined || body.age === null ? undefined : Number(body.age),
  fatherName: String(body.fatherName || '').trim(),
  motherName: String(body.motherName || '').trim(),
  englishProficiency: String(body.englishProficiency || '').trim(),
  englishScore: String(body.englishScore || '').trim(),
  otherCurriculum: String(body.otherCurriculum || '').trim(),
  selectedCountry: String(body.selectedCountry || '').trim(),
  selectedCity: String(body.selectedCity || '').trim(),
  selectedUniversity: String(body.selectedUniversity || '').trim(),
  selectedCourseName: String(body.selectedCourseName || '').trim(),
  selectedCourseSubject: String(body.selectedCourseSubject || '').trim(),
  documents: Array.isArray(body.documents) ? body.documents : [],
});

export const createApplication = (req: Request): Promise<IResponse> =>
  withDB(async () => {
    const session = await sessionFor(req);
    if (!session?.user) return formatResponse(null, 'Please sign in before submitting an application', 401);
    const payload = cleanPayload(await req.json());
    if (!payload.fullName) return formatResponse(null, 'Full name is required', 400);
    if (!payload.mobileWhatsApp) return formatResponse(null, 'Mobile/WhatsApp number is required', 400);
    const application = await StudentApplication.create({ ...payload, ownerId: session.user.id, ownerEmail: session.user.email });
    return formatResponse(application, 'Application submitted successfully', 201);
  });

export const getApplications = (req: Request): Promise<IResponse> =>
  withDB(async () => {
    const session = await sessionFor(req);
    if (!session?.user) return formatResponse(null, 'Session required', 401);
    const url = new URL(req.url);
    const scope = url.searchParams.get('scope') === 'all' ? 'all' : 'my';
    if (scope === 'all') {
      const denied = await isUserHasAccessByRole({ db_name: 'Application', access: 'read' });
      if (denied) return formatResponse(null, 'Admin access required', denied.status);
    }
    const filter = scope === 'all' ? {} : { ownerEmail: session.user.email.toLowerCase() };
    const applications = await StudentApplication.find(filter).sort({ createdAt: -1 }).lean();
    return formatResponse({ applications, total: applications.length }, 'Applications fetched successfully', 200);
  });

export const updateApplication = (req: Request): Promise<IResponse> =>
  withDB(async () => {
    const session = await sessionFor(req);
    if (!session?.user) return formatResponse(null, 'Session required', 401);
    const body = (await req.json()) as Record<string, unknown>;
    const id = String(body.id || '');
    const admin = body.scope === 'all';
    if (!id) return formatResponse(null, 'Application ID is required', 400);
    if (admin) {
      const denied = await isUserHasAccessByRole({ db_name: 'Application', access: 'update' });
      if (denied) return formatResponse(null, 'Admin access required', denied.status);
    }
    const filter = admin ? { _id: id } : { _id: id, ownerEmail: session.user.email.toLowerCase() };
    let update;
    if (admin) {
      update = { status: String(body.status || 'submitted'), adminNote: String(body.adminNote || '') };
    } else {
      update = cleanPayload(body);
      if (!update.fullName) return formatResponse(null, 'Full name is required', 400);
      if (!update.mobileWhatsApp) return formatResponse(null, 'Mobile/WhatsApp number is required', 400);
    }
    const application = await StudentApplication.findOneAndUpdate(filter, update, { new: true, runValidators: true });
    return application ? formatResponse(application, 'Application updated successfully', 200) : formatResponse(null, 'Application not found', 404);
  });

export const deleteApplication = (req: Request): Promise<IResponse> =>
  withDB(async () => {
    const session = await sessionFor(req);
    if (!session?.user) return formatResponse(null, 'Session required', 401);
    const denied = await isUserHasAccessByRole({ db_name: 'Application', access: 'delete' });
    if (denied) return formatResponse(null, 'Admin access required', denied.status);

    const body = (await req.json()) as Record<string, unknown>;
    const id = String(body.id || '');
    if (!id) return formatResponse(null, 'Application ID is required', 400);
    if (!mongoose.isValidObjectId(id)) return formatResponse(null, 'Invalid application ID', 400);

    const application = await StudentApplication.findByIdAndDelete(id);
    return application ? formatResponse(application, 'Application deleted successfully', 200) : formatResponse(null, 'Application not found', 404);
  });
