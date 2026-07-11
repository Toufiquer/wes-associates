import { headers } from 'next/headers';
import Link from 'next/link';
import { BarChart3, Eye, MousePointerClick, TrendingUp, UserCheck } from 'lucide-react';

interface CampaignResult {
  campaignId: string;
  name?: string;
  totalImpressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  spend?: number;
  status?: string;
  note?: string;
}

interface CampaignApiResponse {
  data?: CampaignResult;
  message?: string;
}

const metricCards = [
  { key: 'totalImpressions', label: 'Total Impressions', icon: Eye },
  { key: 'clicks', label: 'Clicks', icon: MousePointerClick },
  { key: 'ctr', label: 'CTR', icon: TrendingUp },
  { key: 'conversions', label: 'Conversions', icon: UserCheck },
] as const;

const getBaseUrl = async () => {
  const headerList = await headers();
  const host = headerList.get('host');
  const protocol = headerList.get('x-forwarded-proto') || 'http';
  return `${protocol}://${host}`;
};

const formatMetric = (key: (typeof metricCards)[number]['key'], value: unknown) => {
  if (key === 'ctr') return `${Number(value || 0).toFixed(2)}%`;
  return (Number(value) || 0).toLocaleString();
};

const getCampaign = async (campaignId: string) => {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/campaign/v1?campaignId=${encodeURIComponent(campaignId)}`, {
    cache: 'no-store',
  });

  const result = (await response.json()) as CampaignApiResponse;
  if (!response.ok || !result.data) return null;
  return result.data;
};

const CampaignResultPage = async ({ params }: { params: Promise<{ campaignId: string }> }) => {
  const { campaignId } = await params;
  const campaign = await getCampaign(campaignId);

  if (!campaign) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-20 text-white">
        <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-red-200">Campaign Not Found</p>
          <h1 className="mt-3 text-3xl font-black">No data for {campaignId}</h1>
          <p className="mt-3 text-white/60">The campaign may not be saved yet, or the campaign ID is incorrect.</p>
          <Link href="/dashboard/campaign" className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700">
            Back to Campaign Dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-200">Campaign Results</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">{campaign.name || 'Untitled campaign'}</h1>
              <p className="mt-2 text-white/60">Campaign ID: {campaign.campaignId}</p>
            </div>
            <div className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold capitalize text-emerald-100">
              {campaign.status || 'active'}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map(({ key, label, icon: Icon }) => (
            <div key={key} className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
                  <p className="mt-2 text-3xl font-black">{formatMetric(key, campaign[key])}</p>
                </div>
                <div className="rounded-full bg-blue-500/20 p-3 text-blue-100">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <BarChart3 className="h-5 w-5 text-blue-300" /> Campaign Data
          </h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/40 p-4 text-sm text-blue-50">{JSON.stringify(campaign, null, 2)}</pre>
        </div>
      </section>
    </main>
  );
};

export default CampaignResultPage;
