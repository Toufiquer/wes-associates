/*
|-----------------------------------------
| setting up Cart Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import { sendGTMEvent } from '@next/third-parties/google';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Download, Loader2, Minus, Plus, ShoppingCart, Trash2, XCircle } from 'lucide-react';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { ASSET_CART_UPDATED_EVENT, AssetCartItem, getAssetCart, parseAssetPrice, saveAssetCart } from '@/lib/asset-cart';
import { META_PIXEL_CURRENCY, trackMetaEvent } from '@/lib/facebook-pixel';
import { validateMobileNumber } from '@/lib/mobile-number';
import { useGetMyCustomerAccountQuery } from '@/redux/features/customer-accounts/customerAccountsSlice';
import { useGetProductsQuery } from '@/redux/features/products/productsSlice';

import GtmEventFire, { mapCartItemsToGtmItems } from './gtm-event-fire';

const formatPrice = (value: number) => `${value.toLocaleString('en-US')}৳`;
const ACCOUNT_LOGIN_STORAGE_KEY = 'customer_account_user';

interface CustomerAccount {
  name?: string;
  email?: string;
  mobileNumber?: string;
}

interface CustomerAccountResponse {
  data?: CustomerAccount;
}

interface ImageValue {
  url: string;
  name: string;
}

interface ProductItem {
  _id?: string;
  id?: string | number;
  title?: string;
  productUID?: string;
  uploadProduct?: Partial<ImageValue>;
}

interface ProductResponse {
  data?: {
    products?: ProductItem[];
  };
}

interface PurchasedOrderItem {
  productId?: string;
  title?: string;
  quantity?: number;
  price?: number;
}

interface PurchasedOrder {
  paymentStatus?: string;
  totalAmount?: number;
  customerName?: string;
  customerEmail?: string;
  tranId?: string;
  orderNo?: string;
  items?: PurchasedOrderItem[];
}

const normalize = (value?: unknown) =>
  String(value || '')
    .trim()
    .toLowerCase();

const getProductNumericId = (product: ProductItem, index: number) => {
  const source = product.productUID || product._id || product.id || index + 1;
  const numeric = Number(String(source).replace(/\D/g, '').slice(-8));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : index + 1;
};

const getProductKeys = (product: ProductItem, index: number) =>
  [product._id, product.id, product.productUID, getProductNumericId(product, index), product.title].map(normalize).filter(Boolean);

const getPurchasedItemKeys = (item: PurchasedOrderItem) => [item.productId, item.title].map(normalize).filter(Boolean);

const getPurchasedItemProduct = (item: PurchasedOrderItem, products: ProductItem[]) => {
  const itemKeys = getPurchasedItemKeys(item);
  if (!itemKeys.length) return null;
  return products.find((product, index) => getProductKeys(product, index).some(productKey => itemKeys.includes(productKey))) || null;
};

const mapPurchasedItemsToGtmItems = (items: PurchasedOrderItem[]) =>
  items.map(item => ({
    item_id: String(item.productId || item.title || ''),
    item_name: item.title || 'Purchased product',
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
  }));

const CartPageContent = () => {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<AssetCartItem[]>([]);
  const [isCartReady, setIsCartReady] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isLoadingReturn, setIsLoadingReturn] = useState(false);
  const [paymentReturnMessage, setPaymentReturnMessage] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [phoneError, setPhoneError] = useState('');
  const [completedCheckout, setCompletedCheckout] = useState<PurchasedOrder | null>(null);
  const trackedPurchaseOrderIds = useRef(new Set<string>());
  const { data: accountResponse } = useGetMyCustomerAccountQuery(undefined) as { data?: CustomerAccountResponse };
  const { data: productsResponse } = useGetProductsQuery({ page: 1, limit: 1000 }, { skip: !completedCheckout }) as { data?: ProductResponse };
  const account = accountResponse?.data;
  const epsPaymentStatus = normalize(searchParams.get('eps_payment'));
  const epsTransactionId = searchParams.get('tran_id') || '';

  useEffect(() => {
    const syncCart = () => {
      setItems(getAssetCart());
      setIsCartReady(true);
    };

    syncCart();
    window.addEventListener(ASSET_CART_UPDATED_EVENT, syncCart);
    window.addEventListener('storage', syncCart);
    return () => {
      window.removeEventListener(ASSET_CART_UPDATED_EVENT, syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  useEffect(() => {
    if (account?.name || account?.email || account?.mobileNumber) {
      setCustomerInfo(prev => ({
        ...prev,
        name: prev.name || account.name || '',
        email: prev.email || account.email || '',
        phone: prev.phone || account.mobileNumber || '',
      }));
      return;
    }

    try {
      const savedAccount = window.localStorage.getItem(ACCOUNT_LOGIN_STORAGE_KEY);
      if (!savedAccount) return;
      const parsed = JSON.parse(savedAccount) as CustomerAccount;
      setCustomerInfo(prev => ({
        ...prev,
        name: prev.name || parsed.name || '',
        email: prev.email || parsed.email || '',
        phone: prev.phone || parsed.mobileNumber || '',
      }));
    } catch {
      // Ignore invalid local checkout account cache.
    }
  }, [account]);

  useEffect(() => {
    if (!epsPaymentStatus) return;

    if (!epsTransactionId) {
      setPaymentReturnMessage('Payment return was missing the transaction ID.');
      return;
    }

    const loadReturnedOrder = async () => {
      setIsLoadingReturn(true);
      setPaymentReturnMessage('');

      try {
        const response = await fetch(`/api/payment/eps/status?tran_id=${encodeURIComponent(epsTransactionId)}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result?.message || 'Unable to load payment status.');

        const order = (result?.data || null) as PurchasedOrder | null;
        if (normalize(order?.paymentStatus) === 'paid') {
          setCompletedCheckout(order);
          setItems([]);
          saveAssetCart([]);
          window.localStorage.setItem(
            ACCOUNT_LOGIN_STORAGE_KEY,
            JSON.stringify({
              email: order?.customerEmail || customerInfo.email.trim(),
              mobileNumber: customerInfo.phone.trim(),
              name: order?.customerName || customerInfo.name.trim(),
            }),
          );
          return;
        }

        setPaymentReturnMessage(epsPaymentStatus === 'cancelled' ? 'Payment was cancelled.' : 'Payment was not completed.');
      } catch (error) {
        setPaymentReturnMessage(error instanceof Error ? error.message : 'Unable to load payment status.');
      } finally {
        setIsLoadingReturn(false);
      }
    };

    void loadReturnedOrder();
  }, [customerInfo.email, customerInfo.name, customerInfo.phone, epsPaymentStatus, epsTransactionId]);

  useEffect(() => {
    const orderKey = completedCheckout?.orderNo || completedCheckout?.tranId || '';
    if (!orderKey || normalize(completedCheckout?.paymentStatus) !== 'paid') return;
    if (trackedPurchaseOrderIds.current.has(orderKey)) return;

    trackedPurchaseOrderIds.current.add(orderKey);
    trackMetaEvent('Purchase', {
      value: Number(completedCheckout?.totalAmount) || 0,
      currency: META_PIXEL_CURRENCY,
      content_ids: (completedCheckout?.items || []).map(item => String(item.productId || item.title || '')).filter(Boolean),
      content_type: 'product',
      num_items: (completedCheckout?.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
    });

    if (process.env.NEXT_PUBLIC_GTM_ID) {
      sendGTMEvent({
        event: 'purchase',
        currency: META_PIXEL_CURRENCY,
        value: Number(completedCheckout?.totalAmount) || 0,
        items: mapPurchasedItemsToGtmItems(completedCheckout?.items || []),
        transaction_id: orderKey,
      });
    }
  }, [completedCheckout]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + parseAssetPrice(item.price) * item.quantity, 0), [items]);
  const processingFee = items.length > 0 ? 50 : 0;
  const total = subtotal + processingFee;
  const purchasedItems = completedCheckout?.items || [];
  const products = useMemo(() => productsResponse?.data?.products || [], [productsResponse]);
  const updateQuantity = (cartId: string, quantity: number) => {
    const nextItems = items.map(item => (item.cartId === cartId ? { ...item, quantity: Math.max(1, quantity) } : item));
    setItems(nextItems);
    saveAssetCart(nextItems);
  };

  const removeItem = (cartId: string) => {
    const nextItems = items.filter(item => item.cartId !== cartId);
    setItems(nextItems);
    saveAssetCart(nextItems);
  };

  const placeOrder = async () => {
    if (items.length === 0) return;
    if (!customerInfo.name.trim()) {
      toast.error('Please enter customer name.');
      return;
    }
    if (!customerInfo.email.trim() || !customerInfo.phone.trim()) {
      toast.error('Please enter email and mobile number.');
      setPhoneError(validateMobileNumber(customerInfo.phone));
      return;
    }

    const nextPhoneError = validateMobileNumber(customerInfo.phone);
    setPhoneError(nextPhoneError);
    if (nextPhoneError) {
      return;
    }

    setIsOrdering(true);
    try {
      const orderItems = items.map(item => ({
        productId: String(item.productId),
        title: item.title,
        quantity: item.quantity,
        price: parseAssetPrice(item.price),
      }));
      const checkoutItemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const contentIds = orderItems.map(item => item.productId).filter(Boolean);

      trackMetaEvent('InitiateCheckout', {
        value: total,
        currency: META_PIXEL_CURRENCY,
        content_ids: contentIds,
        content_type: 'product',
        num_items: checkoutItemCount,
      });

      if (process.env.NEXT_PUBLIC_GTM_ID) {
        sendGTMEvent({
          event: 'being_checkout',
          currency: META_PIXEL_CURRENCY,
          value: total,
          items: mapCartItemsToGtmItems(items),
        });
      }

      const response = await fetch('/api/payment/eps/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name.trim(),
          customerEmail: customerInfo.email.trim(),
          customerPhone: customerInfo.phone.trim(),
          shippingAddress: '',
          items: orderItems,
          subtotal,
          shippingCharge: processingFee,
          discount: 0,
          totalAmount: total,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || result?.error || 'Unable to initialize EPS payment.');
      const redirectUrl = result?.data?.redirectUrl;
      if (!redirectUrl) throw new Error('EPS did not return a payment URL.');

      window.localStorage.setItem(
        ACCOUNT_LOGIN_STORAGE_KEY,
        JSON.stringify({
          email: customerInfo.email.trim(),
          mobileNumber: customerInfo.phone.trim(),
          name: customerInfo.name.trim(),
        }),
      );
      window.location.href = redirectUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to initialize EPS payment.');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-2 text-slate-950">
      <GtmEventFire items={items} value={total} isReady={isCartReady && !completedCheckout && !epsPaymentStatus} />
      <div className="mx-auto max-w-6xl">
        {items.length === 0 && !completedCheckout && (
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Asset Cart</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Your Cart</h1>
              <p className="mt-2 text-sm text-slate-500">Review your selected templates and plugins, then complete the payment flow.</p>
            </div>
            <Link
              href="/category"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        )}

        <div className={completedCheckout ? 'grid gap-8' : 'grid gap-8 lg:grid-cols-[1fr_380px]'}>
          {!completedCheckout && (isLoadingReturn || paymentReturnMessage) ? (
            <div className="lg:col-span-2">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
                {isLoadingReturn ? <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-blue-600" /> : <XCircle className="mt-0.5 h-5 w-5 text-red-500" />}
                <div>
                  <p className="font-black text-slate-950">{isLoadingReturn ? 'Checking EPS payment...' : 'EPS payment update'}</p>
                  {paymentReturnMessage ? <p className="mt-1 text-slate-500">{paymentReturnMessage}</p> : null}
                </div>
              </div>
            </div>
          ) : null}

          <section
            className={
              completedCheckout
                ? 'rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4'
                : 'order-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:order-1'
            }
          >
            {completedCheckout ? (
              <div className="mb-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Purchased Product</p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">Your latest order</h2>
                    {completedCheckout?.orderNo ? <p className="mt-1 text-xs font-bold text-slate-500">Order: {completedCheckout.orderNo}</p> : null}
                  </div>
                  <Link
                    href="/account"
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition hover:bg-blue-700"
                  >
                    Go to Account
                  </Link>
                </div>

                {purchasedItems.length ? (
                  <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100">
                    {purchasedItems.map((item, index) =>
                      (() => {
                        const product = getPurchasedItemProduct(item, products);
                        const downloadUrl = product?.uploadProduct?.url || '';
                        const downloadName = product?.uploadProduct?.name || product?.title || item.title || 'Purchased product';

                        return (
                          <div
                            key={`${item.productId || item.title || 'product'}-${index}`}
                            className="grid grid-cols-[48px_1fr] gap-3 p-3 sm:grid-cols-[48px_1fr_auto] sm:items-center"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-slate-950">{item.title || product?.title || 'Purchased product'}</p>
                              <p className="mt-1 text-xs font-bold text-slate-500">Quantity: {Number(item.quantity) || 1}</p>
                              <p className="mt-1 text-sm font-black text-blue-600 sm:hidden">{formatPrice(Number(item.price) || 0)}</p>
                            </div>
                            <div className="col-span-2 flex flex-col gap-2 sm:col-span-1 sm:min-w-36 sm:items-end">
                              <p className="hidden text-sm font-black text-blue-600 sm:block">{formatPrice(Number(item.price) || 0)}</p>
                              {downloadUrl ? (
                                <a
                                  href={downloadUrl}
                                  download={downloadName}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white transition hover:bg-emerald-700"
                                >
                                  <Download className="h-4 w-4" /> Download
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-300 px-3 py-2 text-xs font-black text-white"
                                >
                                  <Download className="h-4 w-4" /> No Download
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })(),
                    )}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                    Payment was completed, but no product item was found for this transaction.
                  </div>
                )}

                {typeof completedCheckout?.totalAmount === 'number' ? (
                  <div className="mt-4 flex justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">
                    <span>Total paid</span>
                    <span>{formatPrice(completedCheckout.totalAmount)}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
            {!completedCheckout && items.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-950">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-black">Cart is empty</h2>
                <p className="mt-2 max-w-md text-sm text-slate-500">Click the heart cart button from Asset 1 or Asset 2 products to see them here.</p>
              </div>
            ) : !completedCheckout ? (
              <div className="divide-y divide-slate-100">
                {items.map(item => (
                  <div key={item.cartId} className="grid grid-cols-[48px_1fr] gap-2 py-3 sm:grid-cols-[72px_1fr_auto] sm:items-center sm:gap-4 sm:py-4">
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-blue-50 sm:h-16 sm:w-16 sm:rounded-2xl">
                      {item.image ? (
                        <div
                          role="img"
                          aria-label={item.title}
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url("${item.image}")` }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-blue-600">
                          <i className={`ti ${item.icon || 'ti-package'} text-3xl`} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-slate-950 sm:text-sm">{item.title}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">{item.assetName}</p>
                      <p className="mt-1 text-xs font-black text-blue-600 sm:mt-2 sm:text-sm">{item.price}</p>
                    </div>
                    <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:justify-start sm:gap-3">
                      <div className="flex items-center overflow-hidden rounded-full border border-slate-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="p-1.5 text-slate-500 hover:bg-slate-50 sm:p-2"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-xs font-black sm:min-w-10 sm:text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="p-1.5 text-slate-500 hover:bg-slate-50 sm:p-2"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.cartId)}
                        className="rounded-full p-2 text-red-500 hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {!completedCheckout ? (
            <aside className="order-1 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm lg:order-2">
              <div className="space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-slate-600">Customer Name</span>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                    placeholder="Customer name"
                    value={customerInfo.name}
                    onChange={event => setCustomerInfo(prev => ({ ...prev, name: event.target.value }))}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-slate-600">Email Address</span>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                    placeholder="Email address"
                    value={customerInfo.email}
                    onChange={event => setCustomerInfo(prev => ({ ...prev, email: event.target.value }))}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-slate-600">Phone Number</span>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                    placeholder="Phone number"
                    value={customerInfo.phone}
                    onChange={event => {
                      const nextPhone = event.target.value;
                      setCustomerInfo(prev => ({ ...prev, phone: nextPhone }));
                      if (phoneError) setPhoneError(validateMobileNumber(nextPhone));
                    }}
                    onBlur={() => setPhoneError(validateMobileNumber(customerInfo.phone))}
                    aria-invalid={Boolean(phoneError)}
                    aria-describedby={phoneError ? 'cart-phone-error' : undefined}
                  />
                  {phoneError ? (
                    <span id="cart-phone-error" className="block text-xs font-bold text-red-600">
                      {phoneError}
                    </span>
                  ) : null}
                </label>
              </div>

              <div className="my-5 space-y-3 border-y border-slate-200 py-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Processing fee</span>
                  <span className="font-bold">{formatPrice(processingFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-black">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={items.length === 0 || isOrdering}
                onClick={placeOrder}
                className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isOrdering ? 'Redirecting...' : 'Pay with EPS'}
              </button>
              <p className="mt-3 text-center text-[11px] font-semibold text-slate-400">Your order will be confirmed after EPS verifies the payment.</p>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
};

const CartPage = () => (
  <Suspense fallback={null}>
    <CartPageContent />
  </Suspense>
);

export default CartPage;
