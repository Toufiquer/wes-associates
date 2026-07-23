/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  UserPlus,
  UsersRound,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { useSession } from '@/lib/auth-client';
import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';
import { useGetAllApplicationsQuery, useGetMyApplicationsQuery } from '@/redux/features/application/applicationSlice';
import { useGetProfileByUserIdQuery } from '@/redux/features/profile/profileSlice';
import { useGetUsersSummaryQuery } from '@/redux/features/user/userSlice';

type ApplicationStatus = 'submitted' | 'in_review' | 'approved' | 'rejected';

interface Application {
  _id: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt?: string;
  selectedCountry?: string;
  selectedUniversity?: string;
  selectedCourseName?: string;
  adminNote?: string;
}

interface ApplicationsResponse {
  data?: {
    applications?: Application[];
  };
}

interface UsersSummaryResponse {
  data?: {
    overall?: {
      totalRecords?: number;
      recordsLast24Hours?: number;
    };
  };
}

interface ProfileResponse {
  data?: {
    phone?: string;
    occupation?: string;
    address?: {
      city?: string;
      country?: string;
    };
  };
}

const statuses: Array<{
  key: ApplicationStatus;
  label: string;
  icon: typeof FileText;
  color: string;
  background: string;
}> = [
  { key: 'submitted', label: 'Submitted', icon: FileText, color: 'text-cyan-200', background: 'bg-cyan-400/15' },
  { key: 'in_review', label: 'In review', icon: Clock3, color: 'text-amber-200', background: 'bg-amber-400/15' },
  { key: 'approved', label: 'Approved', icon: CheckCircle2, color: 'text-emerald-200', background: 'bg-emerald-400/15' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-rose-200', background: 'bg-rose-400/15' },
];

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const subtractDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const Page = () => {
  const session = useSession();
  const email = session.data?.user?.email || '';
  const userId = session.data?.user?.id;

  const { data: accessData, isLoading: isAccessLoading } = useGetAccessManagementsQuery(
    { user_email: email, page: 1, limit: 100 },
    { skip: !email },
  );

  const userRoles: string[] = accessData?.data?.accessManagements?.[0]?.assign_role || [];
  const isAdmin = userRoles.includes('Admin');
  const shouldLoadUserDashboard = Boolean(email) && !isAccessLoading && !isAdmin;

  const {
    data: applicationsData,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
  } = useGetAllApplicationsQuery(undefined, { skip: !isAdmin }) as {
    data?: ApplicationsResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetUsersSummaryQuery(
    { page: 1, limit: 10 },
    { skip: !isAdmin },
  ) as {
    data?: UsersSummaryResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const {
    data: myApplicationsData,
    isLoading: isMyApplicationsLoading,
    isError: isMyApplicationsError,
  } = useGetMyApplicationsQuery(undefined, { skip: !shouldLoadUserDashboard }) as {
    data?: ApplicationsResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfileByUserIdQuery(userId, { skip: !shouldLoadUserDashboard || !userId }) as {
    data?: ProfileResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const applicationPeriods = useMemo(() => {
    const applications = applicationsData?.data?.applications || [];
    const today = startOfToday();
    const lastSevenDays = subtractDays(today, 6);
    const lastMonth = subtractDays(today, 29);

    const periods = [
      { label: 'Today', from: today },
      { label: 'Last 7 days', from: lastSevenDays },
      { label: 'Last month', from: lastMonth },
      { label: 'Lifetime', from: null },
    ];

    return periods.map(period => {
      const records = period.from ? applications.filter(application => new Date(application.createdAt) >= period.from!) : applications;
      const counts = statuses.reduce(
        (result, status) => {
          result[status.key] = records.filter(application => application.status === status.key).length;
          return result;
        },
        {} as Record<ApplicationStatus, number>,
      );

      return { ...period, total: records.length, counts };
    });
  }, [applicationsData]);

  if (session.isPending || (email && isAccessLoading)) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" aria-label="Loading dashboard" />
      </div>
    );
  }

  if (!isAdmin) {
    const myApplications = myApplicationsData?.data?.applications || [];
    const latestApplication = myApplications[0];
    const latestStatus = statuses.find(status => status.key === latestApplication?.status) || statuses[0];
    const LatestStatusIcon = latestStatus.icon;
    const profile = profileData?.data;
    const location = [profile?.address?.city, profile?.address?.country].filter(Boolean).join(', ');

    return (
      <main className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-sm font-semibold text-white/60">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{session.data?.user?.name || 'Dashboard'}</h1>
          <p className="mt-2 text-sm text-white/60">Review your application progress and personal information.</p>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <section aria-labelledby="my-application-heading" className="rounded-sm border border-white/15 bg-white/[0.07] p-5 shadow-lg backdrop-blur-md sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-cyan-200">Application update</p>
                <h2 id="my-application-heading" className="mt-1 text-xl font-bold text-white">
                  My application
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-cyan-400/15 text-cyan-200">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            {isMyApplicationsLoading ? (
              <div className="flex h-44 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-200" />
              </div>
            ) : isMyApplicationsError ? (
              <p className="mt-6 rounded-sm bg-rose-400/10 p-4 text-sm text-rose-100">Unable to load your application update.</p>
            ) : latestApplication ? (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{latestApplication.selectedCourseName || 'Course not selected'}</p>
                    <p className="mt-1 text-sm text-white/50">
                      {[latestApplication.selectedUniversity, latestApplication.selectedCountry].filter(Boolean).join(' / ') || 'Destination not selected'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-semibold ${latestStatus.background} ${latestStatus.color}`}>
                    <LatestStatusIcon className="h-4 w-4" />
                    {latestStatus.label}
                  </span>
                </div>

                {latestApplication.adminNote && (
                  <div className="mt-5 border-l-2 border-amber-300 bg-amber-300/10 p-4">
                    <p className="text-xs font-semibold text-amber-200">Admission team update</p>
                    <p className="mt-1 text-sm text-amber-50/80">{latestApplication.adminNote}</p>
                  </div>
                )}

                <p className="mt-5 text-xs text-white/45">
                  Updated {new Date(latestApplication.updatedAt || latestApplication.createdAt).toLocaleDateString()}
                  {myApplications.length > 1 ? ` / ${myApplications.length} applications total` : ''}
                </p>
              </div>
            ) : (
              <div className="mt-6 border border-dashed border-white/15 p-5 text-sm text-white/60">
                You have not submitted an application yet.
              </div>
            )}

            <Link
              href={latestApplication ? '/dashboard/my-application' : '/application'}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
            >
              {latestApplication ? 'View my applications' : 'Start an application'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <section aria-labelledby="personal-info-heading" className="rounded-sm border border-white/15 bg-white/[0.07] p-5 shadow-lg backdrop-blur-md sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-emerald-200">Account details</p>
                <h2 id="personal-info-heading" className="mt-1 text-xl font-bold text-white">
                  Personal information
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-400/15 text-emerald-200">
                <UsersRound className="h-5 w-5" />
              </div>
            </div>

            {isProfileLoading ? (
              <div className="flex h-44 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-200" />
              </div>
            ) : isProfileError ? (
              <p className="mt-6 rounded-sm bg-rose-400/10 p-4 text-sm text-rose-100">Unable to load your personal information.</p>
            ) : (
              <dl className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                  <div>
                    <dt className="text-xs text-white/45">Email</dt>
                    <dd className="mt-0.5 break-all text-sm font-medium text-white">{email}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
                  <div>
                    <dt className="text-xs text-white/45">Phone</dt>
                    <dd className="mt-0.5 text-sm font-medium text-white">{profile?.phone || 'Not provided'}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                  <div>
                    <dt className="text-xs text-white/45">Occupation</dt>
                    <dd className="mt-0.5 text-sm font-medium text-white">{profile?.occupation || 'Not provided'}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-200" />
                  <div>
                    <dt className="text-xs text-white/45">Location</dt>
                    <dd className="mt-0.5 text-sm font-medium text-white">{location || 'Not provided'}</dd>
                  </div>
                </div>
              </dl>
            )}

            <Link href="/dashboard/profile" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition hover:text-emerald-100">
              Edit personal information
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const usersSummary = usersData?.data?.overall;

  return (
    <main className="mx-auto max-w-7xl space-y-10">
      <header>
        <p className="text-xs font-semibold uppercase text-cyan-200">Admin overview</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Dashboard summary</h1>
        <p className="mt-2 text-sm text-white/60">Application progress and user activity at a glance.</p>
      </header>

      <section aria-labelledby="application-summary-heading">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-cyan-400/15 text-cyan-200">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 id="application-summary-heading" className="text-xl font-bold text-white">
              Application summary
            </h2>
            <p className="text-xs text-white/50">Applications grouped by current status</p>
          </div>
        </div>

        {isApplicationsLoading ? (
          <div className="flex h-40 items-center justify-center rounded-sm border border-white/15 bg-white/5">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-200" />
          </div>
        ) : isApplicationsError ? (
          <p className="rounded-sm border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">
            Unable to load the application summary.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {applicationPeriods.map(period => (
              <article key={period.label} className="rounded-sm border border-white/15 bg-white/[0.07] p-4 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <CalendarDays className="h-4 w-4 text-cyan-200" />
                    {period.label}
                  </div>
                  <span className="text-2xl font-bold text-white">{period.total}</span>
                </div>
                <dl className="mt-4 space-y-3">
                  {statuses.map(status => {
                    const Icon = status.icon;
                    return (
                      <div key={status.key} className="flex items-center justify-between gap-3">
                        <dt className="flex items-center gap-2 text-sm text-white/70">
                          <span className={`flex h-7 w-7 items-center justify-center rounded-sm ${status.background} ${status.color}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          {status.label}
                        </dt>
                        <dd className="font-semibold text-white">{period.counts[status.key]}</dd>
                      </div>
                    );
                  })}
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="user-summary-heading">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-400/15 text-emerald-200">
            <UsersRound className="h-5 w-5" />
          </div>
          <div>
            <h2 id="user-summary-heading" className="text-xl font-bold text-white">
              User summary
            </h2>
            <p className="text-xs text-white/50">Registered user activity</p>
          </div>
        </div>

        {isUsersLoading ? (
          <div className="flex h-32 items-center justify-center rounded-sm border border-white/15 bg-white/5">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-200" />
          </div>
        ) : isUsersError ? (
          <p className="rounded-sm border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">Unable to load the user summary.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="flex items-center justify-between rounded-sm border border-white/15 bg-white/[0.07] p-5 shadow-lg backdrop-blur-md">
              <div>
                <p className="text-sm text-white/60">Lifetime users</p>
                <p className="mt-1 text-3xl font-bold text-white">{usersSummary?.totalRecords ?? 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-cyan-400/15 text-cyan-200">
                <UsersRound className="h-6 w-6" />
              </div>
            </article>
            <article className="flex items-center justify-between rounded-sm border border-white/15 bg-white/[0.07] p-5 shadow-lg backdrop-blur-md">
              <div>
                <p className="text-sm text-white/60">New in last 24 hours</p>
                <p className="mt-1 text-3xl font-bold text-white">{usersSummary?.recordsLast24Hours ?? 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-emerald-400/15 text-emerald-200">
                <UserPlus className="h-6 w-6" />
              </div>
            </article>
          </div>
        )}
      </section>
    </main>
  );
};

export default Page;
