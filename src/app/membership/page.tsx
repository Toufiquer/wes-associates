'use client';

import Image from 'next/image';
import { Download, Loader2, Package, ShieldCheck } from 'lucide-react';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { META_PIXEL_CURRENCY, trackMetaEvent } from '@/lib/facebook-pixel';

type ImageValue = { url: string; name: string };

interface MemberPlan {
  _id?: string;
  title: string;
  description?: string;
  realPrice?: number;
  discountPrice?: number;
  endDiscount?: string;
  productIds?: string[];
}

interface ProductItem {
  _id?: string;
  productUID?: string;
  title: string;
  description?: string;
  bestfor?: string;
  real_price?: number;
  discount_price?: number;
  primary_images?: ImageValue;
  uploadProduct?: Partial<ImageValue>;
  liveUrl?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface MembersResponse {
  data?: {
    members?: MemberPlan[];
  };
}

interface ProductsResponse {
  data?: {
    products?: ProductItem[];
  };
}

interface CheckMemberResponse {
  data?: {
    membershipIds?: string[];
  };
  message?: string;
}

interface CustomerAccountResponse {
  data?: {
    name?: string;
    email?: string;
    mobileNumber?: string;
  };
}

const emptyCustomerInfo: CustomerInfo = { name: '', email: '', phone: '' };
const formatPrice = (value?: unknown) => `${(Number(value) || 0).toLocaleString('en-US')}৳`;
const stripHtml = (value?: string) =>
  (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getPlanPrice = (plan: MemberPlan) => Number(plan.discountPrice) || Number(plan.realPrice) || 0;
const getProductPrice = (product: ProductItem) => Number(product.discount_price) || Number(product.real_price) || 0;

const MembershipPageContent = () => {
  const [memberPlanIds, setMemberPlanIds] = useState<string[]>([]);
  const [plans, setPlans] = useState<MemberPlan[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isCheckingAccount, setIsCheckingAccount] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(emptyCustomerInfo);

  const selectedPlan = useMemo(() => plans.find(plan => plan._id === selectedPlanId) || null, [plans, selectedPlanId]);

  const fetchPlans = useCallback(async () => {
    setIsLoadingPlans(true);
    try {
      const response = await fetch('/api/members/v1?page=1&limit=100');
      const result = (await response.json()) as MembersResponse;
      if (!response.ok) throw new Error('Unable to load membership plans.');
      const nextPlans = result.data?.members || [];
      setPlans(nextPlans);
      setSelectedPlanId(prev => prev || nextPlans[0]?._id || '');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load membership plans.');
    } finally {
      setIsLoadingPlans(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch('/api/products/v1?page=1&limit=1000');
      const result = (await response.json()) as ProductsResponse;
      if (!response.ok) throw new Error('Unable to load products.');
      setProducts(result.data?.products || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load products.');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const checkMembershipByPhone = useCallback(async (phone: string) => {
    const response = await fetch(`/api/members/v1?checkMobile=${encodeURIComponent(phone)}`);
    const result = (await response.json()) as CheckMemberResponse;
    if (!response.ok) throw new Error(result?.message || 'Unable to check membership.');
    const ownedIds = Array.isArray(result?.data?.membershipIds) ? result.data.membershipIds.map(String) : [];
    setMemberPlanIds(ownedIds);
  }, []);

  const fetchAccountMembership = useCallback(async () => {
    setIsCheckingAccount(true);
    try {
      const response = await fetch('/api/customer-accounts/v1?me=true');
      if (!response.ok) return;
      const result = (await response.json()) as CustomerAccountResponse;
      const account = result.data;
      if (!account) return;
      setCustomerInfo({
        name: account.name || '',
        email: account.email || '',
        phone: account.mobileNumber || '',
      });
      if (account.mobileNumber) await checkMembershipByPhone(account.mobileNumber);
    } catch {
      setMemberPlanIds([]);
    } finally {
      setIsCheckingAccount(false);
    }
  }, [checkMembershipByPhone]);

  useEffect(() => {
    fetchPlans();
    fetchProducts();
    fetchAccountMembership();
  }, [fetchAccountMembership, fetchPlans, fetchProducts]);

  const openPayment = (plan: MemberPlan) => {
    if (!plan._id) {
      toast.error('Membership plan is missing.');
      return;
    }
    setSelectedPlanId(plan._id);
    setIsPaymentOpen(true);
  };

  const completeMembershipPayment = async () => {
    if (!selectedPlan) {
      toast.error('Please select a membership plan.');
      return;
    }
    if (!customerInfo.name.trim() || !customerInfo.email.trim() || !customerInfo.phone.trim()) {
      toast.error('Name, email, and mobile number are required.');
      return;
    }

    const total = getPlanPrice(selectedPlan);
    setIsOrdering(true);
    try {
      const response = await fetch('/api/orders/cart-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name.trim(),
          customerEmail: customerInfo.email.trim(),
          customerPhone: customerInfo.phone.trim(),
          shippingAddress: '',
          items: [
            {
              productId: `membership:${selectedPlan._id || selectedPlan.title}`,
              title: `Membership - ${selectedPlan.title}`,
              quantity: 1,
              price: total,
            },
          ],
          subtotal: total,
          shippingCharge: 0,
          discount: Math.max(0, Number(selectedPlan.realPrice || 0) - total),
          totalAmount: total,
          paymentMethod: 'manual-membership',
          paymentStatus: 'paid',
          deliveryStatus: 'delivered',
          orderStatus: 'completed',
          note: `Membership payment for ${selectedPlan.title}.`,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || result?.error || 'Unable to confirm membership payment.');
      trackMetaEvent('Purchase', {
        value: total,
        currency: META_PIXEL_CURRENCY,
        content_ids: [`membership:${selectedPlan._id || selectedPlan.title}`],
        content_name: `Membership - ${selectedPlan.title}`,
        content_type: 'product',
        num_items: 1,
      });
      await fetchAccountMembership();
      setIsPaymentOpen(false);
      toast.success('Membership payment confirmed. Downloads are available now.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to confirm membership payment.');
    } finally {
      setIsOrdering(false);
    }
  };

  const getPlanProducts = (plan: MemberPlan) => {
    const selectedIds = new Set(plan.productIds || []);
    return products.filter(product => product._id && selectedIds.has(product._id));
  };

  const renderProductCard = (product: ProductItem, index: number) => {
    const downloadUrl = product.uploadProduct?.url || product.liveUrl || '';

    return (
      <article
        key={product._id || product.productUID || `${product.title}-${index}`}
        className="flex gap-3 border-b border-slate-200 py-3 last:border-b-0 sm:block sm:overflow-hidden sm:rounded-xl sm:border sm:bg-white sm:py-0 sm:shadow-sm"
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-48 sm:w-full sm:rounded-none">
          {product.primary_images?.url ? (
            <Image
              src={product.primary_images.url}
              alt={product.title || 'Product image'}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <Package className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2 sm:p-4">
          <h3 className="line-clamp-2 text-sm font-black text-slate-950 sm:text-lg">{product.title || 'Untitled product'}</h3>
          <p className="line-clamp-2 text-xs text-slate-500">{stripHtml(product.description) || product.bestfor || 'No product description available.'}</p>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span className="text-slate-500">Price</span>
            <span className="font-black text-blue-600">{formatPrice(getProductPrice(product))}</span>
          </div>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download={product.uploadProduct?.name || product.title}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-black text-white hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" /> Download
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-200 px-3 py-2 text-sm font-black text-slate-500"
            >
              <Download className="h-4 w-4" /> No Download
            </button>
          )}
        </div>
      </article>
    );
  };

  const renderPlan = (plan: MemberPlan) => {
    const isPurchased = Boolean(plan._id && memberPlanIds.includes(plan._id));
    const planProducts = getPlanProducts(plan);

    return (
      <article key={plan._id || plan.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-slate-950">{plan.title || 'Untitled plan'}</h2>
              {isPurchased ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" /> Purchased
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-slate-500">{plan.description || 'Membership access for selected products.'}</p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            {Number(plan.realPrice) ? <p className="text-sm text-slate-400 line-through">{formatPrice(plan.realPrice)}</p> : null}
            <p className="text-3xl font-black text-blue-600">{formatPrice(getPlanPrice(plan))}</p>
            <p className="text-xs font-bold text-slate-400">Ends {plan.endDiscount ? new Date(plan.endDiscount).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        {isPurchased ? (
          <Accordion type="single" collapsible className="mt-5">
            <AccordionItem value={`products-${plan._id || plan.title}`} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4">
              <AccordionTrigger className="text-sm font-black text-emerald-700 hover:no-underline">Download products ({planProducts.length})</AccordionTrigger>
              <AccordionContent>
                {isLoadingProducts ? (
                  <div className="flex min-h-28 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : planProducts.length ? (
                  <div className="divide-y py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 xl:grid-cols-3">{planProducts.map(renderProductCard)}</div>
                ) : (
                  <div className="rounded-xl border border-dashed border-emerald-200 bg-white p-8 text-center text-sm text-slate-500">
                    No products connected with this membership.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <button
            type="button"
            onClick={() => openPayment(plan)}
            className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700"
          >
            Get membership
          </button>
        )}
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 pb-16 text-slate-950 sm:px-6 sm:py-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-black">View Membership Plan</h1>
          <p className="mt-1 text-sm text-slate-500">Purchased plans show downloadable products. New plans can be activated with payment.</p>
        </div>

        {isLoadingPlans || isCheckingAccount ? (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : plans.length ? (
          <div className="grid gap-4">{plans.map(renderPlan)}</div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No membership plan found.</div>
        )}
      </section>

      {isPaymentOpen && selectedPlan ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Payment confirmation</p>
              <h2 className="mt-2 text-2xl font-black">Confirm membership payment</h2>
              <p className="mt-2 text-sm text-slate-500">
                Review the payment for {selectedPlan.title}. After confirmation, membership activation and downloads will continue as before.
              </p>
            </div>
            <div className="grid gap-4 p-6">
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">Name</span>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                  value={customerInfo.name}
                  onChange={event => setCustomerInfo(prev => ({ ...prev, name: event.target.value }))}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">Email</span>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                  value={customerInfo.email}
                  onChange={event => setCustomerInfo(prev => ({ ...prev, email: event.target.value }))}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">Mobile Number</span>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                  value={customerInfo.phone}
                  onChange={event => setCustomerInfo(prev => ({ ...prev, phone: event.target.value }))}
                />
              </label>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-blue-700">{selectedPlan.title}</span>
                  <span className="font-black text-blue-900">{formatPrice(getPlanPrice(selectedPlan))}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-blue-700">Please confirm this payment before membership activation.</p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsPaymentOpen(false)}
                disabled={isOrdering}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={completeMembershipPayment}
                disabled={isOrdering}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:bg-slate-300"
              >
                {isOrdering ? 'Confirming...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

const MembershipPage = () => (
  <Suspense fallback={<main className="min-h-screen bg-white" />}>
    <MembershipPageContent />
  </Suspense>
);

export default MembershipPage;
