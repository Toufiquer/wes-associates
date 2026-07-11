'use client';

import Image from 'next/image';
import { EyeIcon, LockKeyhole, PencilIcon, PlusIcon, RefreshCcw, Search, ShieldBan, TrashIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import ErrorMessageComponent from '@/components/common/Error';
import LoadingComponent from '@/components/common/Loading/Loading';
import ImageUploadManagerSingle from '@/components/dashboard-ui/imageBB/ImageUploadManagerSingle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  useAddCustomerAccountMutation,
  useBulkDeleteCustomerAccountsMutation,
  useBulkUpdateCustomerAccountsMutation,
  useDeleteCustomerAccountMutation,
  useGetCustomerAccountsQuery,
  useGetCustomerAccountsSummaryQuery,
  useUpdateCustomerAccountMutation,
} from '@/redux/features/customer-accounts/customerAccountsSlice';

type ImageValue = { url: string; name: string };

interface LicenseItem {
  productTitle: string;
  orderNo?: string;
  licenseKey: string;
}

interface CustomerAccount {
  _id?: string;
  name: string;
  mobileNumber: string;
  email: string;
  password?: string;
  photo?: Partial<ImageValue>;
  isBlocked: boolean;
  licenses?: LicenseItem[];
  createdAt?: string;
}

