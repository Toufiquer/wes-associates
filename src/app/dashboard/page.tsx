/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { CalendarDays, CheckCircle2, Clock3, FileText, Loader2, UserPlus, UsersRound, XCircle } from 'lucide-react';
import { useMemo } from 'react';

import { useSession } from '@/lib/auth-client';
import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';
import { useGetAllApplicationsQuery } from '@/redux/features/application/applicationSlice';
import { useGetUsersSummaryQuery } from '@/redux/features/user/userSlice';

type ApplicationStatus = 'submitted' | 'in_review' | 'approved' | 'rejected';

interface Application {
  _id: string;
  status: ApplicationStatus;
  createdAt: string;
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

  const { data: accessData, isLoading: isAccessLoading } = useGetAccessManagementsQuery(
    { user_email: email, page: 1, limit: 100 },
    { skip: !email },
  );

  const userRoles: string[] = accessData?.data?.accessManagements?.[0]?.assign_role || [];
  const isAdmin = userRoles.includes('Admin');

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
    return (
      <section className="mx-auto flex min-h-[55vh] max-w-5xl items-center">
        <div>
          <p className="text-sm font-semibold text-white/60">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-white/60">Use the navigation to access your available tools.</p>
        </div>
      </section>
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
