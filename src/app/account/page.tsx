'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import {
  Camera,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  MessageCircle,
  Package,
  Save,
  ShieldCheck,
  ShoppingCart,
  UserRound,
} from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import ErrorMessageComponent from '@/components/common/Error';
import LoadingComponent from '@/components/common/Loading/Loading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addAssetToCart } from '@/lib/asset-cart';
import { META_PIXEL_CURRENCY, trackMetaEvent } from '@/lib/facebook-pixel';
import { validateMobileNumber } from '@/lib/mobile-number';
import { useGetMyCustomerAccountQuery, useUpdateMyCustomerAccountMutation } from '@/redux/features/customer-accounts/customerAccountsSlice';
import { useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { useGetOrdersQuery } from '@/redux/features/orders/ordersSlice';
import { useGetProductsQuery } from '@/redux/features/products/productsSlice';

type ImageValue = { url: string; name: string };

interface ProductItem {
  _id?: string;
  id?: string | number;
  title: string;
  productUID?: string;
  real_price?: number;
  discount_price?: number;
  description?: string;
  primary_images?: ImageValue;
  uploadProduct?: Partial<ImageValue>;
  liveUrl?: string;
  bestfor?: string;
}

interface MemberPlan {
  _id?: string;
  title: string;
  description?: string;
  realPrice?: number;
  discountPrice?: number;
  endDiscount?: string;
  productIds?: string[];
}

interface OrderItemValue {
  productId?: string;
  title?: string;
  quantity?: number;
  price?: number;
}

interface OrderItem {
  _id?: string;
  customerEmail?: string;
  items?: OrderItemValue[];
  paymentStatus?: string;
}

interface LicenseItem {
  productId?: string;
  productTitle: string;
  orderNo?: string;
  licenseKey: string;
}

interface CustomerAccount {
  _id?: string;
  name?: string;
  mobileNumber?: string;
  email?: string;
  photo?: Partial<ImageValue>;
  isBlocked?: boolean;
  licenses?: LicenseItem[];
}

interface CustomerAccountResponse {
  data?: CustomerAccount;
}

interface ProductResponse {
  data?: {
    products?: ProductItem[];
  };
}

interface OrdersResponse {
  data?: {
    orders?: OrderItem[];
  };
}

interface MembersResponse {
  data?: {
    members?: MemberPlan[];
  };
}

interface CheckMemberResponse {
  data?: {
    membershipIds?: string[];
  };
  message?: string;
}

const ACCOUNT_AUTO_PASSWORD_COOKIE = 'customer_account_auto_password';
const supportHref = 'https://wa.me/8801726020097?text=Hello%2C%20I%20need%20support%20with%20my%20account.';
const emptyPhoto = { url: '', name: '' };
const normalizePhoto = (photo?: Partial<ImageValue>): ImageValue => ({ url: photo?.url || '', name: photo?.name || '' });

const normalize = (value?: unknown) =>
  String(value || '')
    .trim()
    .toLowerCase();
const formatPrice = (value?: unknown) => `${(Number(value) || 0).toLocaleString('en-US')}৳`;
const stripHtml = (value?: string) =>
  (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getProductPrice = (product: ProductItem) => Number(product.discount_price) || Number(product.real_price) || 0;
const getPlanPrice = (plan: MemberPlan) => Number(plan.discountPrice) || Number(plan.realPrice) || 0;
const getReadableCookie = (name: string) => {
  if (typeof document === 'undefined') return '';
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');
  return match ? decodeURIComponent(match) : '';
};
const clearReadableCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};
const getProductNumericId = (product: ProductItem, index: number) => {
  const source = product.productUID || product._id || product.id || index + 1;
  const numeric = Number(String(source).replace(/\D/g, '').slice(-8));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : index + 1;
};

const getProductKeys = (product: ProductItem) => [product._id, product.id, product.productUID, product.title].map(normalize).filter(Boolean);

const isPaidPurchase = (product: ProductItem, orders: OrderItem[]) => {
  const productKeys = getProductKeys(product);
  return orders.some(order => {
    if (normalize(order.paymentStatus) !== 'paid') return false;
    return (order.items || []).some(item =>
      [item.productId, item.title]
        .map(normalize)
        .filter(Boolean)
        .some(itemKey => productKeys.includes(itemKey)),
    );
  });
};

const isLicensedPurchase = (product: ProductItem, licenses: LicenseItem[] = []) => {
  const productKeys = getProductKeys(product);
  return licenses.some(license =>
    [license.productId, license.productTitle]
      .map(normalize)
      .filter(Boolean)
      .some(licenseKey => productKeys.includes(licenseKey)),
  );
};

const canDownloadProduct = (product: ProductItem, orders: OrderItem[], licenses?: LicenseItem[]) => isPaidPurchase(product, orders) || isLicensedPurchase(product, licenses);

const AccountPageContent = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginForm, setLoginForm] = useState({ mobileNumber: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', mobileNumber: '', email: '', password: '', confirmPassword: '' });
  const [profile, setProfile] = useState({ name: '', mobileNumber: '', email: '', oldPassword: '', password: '', confirmPassword: '', photo: emptyPhoto });
  const [mobileErrors, setMobileErrors] = useState({ login: '', register: '', profile: '' });
  const [memberPlanIds, setMemberPlanIds] = useState<string[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<MemberPlan[]>([]);
  const [isMembershipLoading, setIsMembershipLoading] = useState(false);
  const [membershipError, setMembershipError] = useState('');
  const [selectedMembershipPlanId, setSelectedMembershipPlanId] = useState('');
  const [isMembershipPaymentOpen, setIsMembershipPaymentOpen] = useState(false);
  const [isMembershipOrdering, setIsMembershipOrdering] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const {
    data: accountResponse,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
    refetch: refetchAccount,
  } = useGetMyCustomerAccountQuery(undefined) as {
    data?: CustomerAccountResponse;
    isLoading: boolean;
    isError: boolean;
    error?: { status?: number };
    refetch: () => Promise<unknown>;
  };
  const [updateMyAccount, { isLoading: isUpdatingAccount }] = useUpdateMyCustomerAccountMutation();
  const [addMedia, { isLoading: isAddingAvatarMedia }] = useAddMediaMutation();

  const account = accountResponse?.data;
  const userEmail = account?.email || '';
  const isCustomerUnauthorized = isAccountError && accountError?.status === 401;
  const isLoginConfirmed = Boolean(account?.email) && !isLoggedOut;

  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
    isFetching: isProductsFetching,
  } = useGetProductsQuery({ page: 1, limit: 1000 }, { skip: !isLoginConfirmed }) as {
    data?: ProductResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    isFetching: isOrdersFetching,
  } = useGetOrdersQuery({ page: 1, limit: 1000, q: userEmail }, { skip: !isLoginConfirmed }) as {
    data?: OrdersResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };

  const products = useMemo(() => productsResponse?.data?.products || [], [productsResponse]);
  const selectedMembershipPlan = useMemo(
    () => membershipPlans.find(plan => plan._id === selectedMembershipPlanId) || null,
    [membershipPlans, selectedMembershipPlanId],
  );
  const myOrders = useMemo(() => {
    const orders = ordersResponse?.data?.orders || [];
    return userEmail ? orders.filter(order => normalize(order.customerEmail) === normalize(userEmail)) : [];
  }, [ordersResponse, userEmail]);
  const purchasedProducts = useMemo(
    () => products.map((product, index) => ({ product, index })).filter(({ product }) => canDownloadProduct(product, myOrders, account?.licenses)),
    [account?.licenses, myOrders, products],
  );
  const notPurchasedProducts = useMemo(
    () => products.map((product, index) => ({ product, index })).filter(({ product }) => !canDownloadProduct(product, myOrders, account?.licenses)),
    [account?.licenses, myOrders, products],
  );
  useEffect(() => {
    const autoPassword = getReadableCookie(ACCOUNT_AUTO_PASSWORD_COOKIE);
    setProfile({
      name: account?.name || '',
      mobileNumber: account?.mobileNumber || '',
      email: account?.email || userEmail,
      oldPassword: autoPassword,
      password: '',
      confirmPassword: '',
      photo: normalizePhoto(account?.photo),
    });
  }, [account, userEmail]);

  useEffect(() => {
    if (!isLoginConfirmed) return;

    let isActive = true;
    const fetchMembershipData = async () => {
      setIsMembershipLoading(true);
      setMembershipError('');
      try {
        const plansResponse = await fetch('/api/members/v1?page=1&limit=100');
        const plansResult = (await plansResponse.json()) as MembersResponse;
        if (!plansResponse.ok) throw new Error('Unable to load membership plans.');

        const nextPlans = plansResult.data?.members || [];
        let ownedIds: string[] = [];
        if (account?.mobileNumber) {
          const checkResponse = await fetch(`/api/members/v1?checkMobile=${encodeURIComponent(account.mobileNumber)}`);
          const checkResult = (await checkResponse.json()) as CheckMemberResponse;
          if (!checkResponse.ok) throw new Error(checkResult?.message || 'Unable to check membership.');
          ownedIds = Array.isArray(checkResult.data?.membershipIds) ? checkResult.data.membershipIds.map(String) : [];
        }

        if (!isActive) return;
        setMembershipPlans(nextPlans);
        setMemberPlanIds(ownedIds);
        setSelectedMembershipPlanId(prev => prev || nextPlans[0]?._id || '');
      } catch (error) {
        if (!isActive) return;
        setMembershipError(error instanceof Error ? error.message : 'Unable to load membership.');
        setMembershipPlans([]);
        setMemberPlanIds([]);
      } finally {
        if (isActive) setIsMembershipLoading(false);
      }
    };

    fetchMembershipData();

    return () => {
      isActive = false;
    };
  }, [account?.mobileNumber, isLoginConfirmed]);

  const validateAndSetMobileError = (field: keyof typeof mobileErrors, value: string) => {
    const error = validateMobileNumber(value);
    setMobileErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const saveProfile = async () => {
    if (validateAndSetMobileError('profile', profile.mobileNumber)) return;

    const wantsPasswordUpdate = Boolean(profile.oldPassword || profile.password || profile.confirmPassword);
    if (wantsPasswordUpdate) {
      if (!profile.oldPassword || !profile.password || !profile.confirmPassword) {
        toast.error('Old password, new password, and confirm password are required.');
        return;
      }
      if (profile.password !== profile.confirmPassword) {
        toast.error('Confirm password does not match.');
        return;
      }
    }

    try {
      await updateMyAccount({
        name: profile.name,
        mobileNumber: profile.mobileNumber,
        oldPassword: wantsPasswordUpdate ? profile.oldPassword : undefined,
        password: profile.password || undefined,
        photo: profile.photo,
      }).unwrap();
      if (wantsPasswordUpdate) clearReadableCookie(ACCOUNT_AUTO_PASSWORD_COOKIE);
      setProfile(prev => ({ ...prev, oldPassword: '', password: '', confirmPassword: '' }));
      toast.success('Account updated successfully');
    } catch {
      toast.error('Failed to update account');
    }
  };

  const changeAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      event.target.value = '';
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 800, useWebWorker: true });
      const formData = new FormData();
      formData.append('image', compressedFile);

      const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadResult?.success || !uploadResult?.data?.url) throw new Error('Avatar upload failed.');

      const nextAvatar = { name: file.name, url: uploadResult.data.url };
      await addMedia({
        url: nextAvatar.url,
        name: nextAvatar.name,
        contentType: 'image',
        uploaderPlace: 'imageBB',
        status: 'active',
      }).unwrap();
      setProfile(prev => ({ ...prev, photo: nextAvatar }));
      toast.success('Avatar changed. Save profile to keep it.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Avatar upload failed.');
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const submitLogin = async () => {
    if (!loginForm.mobileNumber.trim() || !loginForm.password.trim()) {
      toast.error('Please enter mobile number and password.');
      validateAndSetMobileError('login', loginForm.mobileNumber);
      return;
    }

    if (validateAndSetMobileError('login', loginForm.mobileNumber)) {
      return;
    }

    setIsAuthLoading(true);
    try {
      const loginResponse = await fetch('/api/customer-accounts/v1?login=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: loginForm.mobileNumber.trim(),
          password: loginForm.password,
        }),
      });
      const loginResult = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginResult?.message || 'Login failed.');

      setIsLoggedOut(false);
      await refetchAccount();
      toast.success('Logged in successfully');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const submitRegister = async () => {
    if (!registerForm.name || !registerForm.mobileNumber || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      toast.error('Please fill all registration fields.');
      validateAndSetMobileError('register', registerForm.mobileNumber);
      return;
    }
    if (validateAndSetMobileError('register', registerForm.mobileNumber)) {
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsAuthLoading(true);
    try {
      const registerResponse = await fetch('/api/customer-accounts/v1?register=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerForm.name,
          mobileNumber: registerForm.mobileNumber,
          email: registerForm.email,
          password: registerForm.password,
        }),
      });
      const registerResult = await registerResponse.json();
      if (!registerResponse.ok) throw new Error(registerResult?.message || 'Registration failed.');

      setIsLoggedOut(false);
      await refetchAccount();
      toast.success('Registration completed');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const addProductToCart = (product: ProductItem, index: number) => {
    addAssetToCart({
      productId: getProductNumericId(product, index),
      assetUid: product.productUID || product._id || `product-${index + 1}`,
      assetName: 'Products',
      title: product.title || 'Untitled product',
      price: formatPrice(getProductPrice(product)),
      image: product.primary_images?.url,
      downloadUrl: product.uploadProduct?.url,
      downloadName: product.uploadProduct?.name || product.title,
    });
  };

  const openMembershipPayment = (plan: MemberPlan) => {
    if (!plan._id) {
      toast.error('Membership plan is missing.');
      return;
    }
    setSelectedMembershipPlanId(plan._id);
    setIsMembershipPaymentOpen(true);
  };

  const completeMembershipPayment = async () => {
    if (!selectedMembershipPlan) {
      toast.error('Please select a membership plan.');
      return;
    }
    if (!account?.name?.trim() || !account.email?.trim() || !account.mobileNumber?.trim()) {
      toast.error('Name, email, and mobile number are required.');
      return;
    }

    const total = getPlanPrice(selectedMembershipPlan);
    setIsMembershipOrdering(true);
    try {
      const response = await fetch('/api/orders/cart-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: account.name.trim(),
          customerEmail: account.email.trim(),
          customerPhone: account.mobileNumber.trim(),
          shippingAddress: '',
          items: [
            {
              productId: `membership:${selectedMembershipPlan._id || selectedMembershipPlan.title}`,
              title: `Membership - ${selectedMembershipPlan.title}`,
              quantity: 1,
              price: total,
            },
          ],
          subtotal: total,
          shippingCharge: 0,
          discount: Math.max(0, Number(selectedMembershipPlan.realPrice || 0) - total),
          totalAmount: total,
          paymentMethod: 'manual-membership',
          paymentStatus: 'paid',
          deliveryStatus: 'delivered',
          orderStatus: 'completed',
          note: `Membership payment for ${selectedMembershipPlan.title}.`,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || result?.error || 'Unable to confirm membership payment.');
      trackMetaEvent('Purchase', {
        value: total,
        currency: META_PIXEL_CURRENCY,
        content_ids: [`membership:${selectedMembershipPlan._id || selectedMembershipPlan.title}`],
        content_name: `Membership - ${selectedMembershipPlan.title}`,
        content_type: 'product',
        num_items: 1,
      });
      await refetchAccount();
      setMemberPlanIds(prev => (selectedMembershipPlan._id && !prev.includes(selectedMembershipPlan._id) ? [...prev, selectedMembershipPlan._id] : prev));
      setIsMembershipPaymentOpen(false);
      toast.success('Membership payment confirmed. Downloads are available now.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to confirm membership payment.');
    } finally {
      setIsMembershipOrdering(false);
    }
  };

  const logoutCustomerAccount = async () => {
    setIsLogoutLoading(true);
    try {
      const logoutResponse = await fetch('/api/customer-accounts/v1?logout=true', { method: 'POST' });
      const logoutResult = await logoutResponse.json();
      if (!logoutResponse.ok) throw new Error(logoutResult?.message || 'Logout failed.');

      clearReadableCookie(ACCOUNT_AUTO_PASSWORD_COOKIE);
      setIsLoggedOut(true);
      toast.success('Logged out successfully');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Logout failed.');
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const renderProductCard = ({ product, index }: { product: ProductItem; index: number }, hasPaidPurchase: boolean) => {
    const downloadUrl = product.uploadProduct?.url || '';
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
          <span
            className={`absolute left-1 top-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${hasPaidPurchase ? 'bg-emerald-600' : 'bg-slate-700'}`}
          >
            {hasPaidPurchase ? 'Purchased' : 'Not Purchased'}
          </span>
        </div>
        <div className="min-w-0 flex-1 space-y-2 sm:p-4">
          <h3 className="line-clamp-2 text-sm font-black text-slate-950 sm:text-lg">{product.title || 'Untitled product'}</h3>
          <p className="line-clamp-2 text-xs text-slate-500">{stripHtml(product.description) || product.bestfor || 'No product description available.'}</p>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span className="text-slate-500">Price</span>
            <span className="font-black text-blue-600">{formatPrice(getProductPrice(product))}</span>
          </div>
          {hasPaidPurchase ? (
            downloadUrl ? (
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
              <Button type="button" disabled className="w-full justify-center gap-2 bg-slate-300 font-black text-white">
                <Download className="h-4 w-4" /> No Download
              </Button>
            )
          ) : (
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button
                type="button"
                onClick={() => {
                  addProductToCart(product, index);
                  toast.success('Product added. Redirecting to cart...');
                  router.push('/cart');
                }}
                className="bg-blue-600 font-black text-white hover:bg-blue-700"
              >
                Buy Now
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  addProductToCart(product, index);
                  toast.success('Product added to cart');
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </article>
    );
  };

  const getMembershipPlanProducts = (plan: MemberPlan) => {
    const selectedIds = new Set(plan.productIds || []);
    return products.filter(product => product._id && selectedIds.has(product._id));
  };

  const renderMembershipProductCard = (product: ProductItem, index: number) => {
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

  const renderMembershipPlan = (plan: MemberPlan) => {
    const isPurchased = Boolean(plan._id && memberPlanIds.includes(plan._id));
    const planProducts = getMembershipPlanProducts(plan);

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
            <AccordionItem value={`membership-products-${plan._id || plan.title}`} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4">
              <AccordionTrigger className="text-sm font-black text-emerald-700 hover:no-underline">Download products ({planProducts.length})</AccordionTrigger>
              <AccordionContent>
                {isProductsLoading ? (
                  <div className="flex min-h-28 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : planProducts.length ? (
                  <div className="divide-y py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 xl:grid-cols-3">{planProducts.map(renderMembershipProductCard)}</div>
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
            onClick={() => openMembershipPayment(plan)}
            className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700"
          >
            Get membership
          </button>
        )}
      </article>
    );
  };

  if (isAccountLoading) return <LoadingComponent />;
  if (isAccountError && !isCustomerUnauthorized) return <ErrorMessageComponent message="Unable to load account." />;

  if (!isLoginConfirmed) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-xl space-y-4">
          {!isRegisterMode ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-black">Please Login</h1>
              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input
                    value={loginForm.mobileNumber}
                    onChange={event => {
                      const mobileNumber = event.target.value;
                      setLoginForm(prev => ({ ...prev, mobileNumber }));
                      if (mobileErrors.login) validateAndSetMobileError('login', mobileNumber);
                    }}
                    onBlur={() => validateAndSetMobileError('login', loginForm.mobileNumber)}
                    placeholder="Mobile number"
                    aria-invalid={Boolean(mobileErrors.login)}
                    aria-describedby={mobileErrors.login ? 'account-login-mobile-error' : undefined}
                  />
                  {mobileErrors.login ? <p id="account-login-mobile-error" className="text-xs font-bold text-red-600">{mobileErrors.login}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showAuthPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={event => setLoginForm(prev => ({ ...prev, password: event.target.value }))}
                      placeholder="Password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showAuthPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button onClick={submitLogin} disabled={isAuthLoading} className="w-full bg-blue-600 font-black text-white hover:bg-blue-700">
                  {isAuthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Login
                </Button>
                <p className="text-center text-sm text-slate-500">
                  No account{' '}
                  <button type="button" onClick={() => setIsRegisterMode(true)} className="font-black text-blue-600 hover:underline">
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-black">Sign Up</h1>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={registerForm.name} onChange={event => setRegisterForm(prev => ({ ...prev, name: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input
                    value={registerForm.mobileNumber}
                    onChange={event => {
                      const mobileNumber = event.target.value;
                      setRegisterForm(prev => ({ ...prev, mobileNumber }));
                      if (mobileErrors.register) validateAndSetMobileError('register', mobileNumber);
                    }}
                    onBlur={() => validateAndSetMobileError('register', registerForm.mobileNumber)}
                    aria-invalid={Boolean(mobileErrors.register)}
                    aria-describedby={mobileErrors.register ? 'account-register-mobile-error' : undefined}
                  />
                  {mobileErrors.register ? <p id="account-register-mobile-error" className="text-xs font-bold text-red-600">{mobileErrors.register}</p> : null}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Email</Label>
                  <Input value={registerForm.email} onChange={event => setRegisterForm(prev => ({ ...prev, email: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={registerForm.password}
                    onChange={event => setRegisterForm(prev => ({ ...prev, password: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={event => setRegisterForm(prev => ({ ...prev, confirmPassword: event.target.value }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button onClick={submitRegister} disabled={isAuthLoading} className="w-full bg-blue-600 font-black text-white hover:bg-blue-700">
                    {isAuthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign Up
                  </Button>
                  <p className="mt-4 text-center text-sm text-slate-500">
                    Already have account{' '}
                    <button type="button" onClick={() => setIsRegisterMode(false)} className="font-black text-blue-600 hover:underline">
                      Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 text-slate-950 sm:px-6 sm:py-6 lg:px-8 pb-16">
      <section className="mx-auto max-w-7xl space-y-4">
        <Accordion type="single" defaultValue="personal" collapsible className="space-y-4">
          <AccordionItem value="personal" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionTrigger className="px-4 py-4 text-base font-black text-slate-950 hover:no-underline sm:px-5">Parsonal Info</AccordionTrigger>
            <AccordionContent className="px-3 pb-4 sm:px-5 sm:pb-5">
              {account?.isBlocked && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
                  This account is blocked. Contact support.
                </p>
              )}
              <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,320px)_1fr]">
                <div className="min-w-0">
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={changeAvatar} />
                  <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="relative">
                      <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-sm">
                        {profile.photo.url ? (
                          <Image src={profile.photo.url} alt={profile.name || 'Account avatar'} fill sizes="144px" className="object-cover" unoptimized />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <UserRound className="h-16 w-16" />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isUploadingAvatar || isAddingAvatarMedia}
                        aria-label="Change avatar"
                        className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                      >
                        {isUploadingAvatar || isAddingAvatarMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="w-full text-center">
                      <p className="truncate text-sm font-black text-slate-950">{profile.photo.name || profile.name || 'Account avatar'}</p>
                    </div>
                  </div>
                </div>
                <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={profile.name} onChange={event => setProfile(prev => ({ ...prev, name: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                      value={profile.mobileNumber}
                      onChange={event => {
                        const mobileNumber = event.target.value;
                        setProfile(prev => ({ ...prev, mobileNumber }));
                        if (mobileErrors.profile) validateAndSetMobileError('profile', mobileNumber);
                      }}
                      onBlur={() => validateAndSetMobileError('profile', profile.mobileNumber)}
                      aria-invalid={Boolean(mobileErrors.profile)}
                      aria-describedby={mobileErrors.profile ? 'account-profile-mobile-error' : undefined}
                    />
                    {mobileErrors.profile ? <p id="account-profile-mobile-error" className="text-xs font-bold text-red-600">{mobileErrors.profile}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Old Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={profile.oldPassword}
                        onChange={event => setProfile(prev => ({ ...prev, oldPassword: event.target.value }))}
                        placeholder="Current password"
                        className="pr-10"
                      />
                      <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Update Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={profile.password}
                      onChange={event => setProfile(prev => ({ ...prev, password: event.target.value }))}
                      placeholder="New password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={profile.confirmPassword}
                      onChange={event => setProfile(prev => ({ ...prev, confirmPassword: event.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-end w-full">
                    <Button
                      onClick={saveProfile}
                      disabled={isUpdatingAccount || account?.isBlocked}
                      className="w-full bg-blue-600 font-black text-white hover:bg-blue-700 sm:w-auto"
                    >
                      {isUpdatingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save Profile
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="download" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionTrigger className="px-4 py-4 text-base font-black text-slate-950 hover:no-underline sm:px-5">Download</AccordionTrigger>
            <AccordionContent className="px-3 pb-4 sm:px-5 sm:pb-5">
              <div className="space-y-6">
                {isProductsLoading ? (
                  <LoadingComponent />
                ) : isProductsError ? (
                  <ErrorMessageComponent message="Unable to load products." />
                ) : (
                  <>
                    {isOrdersLoading && !account?.licenses?.length ? <LoadingComponent /> : null}
                    {isOrdersError ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                        Orders could not be loaded. Showing downloads from your account licenses.
                      </div>
                    ) : null}
                    {(isProductsFetching || isOrdersFetching) && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm text-blue-600">
                        <Loader2 className="h-4 w-4 animate-spin" /> Updating products and orders...
                      </div>
                    )}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-end justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Purchased</p>
                          <h2 className="text-2xl font-black">Downloads</h2>
                        </div>
                        <p className="text-sm font-bold text-slate-500">{purchasedProducts.length} products</p>
                      </div>
                      {purchasedProducts.length ? (
                        <div className="divide-y sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 xl:grid-cols-3">
                          {purchasedProducts.map(entry => renderProductCard(entry, true))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">No purchased products found.</div>
                      )}
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-end justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Not Purchased</p>
                          <h2 className="text-2xl font-black">Available Products</h2>
                        </div>
                        <p className="text-sm font-bold text-slate-500">{notPurchasedProducts.length} products</p>
                      </div>
                      {notPurchasedProducts.length ? (
                        <div className="divide-y sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 xl:grid-cols-3">
                          {notPurchasedProducts.map(entry => renderProductCard(entry, false))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">All products are purchased.</div>
                      )}
                    </section>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="membership" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionTrigger className="px-4 py-4 text-base font-black text-slate-950 hover:no-underline sm:px-5">Membership</AccordionTrigger>
            <AccordionContent className="px-3 pb-4 sm:px-5 sm:pb-5">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h2 className="text-2xl font-black">View Membership Plan</h2>
                  <p className="mt-1 text-sm text-slate-500">Purchased plans show downloadable products. New plans can be activated with payment.</p>
                </div>

                {isMembershipLoading ? (
                  <div className="flex min-h-60 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : membershipError ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">{membershipError}</div>
                ) : membershipPlans.length ? (
                  <div className="grid gap-4">{membershipPlans.map(renderMembershipPlan)}</div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No membership plan found.</div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="licenses" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionTrigger className="px-4 py-4 text-base font-black text-slate-950 hover:no-underline sm:px-5">Licenses</AccordionTrigger>
            <AccordionContent className="px-4 pb-5 sm:px-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <KeyRound className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-2xl font-black">Licenses</h2>
                  <p className="text-sm text-slate-500">Each paid product receives a unique 16 digit hex license key.</p>
                </div>
              </div>
              {account?.licenses?.length ? (
                <div className="grid gap-3">
                  {account.licenses.map(item => (
                    <div key={item.licenseKey} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-black text-slate-950">{item.productTitle}</p>
                      <p className="mt-1 font-mono text-lg font-black text-blue-600">{item.licenseKey}</p>
                      <p className="mt-1 text-xs text-slate-500">Order: {item.orderNo || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">No licenses found for paid purchases.</div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="support" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionTrigger className="px-4 py-4 text-base font-black text-slate-950 hover:no-underline sm:px-5">Support</AccordionTrigger>
            <AccordionContent className="px-4 pb-6 text-center sm:px-5">
              <MessageCircle className="mx-auto h-12 w-12 text-emerald-600" />
              <h2 className="mt-3 text-2xl font-black">Support</h2>
              <p className="mt-2 text-sm text-slate-500">Contact support on WhatsApp.</p>
              <a
                href={supportHref}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp +880 1726-020097
              </a>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-4 flex w-full justify-end">
          <Button onClick={logoutCustomerAccount} disabled={isLogoutLoading} variant="destructive" className="w-full justify-center gap-2 sm:w-auto">
            {isLogoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {isLogoutLoading ? 'Logging out...' : 'Log out'}
          </Button>
        </div>
      </section>

      {isMembershipPaymentOpen && selectedMembershipPlan ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Payment confirmation</p>
              <h2 className="mt-2 text-2xl font-black">Confirm membership payment</h2>
              <p className="mt-2 text-sm text-slate-500">
                Review the payment for {selectedMembershipPlan.title}. After confirmation, membership activation and downloads will continue as before.
              </p>
            </div>
            <div className="grid gap-4 p-6">
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">Name</span>
                <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none" value={account?.name || ''} disabled />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">Email</span>
                <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none" value={account?.email || ''} disabled />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">Mobile Number</span>
                <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none" value={account?.mobileNumber || ''} disabled />
              </label>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-blue-700">{selectedMembershipPlan.title}</span>
                  <span className="font-black text-blue-900">{formatPrice(getPlanPrice(selectedMembershipPlan))}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-blue-700">Please confirm this payment before membership activation.</p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsMembershipPaymentOpen(false)}
                disabled={isMembershipOrdering}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={completeMembershipPayment}
                disabled={isMembershipOrdering}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:bg-slate-300"
              >
                {isMembershipOrdering ? 'Confirming...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

const AccountPage = () => (
  <Suspense fallback={<main className="min-h-screen bg-white" />}>
    <AccountPageContent />
  </Suspense>
);

export default AccountPage;