interface CustomerAccountsResponse {
  data?: {
    customerAccounts?: CustomerAccount[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

interface SummaryResponse {
  data?: {
    overall?: {
      totalRecords: number;
      activeRecords: number;
      blockedRecords: number;
      totalLicenses: number;
    };
  };
}

const pageLimits = [10, 20, 30, 50, 100];
const emptyPhoto = { url: '', name: '' };
const emptyAccount = (): CustomerAccount => ({ name: '', mobileNumber: '', email: '', password: '', photo: emptyPhoto, isBlocked: false, licenses: [] });
const normalizePhoto = (photo?: Partial<ImageValue>): ImageValue => ({ url: photo?.url || '', name: photo?.name || '' });
const toCustomerAccountPayload = (account: CustomerAccount) => ({
  id: account._id,
  name: account.name,
  mobileNumber: account.mobileNumber,
  email: account.email,
  password: account.password || undefined,
  photo: normalizePhoto(account.photo),
  isBlocked: account.isBlocked,
});

const formatDate = (date?: string) => {
  if (!date) return 'N/A';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString();
};

const AdminAccountPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [q, setQ] = useState('');
  const [blocked, setBlocked] = useState('all');
  const [selected, setSelected] = useState<CustomerAccount[]>([]);
  const [draft, setDraft] = useState<CustomerAccount>(emptyAccount);
  const [editing, setEditing] = useState<CustomerAccount | null>(null);
  const [viewing, setViewing] = useState<CustomerAccount | null>(null);
  const [deleting, setDeleting] = useState<CustomerAccount | null>(null);
  const [openDialog, setOpenDialog] = useState<'add' | 'bulk-update' | 'bulk-delete' | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useGetCustomerAccountsQuery({
    page,
    limit,
    q,
    blocked: blocked === 'all' ? undefined : blocked,
  }) as {
    data?: CustomerAccountsResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    refetch: () => Promise<unknown>;
  };
  const { data: summaryResponse } = useGetCustomerAccountsSummaryQuery({ page: 1, limit: 10 }) as { data?: SummaryResponse };
  const [addCustomerAccount, { isLoading: isAdding }] = useAddCustomerAccountMutation();
  const [updateCustomerAccount, { isLoading: isUpdating }] = useUpdateCustomerAccountMutation();
  const [deleteCustomerAccount, { isLoading: isDeleting }] = useDeleteCustomerAccountMutation();
  const [bulkUpdateCustomerAccounts, { isLoading: isBulkUpdating }] = useBulkUpdateCustomerAccountsMutation();
  const [bulkDeleteCustomerAccounts, { isLoading: isBulkDeleting }] = useBulkDeleteCustomerAccountsMutation();

  const rows = useMemo(() => data?.data?.customerAccounts || [], [data]);
  const total = data?.data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const summary = summaryResponse?.data?.overall;

  const resetAdd = () => setDraft(emptyAccount());
  const submitAdd = async () => {
    try {
      await addCustomerAccount(toCustomerAccountPayload(draft)).unwrap();
      resetAdd();
      setOpenDialog(null);
      toast.success('Customer account created');
    } catch {
      toast.error('Failed to create customer account');
    }
  };
  const submitEdit = async () => {
    if (!editing?._id) return;
    try {
      await updateCustomerAccount(toCustomerAccountPayload(editing)).unwrap();
      setEditing(null);
      toast.success('Customer account updated');
    } catch {
      toast.error('Failed to update customer account');
    }
  };
  const submitDelete = async () => {
    if (!deleting?._id) return;
    try {
      await deleteCustomerAccount({ id: deleting._id }).unwrap();
      setSelected(prev => prev.filter(item => item._id !== deleting._id));
      setDeleting(null);
      toast.success('Customer account deleted');
    } catch {
      toast.error('Failed to delete customer account');
    }
  };
  const submitBulkUpdate = async (isBlocked: boolean) => {
    try {
      await bulkUpdateCustomerAccounts(selected.map(item => ({ id: item._id, updateData: { isBlocked } }))).unwrap();
      setSelected([]);
      setOpenDialog(null);
      toast.success('Bulk update completed');
    } catch {
      toast.error('Failed to bulk update accounts');
    }
  };
  const submitBulkDelete = async () => {
    try {
      await bulkDeleteCustomerAccounts({ ids: selected.map(item => item._id).filter((id): id is string => Boolean(id)) }).unwrap();
      setSelected([]);
      setOpenDialog(null);
      toast.success('Bulk delete completed');
    } catch {
      toast.error('Failed to bulk delete accounts');
    }
  };

  const AccountForm = ({ value, onChange }: { value: CustomerAccount; onChange: (next: CustomerAccount) => void }) => (
    <div className="grid gap-4 text-white md:grid-cols-2">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={value.name} onChange={event => onChange({ ...value, name: event.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Mobile Number</Label>
        <Input value={value.mobileNumber} onChange={event => onChange({ ...value, mobileNumber: event.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={value.email} onChange={event => onChange({ ...value, email: event.target.value })} disabled={Boolean(value._id)} />
      </div>
      <div className="space-y-2">
        <Label>{value._id ? 'Update Password' : 'Password'}</Label>
        <Input
          type="password"
          value={value.password || ''}
          onChange={event => onChange({ ...value, password: event.target.value })}
          placeholder={value._id ? 'Leave blank to keep current password' : 'Password'}
        />
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
        <Checkbox checked={value.isBlocked} onCheckedChange={checked => onChange({ ...value, isBlocked: !!checked })} />
        <Label>Block user</Label>
      </div>
      <div className="md:col-span-2">
        <ImageUploadManagerSingle value={normalizePhoto(value.photo)} onChange={next => onChange({ ...value, photo: next })} label="Photo" />
      </div>
    </div>
  );

  const renderActions = (item: CustomerAccount) => (
    <div className="flex justify-end gap-2">
      <Button size="icon" variant="outlineWater" onClick={() => setViewing(item)} className="min-w-1">
        <EyeIcon className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outlineWater" onClick={() => setEditing({ ...item, password: '' })} className="min-w-1">
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive" onClick={() => setDeleting(item)} className="min-w-1">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );

  const AccountCard = ({ item }: { item: CustomerAccount }) => (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex gap-3">
        <Checkbox
          checked={selected.some(row => row._id === item._id)}
          onCheckedChange={checked => setSelected(prev => (checked ? [...prev, item] : prev.filter(row => row._id !== item._id)))}
        />
        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white/10">
          {item.photo?.url ? <Image src={item.photo.url} alt={item.name || item.email} fill className="object-cover" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold">{item.name || 'No name'}</h3>
          <p className="truncate text-sm text-white/60">{item.email}</p>
          <Badge className={item.isBlocked ? 'bg-red-500/20 text-red-100' : 'bg-emerald-500/20 text-emerald-100'}>
            {item.isBlocked ? 'Blocked' : 'Active'}
          </Badge>
        </div>
      </div>
      <div className="mt-3">{renderActions(item)}</div>
    </div>
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message="Unable to load customer accounts." />;

  return (
    <main className="container mx-auto text-white md:p-4">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black">Customer Accounts</h1>
          <p className="text-sm text-white/60">Create, block, update, and review customer licenses.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outlineWater" onClick={() => refetch()}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /> Reload
          </Button>
          <Button variant="outlineGarden" onClick={() => setOpenDialog('add')}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add account
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-white/50">Summary</p>
          <p className="text-2xl font-black">{summary?.totalRecords || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-white/50">Active</p>
          <p className="text-2xl font-black text-emerald-100">{summary?.activeRecords || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-white/50">Blocked</p>
          <p className="text-2xl font-black text-red-100">{summary?.blockedRecords || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-white/50">Licenses</p>
          <p className="text-2xl font-black text-blue-100">{summary?.totalLicenses || 0}</p>
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={q}
            onChange={event => {
              setQ(event.target.value);
              setPage(1);
            }}
            placeholder="Filter by name, email, phone, license..."
            className="pl-10"
          />
        </div>
        <Select
          value={blocked}
          onValueChange={value => {
            setBlocked(value);
            setPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Blocked</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outlineWater" disabled={!selected.length || isBulkUpdating} onClick={() => setOpenDialog('bulk-update')}>
            <ShieldBan className="mr-2 h-4 w-4" /> Bulk Update
          </Button>
          <Button variant="destructive" disabled={!selected.length} onClick={() => setOpenDialog('bulk-delete')}>
            <TrashIcon className="mr-2 h-4 w-4" /> Bulk Delete
          </Button>
        </div>
      </div>

      <div className="mb-3 text-sm text-white/70">Selected: {selected.length}</div>
      <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox checked={selected.length === rows.length && rows.length > 0} onCheckedChange={checked => setSelected(checked ? rows : [])} />
              </TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Licenses</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(item => (
              <TableRow key={item._id}>
                <TableCell>
                  <Checkbox
                    checked={selected.some(row => row._id === item._id)}
                    onCheckedChange={checked => setSelected(prev => (checked ? [...prev, item] : prev.filter(row => row._id !== item._id)))}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
                    {item.photo?.url ? <Image src={item.photo.url} alt={item.name || item.email} fill className="object-cover" /> : null}
                  </div>
                </TableCell>
                <TableCell>{item.name || 'N/A'}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.mobileNumber || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={item.isBlocked ? 'bg-red-500/20 text-red-100' : 'bg-emerald-500/20 text-emerald-100'}>
                    {item.isBlocked ? 'Blocked' : 'Active'}
                  </Badge>
                </TableCell>
                <TableCell>{item.licenses?.length || 0}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>{renderActions(item)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid gap-3 md:hidden">
        {rows.map(item => (
          <AccountCard key={item._id} item={item} />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Pagination className="text-white">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={event => {
                  event.preventDefault();
                  setPage(prev => Math.max(1, prev - 1));
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>
                Page {page} of {totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={event => {
                  event.preventDefault();
                  setPage(prev => Math.min(totalPages, prev + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Select
          value={String(limit)}
          onValueChange={value => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageLimits.map(item => (
              <SelectItem key={item} value={String(item)}>
                {item} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={openDialog === 'add'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/20 bg-slate-950 text-white sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add account</DialogTitle>
          </DialogHeader>
          <AccountForm value={draft} onChange={setDraft} />
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button disabled={isAdding} onClick={submitAdd}>
              {isAdding ? 'Adding...' : 'Add account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/20 bg-slate-950 text-white sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Update account</DialogTitle>
          </DialogHeader>
          {editing && <AccountForm value={editing} onChange={setEditing} />}
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button disabled={isUpdating} onClick={submitEdit}>
              {isUpdating ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!viewing} onOpenChange={open => !open && setViewing(null)}>
        <DialogContent className="border-white/20 bg-slate-950 text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer account</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black">{viewing.name || 'No name'}</h2>
                <p className="text-white/60">{viewing.email}</p>
              </div>
              <p>Mobile: {viewing.mobileNumber || 'N/A'}</p>
              <p>Status: {viewing.isBlocked ? 'Blocked' : 'Active'}</p>
              <div>
                <h3 className="mb-2 font-bold">Licenses</h3>
                {viewing.licenses?.length ? (
                  viewing.licenses.map(item => (
                    <div key={item.licenseKey} className="mb-2 rounded-lg bg-white/5 p-3">
                      <p>{item.productTitle}</p>
                      <p className="font-mono text-blue-200">{item.licenseKey}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">No licenses found.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleting} onOpenChange={open => !open && setDeleting(null)}>
        <DialogContent className="border-white/20 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>Delete account?</DialogTitle>
          </DialogHeader>
          <p>
            Delete <strong>{deleting?.email}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeleting} onClick={submitDelete}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog === 'bulk-update'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="border-white/20 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>Bulk Update</DialogTitle>
          </DialogHeader>
          <p>Update {selected.length} selected accounts.</p>
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => submitBulkUpdate(false)} disabled={isBulkUpdating}>
              <LockKeyhole className="mr-2 h-4 w-4" /> Unblock
            </Button>
            <Button variant="destructive" onClick={() => submitBulkUpdate(true)} disabled={isBulkUpdating}>
              <ShieldBan className="mr-2 h-4 w-4" /> Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog === 'bulk-delete'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="border-white/20 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>Bulk Delete</DialogTitle>
          </DialogHeader>
          <p>Delete {selected.length} selected accounts?</p>
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isBulkDeleting} onClick={submitBulkDelete}>
              {isBulkDeleting ? 'Deleting...' : 'Delete selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminAccountPage;
