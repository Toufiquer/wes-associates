'use client';

import { EyeIcon, Loader2, PencilIcon, PlusIcon, RefreshCcw, Search, TrashIcon, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import ErrorMessageComponent from '@/components/common/Error';
import LoadingComponent from '@/components/common/Loading/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useGetCustomerAccountsQuery } from '@/redux/features/customer-accounts/customerAccountsSlice';
import {
  useAddMemberMutation,
  useAddMembershipUserMutation,
  useDeleteMemberMutation,
  useDeleteMembershipUserMutation,
  useGetMembersQuery,
  useGetMembersSummaryQuery,
  useGetMembershipUsersQuery,
  useUpdateMemberMutation,
  useUpdateMembershipUserMutation,
} from '@/redux/features/members/membersSlice';
import { useGetProductsQuery } from '@/redux/features/products/productsSlice';

interface MemberPlan {
  _id?: string;
  title: string;
  description: string;
  realPrice: number;
  discountPrice: number;
  endDiscount: string;
  productIds?: string[];
  createdAt?: string;
}

interface ProductItem {
  _id?: string;
  title?: string;
  productUID?: string;
  status?: string;
}

interface CustomerAccount {
  _id?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  isBlocked?: boolean;
}

interface MembershipUser {
  orderId: string;
  orderNo?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  account?: CustomerAccount;
  memberships?: Array<{ id: string; title: string; price: number }>;
  totalAmount?: number;
  createdAt?: string;
}

interface MembersResponse {
  data?: {
    members?: MemberPlan[];
    total?: number;
  };
}

interface MembershipUsersResponse {
  data?: {
    membershipUsers?: MembershipUser[];
    total?: number;
  };
}

interface CustomerAccountsResponse {
  data?: {
    customerAccounts?: CustomerAccount[];
  };
}

interface ProductsResponse {
  data?: {
    products?: ProductItem[];
  };
}

interface SummaryResponse {
  data?: {
    overall?: {
      totalRecords: number;
      activeDiscounts: number;
      totalRealPrice: number;
      totalDiscountPrice: number;
    };
  };
}

const pageLimits = [10, 20, 30, 50, 100];
const glassDialogClass = 'border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-2xl';
const emptyPlan = (): MemberPlan => ({ title: '', description: '', realPrice: 0, discountPrice: 0, endDiscount: '', productIds: [] });

const toInputDate = (date?: string) => {
  if (!date) return '';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
};

const formatDate = (date?: string) => {
  if (!date) return 'N/A';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString();
};

const formatMoney = (value?: number) => `${(Number(value) || 0).toLocaleString('en-US')}৳`;

const toPlanPayload = (plan: MemberPlan) => ({
  id: plan._id,
  title: plan.title,
  description: plan.description,
  realPrice: Number(plan.realPrice) || 0,
  discountPrice: Number(plan.discountPrice) || 0,
  endDiscount: plan.endDiscount || undefined,
  productIds: plan.productIds || [],
});

const MembershipPage = () => {
  const [planPage, setPlanPage] = useState(1);
  const [planLimit, setPlanLimit] = useState(10);
  const [planSearch, setPlanSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userLimit, setUserLimit] = useState(10);
  const [userSearch, setUserSearch] = useState('');
  const [draftPlan, setDraftPlan] = useState<MemberPlan>(emptyPlan);
  const [editingPlan, setEditingPlan] = useState<MemberPlan | null>(null);
  const [viewingPlan, setViewingPlan] = useState<MemberPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<MemberPlan | null>(null);
  const [accountSearch, setAccountSearch] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<CustomerAccount | null>(null);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<MembershipUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<MembershipUser | null>(null);
  const [openDialog, setOpenDialog] = useState<'add-combo' | 'add-member' | null>(null);

  const {
    data: plansResponse,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetMembersQuery({ page: planPage, limit: planLimit, q: planSearch }) as {
    data?: MembersResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    refetch: () => Promise<unknown>;
  };
  const { data: summaryResponse } = useGetMembersSummaryQuery({ page: 1, limit: 10 }) as { data?: SummaryResponse };
  const { data: productsResponse, isFetching: isProductsFetching } = useGetProductsQuery({ page: 1, limit: 1000 }) as {
    data?: ProductsResponse;
    isFetching: boolean;
  };
  const {
    data: membershipUsersResponse,
    isLoading: isUsersLoading,
    isError: isUsersError,
    isFetching: isUsersFetching,
    refetch: refetchUsers,
  } = useGetMembershipUsersQuery({ page: userPage, limit: userLimit, q: userSearch }) as {
    data?: MembershipUsersResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    refetch: () => Promise<unknown>;
  };
  const { data: accountsResponse, isFetching: isSearchingAccounts } = useGetCustomerAccountsQuery(
    { page: 1, limit: 8, q: accountSearch },
    { skip: accountSearch.trim().length < 5 },
  ) as {
    data?: CustomerAccountsResponse;
    isFetching: boolean;
  };

  const [addPlan, { isLoading: isAddingPlan }] = useAddMemberMutation();
  const [updatePlan, { isLoading: isUpdatingPlan }] = useUpdateMemberMutation();
  const [deletePlan, { isLoading: isDeletingPlan }] = useDeleteMemberMutation();
  const [addMembershipUser, { isLoading: isAddingUser }] = useAddMembershipUserMutation();
  const [updateMembershipUser, { isLoading: isUpdatingUser }] = useUpdateMembershipUserMutation();
  const [deleteMembershipUser, { isLoading: isDeletingUser }] = useDeleteMembershipUserMutation();

  const plans = useMemo(() => plansResponse?.data?.members || [], [plansResponse]);
  const planTotal = plansResponse?.data?.total || 0;
  const planTotalPages = Math.max(1, Math.ceil(planTotal / planLimit));
  const membershipUsers = useMemo(() => membershipUsersResponse?.data?.membershipUsers || [], [membershipUsersResponse]);
  const userTotal = membershipUsersResponse?.data?.total || 0;
  const userTotalPages = Math.max(1, Math.ceil(userTotal / userLimit));
  const accounts = accountsResponse?.data?.customerAccounts || [];
  const products = productsResponse?.data?.products || [];
  const summary = summaryResponse?.data?.overall;

  const togglePlanId = (planId: string, checked: boolean) => {
    setSelectedPlanIds(prev => (checked ? Array.from(new Set([...prev, planId])) : prev.filter(id => id !== planId)));
  };

  const validatePlan = (plan: MemberPlan) => {
    if (!plan.title.trim()) {
      toast.error('Title is required.');
      return false;
    }
    return true;
  };

  const toggleProductId = (plan: MemberPlan, productId: string, checked: boolean, onChange: (next: MemberPlan) => void) => {
    const current = plan.productIds || [];
    onChange({
      ...plan,
      productIds: checked ? Array.from(new Set([...current, productId])) : current.filter(id => id !== productId),
    });
  };

  const getSelectedProducts = (plan?: MemberPlan | null) => {
    const selectedIds = new Set(plan?.productIds || []);
    return products.filter(product => product._id && selectedIds.has(product._id));
  };

  const submitAddPlan = async () => {
    if (!validatePlan(draftPlan)) return;
    try {
      await addPlan(toPlanPayload(draftPlan)).unwrap();
      setDraftPlan(emptyPlan());
      setOpenDialog(null);
      toast.success('Plan added');
    } catch {
      toast.error('Failed to add plan');
    }
  };

  const submitEditPlan = async () => {
    if (!editingPlan?._id || !validatePlan(editingPlan)) return;
    try {
      await updatePlan(toPlanPayload(editingPlan)).unwrap();
      setEditingPlan(null);
      toast.success('Combo updated');
    } catch {
      toast.error('Failed to update combo');
    }
  };

  const submitDeletePlan = async () => {
    if (!deletingPlan?._id) return;
    try {
      await deletePlan({ id: deletingPlan._id }).unwrap();
      setDeletingPlan(null);
      toast.success('Combo deleted');
    } catch {
      toast.error('Failed to delete combo');
    }
  };

  const submitAddMembershipUser = async () => {
    if (!selectedAccount?._id) {
      toast.error('Please select an account.');
      return;
    }
    if (!selectedPlanIds.length) {
      toast.error('Please select at least one membership.');
      return;
    }
    try {
      await addMembershipUser({ accountId: selectedAccount._id, membershipIds: selectedPlanIds }).unwrap();
      setOpenDialog(null);
      setSelectedAccount(null);
      setAccountSearch('');
      setSelectedPlanIds([]);
      toast.success('Member added');
    } catch {
      toast.error('Failed to add member');
    }
  };

  const openUpdateUser = (user: MembershipUser) => {
    setEditingUser(user);
    setSelectedPlanIds((user.memberships || []).map(item => item.id).filter(Boolean));
  };

  const submitUpdateMembershipUser = async () => {
    if (!editingUser?.orderId) return;
    if (!selectedPlanIds.length) {
      toast.error('Please select at least one membership.');
      return;
    }
    try {
      await updateMembershipUser({ orderId: editingUser.orderId, membershipIds: selectedPlanIds }).unwrap();
      setEditingUser(null);
      setSelectedPlanIds([]);
      toast.success('Member memberships updated');
    } catch {
      toast.error('Failed to update member memberships');
    }
  };

  const submitDeleteMembershipUser = async () => {
    if (!deletingUser?.orderId) return;
    try {
      await deleteMembershipUser({ orderId: deletingUser.orderId }).unwrap();
      setDeletingUser(null);
      toast.success('Member removed');
    } catch {
      toast.error('Failed to remove member');
    }
  };

  const renderPlanForm = (value: MemberPlan, onChange: (next: MemberPlan) => void) => (
    <div className="grid gap-4 text-white md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <Label>Title</Label>
        <Input value={value.title} onChange={event => onChange({ ...value, title: event.target.value })} placeholder="Gold Plan" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Description</Label>
        <Textarea
          value={value.description}
          onChange={event => onChange({ ...value, description: event.target.value })}
          placeholder="Describe benefits"
          className="min-h-28"
        />
      </div>
      <div className="space-y-2">
        <Label>Real Price</Label>
        <Input type="number" value={value.realPrice} onChange={event => onChange({ ...value, realPrice: Number(event.target.value) })} />
      </div>
      <div className="space-y-2">
        <Label>Discount Price</Label>
        <Input type="number" value={value.discountPrice} onChange={event => onChange({ ...value, discountPrice: Number(event.target.value) })} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>End date</Label>
        <Input type="date" value={toInputDate(value.endDiscount)} onChange={event => onChange({ ...value, endDiscount: event.target.value })} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Label>Products</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">{value.productIds?.length || 0} selected</span>
            <Button
              type="button"
              size="sm"
              variant="outlineWater"
              disabled={!products.length || isProductsFetching}
              onClick={() =>
                onChange({
                  ...value,
                  productIds: products.map(product => product._id).filter((id): id is string => Boolean(id)),
                })
              }
            >
              Check all
            </Button>
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto rounded-xl border border-white/10">
          {isProductsFetching ? (
            <div className="flex items-center justify-center gap-2 p-5 text-sm text-white/60">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading products...
            </div>
          ) : products.length ? (
            products.map(product => {
              const productId = product._id || '';
              return (
                <label
                  key={productId || product.title}
                  className="flex cursor-pointer items-start gap-3 border-b border-white/10 p-3 last:border-b-0 hover:bg-white/5"
                >
                  <Checkbox
                    checked={Boolean(productId && value.productIds?.includes(productId))}
                    onCheckedChange={checked => productId && toggleProductId(value, productId, checked === true, onChange)}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-black">{product.title || 'Untitled product'}</span>
                    <span className="block text-xs text-white/50">{product.productUID || productId || 'No product id'}</span>
                  </span>
                </label>
              );
            })
          ) : (
            <div className="p-5 text-center text-sm text-white/60">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );

  const PlanCheckboxes = () => (
    <div className="grid gap-2">
      {plans.map(plan => (
        <label key={plan._id || plan.title} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <Checkbox
            checked={Boolean(plan._id && selectedPlanIds.includes(plan._id))}
            onCheckedChange={checked => plan._id && togglePlanId(plan._id, checked === true)}
          />
          <span className="min-w-0 flex-1">
            <span className="block font-black">{plan.title}</span>
            <span className="block text-sm text-white/60">
              {formatMoney(plan.discountPrice || plan.realPrice)} - Ends {formatDate(plan.endDiscount)}
            </span>
          </span>
        </label>
      ))}
      {!plans.length && <div className="rounded-xl border border-dashed border-white/20 p-5 text-center text-sm text-white/60">No combo plans found.</div>}
    </div>
  );

  if (isLoading || isUsersLoading) return <LoadingComponent />;
  if (isError || isUsersError) return <ErrorMessageComponent message="Unable to load membership data." />;

  return (
    <main className="container mx-auto text-white md:p-4">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black">Membership</h1>
          <p className="text-sm text-white/60">Manage membership combo plans and users who have membership access.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outlineWater"
            onClick={() => {
              refetch();
              refetchUsers();
            }}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${isFetching || isUsersFetching ? 'animate-spin' : ''}`} /> Reload
          </Button>
          <Button variant="outlineGarden" onClick={() => setOpenDialog('add-combo')}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Plan
          </Button>
          <Button variant="outlineGarden" onClick={() => setOpenDialog('add-member')}>
            <UserPlus className="mr-2 h-4 w-4" /> Add member
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-white/50">Combo Plans</p>
          <p className="text-2xl font-black">{summary?.totalRecords || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-white/50">Active Discount</p>
          <p className="text-2xl font-black text-emerald-100">{summary?.activeDiscounts || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-white/50">Member Users</p>
          <p className="text-2xl font-black text-blue-100">{userTotal}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-white/50">Discount Price</p>
          <p className="text-2xl font-black text-purple-100">{formatMoney(summary?.totalDiscountPrice)}</p>
        </div>
      </div>

      <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Member Ship plan</h2>
            <p className="text-sm text-white/60">Combo plans users can receive.</p>
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              value={planSearch}
              onChange={event => {
                setPlanSearch(event.target.value);
                setPlanPage(1);
              }}
              placeholder="Search combo plans..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Real Price</TableHead>
                <TableHead>Discount Price</TableHead>
                <TableHead>End date</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(plan => (
                <TableRow key={plan._id}>
                  <TableCell className="font-bold">{plan.title || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate">{plan.description || 'N/A'}</TableCell>
                  <TableCell>{formatMoney(plan.realPrice)}</TableCell>
                  <TableCell>{formatMoney(plan.discountPrice)}</TableCell>
                  <TableCell>{formatDate(plan.endDiscount)}</TableCell>
                  <TableCell>{plan.productIds?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outlineWater" onClick={() => setViewingPlan(plan)} className="min-w-1">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outlineWater"
                        onClick={() => setEditingPlan({ ...plan, endDiscount: toInputDate(plan.endDiscount) })}
                        className="min-w-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => setDeletingPlan(plan)} className="min-w-1">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid gap-3 md:hidden">
          {plans.map(plan => (
            <div key={plan._id} className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black">{plan.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/60">{plan.description || 'No description'}</p>
                  <p className="mt-2 text-xs text-white/50">{plan.productIds?.length || 0} selected products</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-100">{formatMoney(plan.discountPrice || plan.realPrice)}</Badge>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button size="icon" variant="outlineWater" onClick={() => setViewingPlan(plan)} className="min-w-1">
                  <EyeIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outlineWater"
                  onClick={() => setEditingPlan({ ...plan, endDiscount: toInputDate(plan.endDiscount) })}
                  className="min-w-1"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => setDeletingPlan(plan)} className="min-w-1">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Pagination className="text-white">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    setPlanPage(prev => Math.max(1, prev - 1));
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>
                  Page {planPage} of {planTotalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    setPlanPage(prev => Math.min(planTotalPages, prev + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Select
            value={String(planLimit)}
            onValueChange={value => {
              setPlanLimit(Number(value));
              setPlanPage(1);
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
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Users got the membership</h2>
            <p className="text-sm text-white/60">Search, update, or remove membership access.</p>
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              value={userSearch}
              onChange={event => {
                setUserSearch(event.target.value);
                setUserPage(1);
              }}
              placeholder="Search member users..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User info</TableHead>
                <TableHead>Membership info</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membershipUsers.map(user => (
                <TableRow key={user.orderId}>
                  <TableCell>
                    <p className="font-bold">{user.account?.name || user.customerName || 'N/A'}</p>
                    <p className="text-xs text-white/60">{user.account?.mobileNumber || user.customerPhone || 'N/A'}</p>
                    <p className="text-xs text-white/60">{user.account?.email || user.customerEmail || 'N/A'}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex max-w-md flex-wrap gap-1">
                      {(user.memberships || []).map(item => (
                        <Badge key={`${user.orderId}-${item.id}`} className="bg-emerald-500/20 text-emerald-100">
                          {item.title}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{user.orderNo || 'N/A'}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outlineWater" onClick={() => openUpdateUser(user)} className="min-w-1">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => setDeletingUser(user)} className="min-w-1">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid gap-3 md:hidden">
          {membershipUsers.map(user => (
            <div key={user.orderId} className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <h3 className="font-black">{user.account?.name || user.customerName || 'N/A'}</h3>
              <p className="text-xs text-white/60">{user.account?.mobileNumber || user.customerPhone || 'N/A'}</p>
              <p className="text-xs text-white/60">{user.account?.email || user.customerEmail || 'N/A'}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {(user.memberships || []).map(item => (
                  <Badge key={`${user.orderId}-${item.id}`} className="bg-emerald-500/20 text-emerald-100">
                    {item.title}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button size="icon" variant="outlineWater" onClick={() => openUpdateUser(user)} className="min-w-1">
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => setDeletingUser(user)} className="min-w-1">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Pagination className="text-white">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    setUserPage(prev => Math.max(1, prev - 1));
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>
                  Page {userPage} of {userTotalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    setUserPage(prev => Math.min(userTotalPages, prev + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Select
            value={String(userLimit)}
            onValueChange={value => {
              setUserLimit(Number(value));
              setUserPage(1);
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
      </section>

      <Dialog open={openDialog === 'add-combo'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className={`max-h-[90vh] mt-12 overflow-y-auto sm:max-w-3xl ${glassDialogClass}`}>
          <DialogHeader>
            <DialogTitle>Add Plan</DialogTitle>
          </DialogHeader>
          {renderPlanForm(draftPlan, setDraftPlan)}
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button disabled={isAddingPlan} onClick={submitAddPlan}>
              {isAddingPlan ? 'Adding...' : 'Add Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingPlan} onOpenChange={open => !open && setEditingPlan(null)}>
        <DialogContent className={`max-h-[90vh] overflow-y-auto sm:max-w-3xl ${glassDialogClass}`}>
          <DialogHeader>
            <DialogTitle>Update Combo</DialogTitle>
          </DialogHeader>
          {editingPlan && renderPlanForm(editingPlan, setEditingPlan)}
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setEditingPlan(null)}>
              Cancel
            </Button>
            <Button disabled={isUpdatingPlan} onClick={submitEditPlan}>
              {isUpdatingPlan ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingPlan} onOpenChange={open => !open && setViewingPlan(null)}>
        <DialogContent className={`max-h-[90vh] overflow-y-auto sm:max-w-3xl ${glassDialogClass}`}>
          <DialogHeader>
            <DialogTitle>View Combo</DialogTitle>
          </DialogHeader>
          {viewingPlan && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black">{viewingPlan.title || 'N/A'}</h2>
                <p className="mt-2 text-sm text-white/60">{viewingPlan.description || 'No description'}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/50">Real Price</p>
                  <p className="font-black">{formatMoney(viewingPlan.realPrice)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/50">Discount Price</p>
                  <p className="font-black">{formatMoney(viewingPlan.discountPrice)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/50">End date</p>
                  <p className="font-black">{formatDate(viewingPlan.endDiscount)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Available products</Label>
                <div className="rounded-xl border border-white/10">
                  {getSelectedProducts(viewingPlan).length ? (
                    getSelectedProducts(viewingPlan).map(product => (
                      <div key={product._id || product.title} className="flex items-start gap-3 border-b border-white/10 p-3 last:border-b-0">
                        <Checkbox checked disabled />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-black">{product.title || 'Untitled product'}</p>
                          <p className="text-xs text-white/50">{product.productUID || product._id}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 text-center text-sm text-white/60">No available products selected.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingPlan} onOpenChange={open => !open && setDeletingPlan(null)}>
        <DialogContent className={glassDialogClass}>
          <DialogHeader>
            <DialogTitle>Delete combo?</DialogTitle>
          </DialogHeader>
          <p>
            Delete <strong>{deletingPlan?.title}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setDeletingPlan(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeletingPlan} onClick={submitDeletePlan}>
              {isDeletingPlan ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === 'add-member'}
        onOpenChange={open => {
          if (!open) {
            setOpenDialog(null);
            setSelectedAccount(null);
            setAccountSearch('');
            setSelectedPlanIds([]);
          }
        }}
      >
        <DialogContent className={`max-h-[90vh] overflow-y-auto sm:max-w-3xl ${glassDialogClass}`}>
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Search account</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input value={accountSearch} onChange={event => setAccountSearch(event.target.value)} placeholder="01711" className="pl-10" />
              </div>
              <p className="text-xs text-white/50">Search starts after 5 characters.</p>
            </div>

            <div className="rounded-xl border border-white/10">
              {isSearchingAccounts ? (
                <div className="flex items-center justify-center gap-2 p-5 text-sm text-white/60">
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching accounts...
                </div>
              ) : accountSearch.trim().length < 5 ? (
                <div className="p-5 text-center text-sm text-white/60">Type at least 5 characters to search accounts.</div>
              ) : accounts.length ? (
                accounts.map(account => (
                  <button
                    key={account._id || account.email}
                    type="button"
                    onClick={() => setSelectedAccount(account)}
                    className={`block w-full border-b border-white/10 p-3 text-left last:border-b-0 ${selectedAccount?._id === account._id ? 'bg-blue-600/30' : 'hover:bg-white/5'}`}
                  >
                    <span className="block font-black">{account.name || 'N/A'}</span>
                    <span className="block text-xs text-white/60">
                      {account.mobileNumber || 'N/A'} - {account.email || 'N/A'}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-5 text-center text-sm text-white/60">No account found.</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Select membership</Label>
              <PlanCheckboxes />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button disabled={isAddingUser} onClick={submitAddMembershipUser}>
              {isAddingUser ? 'Adding...' : 'Add member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={open => !open && setEditingUser(null)}>
        <DialogContent className={`max-h-[90vh] overflow-y-auto sm:max-w-3xl ${glassDialogClass}`}>
          <DialogHeader>
            <DialogTitle>Update member</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-black">{editingUser.account?.name || editingUser.customerName || 'N/A'}</p>
                <p className="text-sm text-white/60">
                  {editingUser.account?.mobileNumber || editingUser.customerPhone || 'N/A'} - {editingUser.account?.email || editingUser.customerEmail || 'N/A'}
                </p>
              </div>
              <PlanCheckboxes />
            </div>
          )}
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button disabled={isUpdatingUser} onClick={submitUpdateMembershipUser}>
              {isUpdatingUser ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingUser} onOpenChange={open => !open && setDeletingUser(null)}>
        <DialogContent className={glassDialogClass}>
          <DialogHeader>
            <DialogTitle>Remove member?</DialogTitle>
          </DialogHeader>
          <p>
            Remove membership from <strong>{deletingUser?.account?.name || deletingUser?.customerName || deletingUser?.customerPhone}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outlineWater" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeletingUser} onClick={submitDeleteMembershipUser}>
              {isDeletingUser ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default MembershipPage;
