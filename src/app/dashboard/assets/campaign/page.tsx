'use client';

import { BarChart3, Eye, Loader2, MousePointerClick, PlusIcon, RefreshCcw, Search, TrashIcon, TrendingUp, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import ErrorMessageComponent from '@/components/common/Error';
import LoadingComponent from '@/components/common/Loading/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAddCampaignMutation, useDeleteCampaignMutation, useGetCampaignsQuery, useUpdateCampaignMutation } from '@/redux/features/campaign/campaignSlice';

type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';

interface CampaignItem {
  _id?: string;
  campaignId: string;
  name?: string;
  totalImpressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  spend?: number;
  status: CampaignStatus;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CampaignResponse {
  data?: {
    campaigns?: CampaignItem[];
    total?: number;
  };
}

const emptyCampaign = (): CampaignItem => ({
  campaignId: '',
  name: '',
  totalImpressions: 0,
  clicks: 0,
  ctr: 0,
  conversions: 0,
  spend: 0,
  status: 'active',
  note: '',
});

const metricCards = [
  { key: 'totalImpressions', label: 'Total Impressions', icon: Eye },
  { key: 'clicks', label: 'Clicks', icon: MousePointerClick },
  { key: 'ctr', label: 'CTR', icon: TrendingUp },
  { key: 'conversions', label: 'Conversions', icon: UserCheck },
] as const;

const formatNumber = (value?: unknown) => (Number(value) || 0).toLocaleString();
const formatMetric = (key: (typeof metricCards)[number]['key'], value: unknown) => (key === 'ctr' ? `${Number(value || 0).toFixed(2)}%` : formatNumber(value));

const CampaignForm = ({ value, onChange }: { value: CampaignItem; onChange: (next: CampaignItem) => void }) => {
  const setField = <K extends keyof CampaignItem>(key: K, nextValue: CampaignItem[K]) => onChange({ ...value, [key]: nextValue });

  return (
    <div className="grid gap-4 py-2 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Campaign ID</Label>
        <Input value={value.campaignId} onChange={event => setField('campaignId', event.target.value)} placeholder="CMP-001" />
      </div>
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={value.name || ''} onChange={event => setField('name', event.target.value)} placeholder="Summer launch campaign" />
      </div>
      <div className="space-y-2">
        <Label>Total Impressions</Label>
        <Input type="number" value={value.totalImpressions} onChange={event => setField('totalImpressions', Number(event.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>Clicks</Label>
        <Input type="number" value={value.clicks} onChange={event => setField('clicks', Number(event.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>CTR</Label>
        <Input type="number" step="0.01" value={value.ctr} onChange={event => setField('ctr', Number(event.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>Conversions</Label>
        <Input type="number" value={value.conversions} onChange={event => setField('conversions', Number(event.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>Spend</Label>
        <Input type="number" value={value.spend || 0} onChange={event => setField('spend', Number(event.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={value.status} onValueChange={(next: CampaignStatus) => setField('status', next)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['active', 'paused', 'completed', 'draft'] as CampaignStatus[]).map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const CampaignPage = () => {
  const [page] = useState(1);
  const [limit] = useState(50);
  const [q, setQ] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [openDialog, setOpenDialog] = useState<'add' | 'edit' | null>(null);
  const [draft, setDraft] = useState<CampaignItem>(emptyCampaign);
  const [editing, setEditing] = useState<CampaignItem | null>(null);

  const { data, isLoading, isError, isFetching, error, refetch } = useGetCampaignsQuery({ page, limit, q }) as {
    data?: CampaignResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    error?: unknown;
    refetch: () => Promise<unknown>;
  };

  const [addCampaign, { isLoading: isAdding }] = useAddCampaignMutation();
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const campaigns = useMemo(() => data?.data?.campaigns || [], [data]);
  const selectedCampaign = campaigns.find(item => item._id === selectedCampaignId) || campaigns[0];

  const submitAdd = async () => {
    try {
      await addCampaign(draft).unwrap();
      toast.success('Campaign saved successfully');
      setDraft(emptyCampaign());
      setOpenDialog(null);
    } catch {
      toast.error('Unable to save campaign');
    }
  };

  const submitEdit = async () => {
    if (!editing?._id) return;
    try {
      await updateCampaign({ id: editing._id, ...editing }).unwrap();
      toast.success('Campaign updated successfully');
      setEditing(null);
      setOpenDialog(null);
    } catch {
      toast.error('Unable to update campaign');
    }
  };

  const removeCampaign = async (campaign: CampaignItem) => {
    if (!campaign._id) return;
    try {
      await deleteCampaign({ id: campaign._id }).unwrap();
      toast.success('Campaign deleted successfully');
      if (selectedCampaignId === campaign._id) setSelectedCampaignId('');
    } catch {
      toast.error('Unable to delete campaign');
    }
  };

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={JSON.stringify(error)} />;

  return (
    <main className="container mx-auto pb-8 text-white md:p-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Campaign</h1>
            <p className="text-sm text-white/60">Search, select, and review saved campaign results.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outlineGarden"
              size="sm"
              onClick={() => {
                setDraft(emptyCampaign());
                setOpenDialog('add');
              }}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Campaign ID
            </Button>
            <Button variant="outlineWater" size="sm" onClick={() => void refetch()} disabled={isFetching}>
              {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
              Reload
            </Button>
          </div>
        </div>

        <Card className="border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-xl">
          <CardHeader className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_280px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  value={q}
                  onChange={event => setQ(event.target.value)}
                  className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/40"
                  placeholder="Search saved campaign..."
                />
              </div>
              <Select value={selectedCampaignId || selectedCampaign?._id || ''} onValueChange={setSelectedCampaignId}>
                <SelectTrigger className="border-white/20 bg-white/10 text-white">
                  <SelectValue placeholder="Select Campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign._id || campaign.campaignId} value={campaign._id || campaign.campaignId}>
                      {campaign.campaignId} {campaign.name ? `- ${campaign.name}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedCampaign ? (
              <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/60">No campaign saved yet.</div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col gap-3 rounded-xl border border-white/20 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="border-blue-300/40 text-blue-100">
                        {selectedCampaign.campaignId}
                      </Badge>
                      <Badge variant="outline" className="border-emerald-300/40 text-emerald-100">
                        {selectedCampaign.status}
                      </Badge>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold">{selectedCampaign.name || 'Untitled campaign'}</h2>
                    <p className="text-sm text-white/60">{selectedCampaign.note || 'Campaign performance snapshot'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outlineWater"
                      onClick={() => {
                        setEditing(selectedCampaign);
                        setOpenDialog('edit');
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="outlineFire" disabled={isDeleting} onClick={() => void removeCampaign(selectedCampaign)}>
                      <TrashIcon className="mr-2 h-4 w-4" /> Delete
                    </Button>
                    <Button size="sm" variant="outlineGlassy" asChild>
                      <Link href={`/campaigns/${selectedCampaign.campaignId}`}>Open Result Page</Link>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {metricCards.map(({ key, label, icon: Icon }) => (
                    <Card key={key} className="border-white/20 bg-white/5 text-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
                            <p className="mt-2 text-2xl font-semibold">{formatMetric(key, selectedCampaign[key])}</p>
                          </div>
                          <div className="rounded-full bg-blue-500/20 p-3 text-blue-100">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="rounded-xl border border-white/20 bg-white/5 p-5">
                  <CardTitle className="mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-300" /> Expected JSON Structure
                  </CardTitle>
                  <pre className="overflow-x-auto rounded-lg bg-black/30 p-4 text-xs text-blue-50">
                    {JSON.stringify(
                      {
                        campaignId: selectedCampaign.campaignId,
                        name: selectedCampaign.name,
                        totalImpressions: selectedCampaign.totalImpressions,
                        clicks: selectedCampaign.clicks,
                        ctr: selectedCampaign.ctr,
                        conversions: selectedCampaign.conversions,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={openDialog === 'add'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Campaign ID</DialogTitle>
          </DialogHeader>
          <CampaignForm value={draft} onChange={setDraft} />
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button variant="outlineGarden" disabled={isAdding || !draft.campaignId} onClick={submitAdd}>
              {isAdding ? 'Saving...' : 'Save Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'edit'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          {editing && <CampaignForm value={editing} onChange={setEditing} />}
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button variant="outlineGarden" disabled={isUpdating || !editing?.campaignId} onClick={submitEdit}>
              {isUpdating ? 'Updating...' : 'Update Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CampaignPage;
