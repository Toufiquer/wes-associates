/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Download, Loader2, Package, ShoppingCart } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

import ErrorMessageComponent from '@/components/common/Error';
import LoadingComponent from '@/components/common/Loading/Loading';
import { Button } from '@/components/ui/button';
import { addAssetToCart } from '@/lib/asset-cart';
import { useSession } from '@/lib/auth-client';
import { useGetOrdersQuery } from '@/redux/features/orders/ordersSlice';
import { useGetProductsQuery } from '@/redux/features/products/productsSlice';

type ImageValue = { url?: string; name?: string };

interface ProductItem {
  _id?: string;
  id?: string | number;
  title: string;
  productUID?: string;
  real_price?: number;
  discount_price?: number;
  description?: string;
  primary_images?: ImageValue;
  uploadProduct?: ImageValue;
  liveUrl?: string;
  status?: string;
  bestfor?: string;
  [key: string]: unknown;
}

interface ProductResponse {
  data?: {
    products?: ProductItem[];
    total?: number;
  };
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
  orderStatus?: string;
  [key: string]: unknown;
}

interface OrdersResponse {
  data?: {
    orders?: OrderItem[];
    total?: number;
  };
}

interface ProductEntry {
  product: ProductItem;
  index: number;
}

const formatPrice = (value?: unknown) => {
  const amount = Number(value) || 0;
  return `${amount.toLocaleString('en-US')}৳`;
};

const stripHtml = (value?: string) => (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const normalize = (value?: unknown) => String(value || '').trim().toLowerCase();

const getProductNumericId = (product: ProductItem, index: number) => {
  const source = product.productUID || product._id || product.id || index + 1;
  const numeric = Number(String(source).replace(/\D/g, '').slice(-8));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : index + 1;
};

const getProductPrice = (product: ProductItem) => {
  const discounted = Number(product.discount_price) || 0;
  const real = Number(product.real_price) || 0;
  return discounted || real;
};

const isPaidPurchase = (product: ProductItem, orders: OrderItem[]) => {
  const productKeys = [product._id, product.id, product.productUID, product.title].map(normalize).filter(Boolean);

  return orders.some(order => {
    if (normalize(order.paymentStatus) !== 'paid') return false;

    return (order.items || []).some(item => {
      const itemKeys = [item.productId, item.title].map(normalize).filter(Boolean);
      return itemKeys.some(itemKey => productKeys.includes(itemKey));
    });
  });
};

const MyProductsPage = () => {
  const router = useRouter();
  const session = useSession();
  const userEmail = session?.data?.user?.email || '';

  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
    isFetching: isProductsFetching,
  } = useGetProductsQuery({ page: 1, limit: 1000 }) as {
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
  } = useGetOrdersQuery({ page: 1, limit: 1000, q: userEmail }) as {
    data?: OrdersResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };

  const products = useMemo(() => productsResponse?.data?.products || [], [productsResponse]);
  const myOrders = useMemo(() => {
    const orders = ordersResponse?.data?.orders || [];
    if (!userEmail) return orders;
    return orders.filter(order => normalize(order.customerEmail) === normalize(userEmail));
  }, [ordersResponse, userEmail]);

  const purchasedCount = useMemo(() => products.filter(product => isPaidPurchase(product, myOrders)).length, [myOrders, products]);
  const purchasedProducts = useMemo<ProductEntry[]>(
    () => products.map((product, index) => ({ product, index })).filter(({ product }) => isPaidPurchase(product, myOrders)),
    [myOrders, products],
  );
  const notPurchasedProducts = useMemo<ProductEntry[]>(
    () => products.map((product, index) => ({ product, index })).filter(({ product }) => !isPaidPurchase(product, myOrders)),
    [myOrders, products],
  );

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

  const handleAddToCart = (product: ProductItem, index: number) => {
    addProductToCart(product, index);
    toast.success('Product added to cart');
  };

  const handleBuyNow = (product: ProductItem, index: number) => {
    addProductToCart(product, index);
    toast.success('Product added. Redirecting to cart...');
    router.push('/cart');
  };

  if (isProductsLoading || isOrdersLoading || session?.isPending) {
    return <LoadingComponent />;
  }

  if (isProductsError || isOrdersError) {
    return <ErrorMessageComponent message="Unable to load products or orders." />;
  }

  const renderProductCard = ({ product, index }: ProductEntry, hasPaidPurchase: boolean) => {
    const imageUrl = product.primary_images?.url;
    const downloadUrl = product.uploadProduct?.url || '';

    return (
      <article
        key={product._id || product.productUID || `${product.title}-${index}`}
        className="flex gap-3 border-b border-purple-100/15 py-3 last:border-b-0 sm:block sm:overflow-hidden sm:rounded-2xl sm:border sm:border-purple-200/20 sm:bg-purple-500/[0.08] sm:py-0 sm:shadow-xl sm:shadow-purple-950/25 sm:backdrop-blur-2xl sm:ring-1 sm:ring-white/10"
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-purple-950/20 sm:h-56 sm:w-full sm:rounded-none">
          {imageUrl ? (
            <Image src={imageUrl} alt={product.title || 'Product image'} fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-purple-100/35">
              <Package className="h-8 w-8 sm:h-16 sm:w-16" />
            </div>
          )}
          <span className="absolute left-1 top-1 rounded-full border border-purple-100/30 bg-purple-950/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-50 backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs sm:tracking-widest">
            {hasPaidPurchase ? 'Purchased' : 'Not Purchased'}
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-2 sm:space-y-4 sm:p-5">
          <div>
            <h2 className="line-clamp-2 text-sm font-black leading-5 sm:text-xl">{product.title || 'Untitled product'}</h2>
            {product.productUID ? <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-widest text-purple-100/70 sm:mt-1 sm:text-xs">{product.productUID}</p> : null}
          </div>

          <p className="line-clamp-1 text-xs leading-5 text-white/65 sm:line-clamp-3 sm:min-h-16 sm:text-sm sm:leading-6">
            {stripHtml(product.description) || product.bestfor || 'No product description available.'}
          </p>

          <div className="flex items-center justify-between sm:rounded-xl sm:border sm:border-purple-100/20 sm:bg-white/[0.07] sm:p-3 sm:backdrop-blur-xl">
            <span className="text-xs text-white/55 sm:text-sm">Price</span>
            <span className="text-sm font-black text-purple-100 sm:text-lg">{formatPrice(getProductPrice(product))}</span>
          </div>

          {hasPaidPurchase ? (
            downloadUrl ? (
              <a
                href={downloadUrl}
                download={product.uploadProduct?.name || product.title}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500/80 px-3 py-2 text-xs font-black text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            ) : (
              <Button type="button" disabled className="w-full justify-center gap-1.5 bg-white/10 text-xs font-black text-white/45 sm:gap-2 sm:text-sm">
                <Download className="h-4 w-4" />
                No Download
              </Button>
            )
          ) : (
            <div className="grid grid-cols-[1fr_auto] gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleBuyNow(product, index)}
                className="rounded-lg bg-purple-600/85 px-3 py-2 text-xs font-black text-white shadow-lg shadow-purple-950/25 transition hover:bg-purple-600 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={() => handleAddToCart(product, index)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-purple-100/20 bg-white/10 text-white transition hover:bg-purple-500/25 sm:h-12 sm:w-12 sm:rounded-xl"
                aria-label={`Add ${product.title || 'product'} to cart`}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-purple-200/20 bg-purple-500/[0.08] p-5 shadow-2xl shadow-purple-950/25 backdrop-blur-2xl ring-1 ring-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-purple-200">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">My Products</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Products with paid purchase orders show a download button. Products without a paid order can be added to cart or bought now.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <div className="rounded-xl border border-purple-100/20 bg-white/[0.08] p-4 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-widest text-white/50">Products</p>
              <p className="mt-1 text-2xl font-black">{products.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-4 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-widest text-emerald-100/70">Purchased</p>
              <p className="mt-1 text-2xl font-black text-emerald-100">{purchasedCount}</p>
            </div>
          </div>
        </div>

        {(isProductsFetching || isOrdersFetching) && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-100 backdrop-blur-xl">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating products and orders...
          </div>
        )}

        {products.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-purple-200/20 bg-purple-500/[0.08] text-center backdrop-blur-2xl">
            <Package className="mb-4 h-12 w-12 text-white/40" />
            <h2 className="text-xl font-black">No products found</h2>
            <p className="mt-2 text-sm text-white/50">Add products from dashboard assets to render them here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border-t border-purple-100/15 pt-4 sm:rounded-2xl sm:border sm:border-purple-200/20 sm:bg-purple-500/[0.07] sm:p-5 sm:pt-5 sm:shadow-xl sm:shadow-purple-950/20 sm:backdrop-blur-2xl sm:ring-1 sm:ring-white/10">
              <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-200">Division 1</p>
                  <h2 className="text-2xl font-black">Purchased</h2>
                </div>
                <p className="text-sm font-bold text-white/55">{purchasedProducts.length} products</p>
              </div>
              {purchasedProducts.length > 0 ? (
                <div className="divide-y divide-purple-100/15 sm:grid sm:gap-5 sm:divide-y-0 sm:grid-cols-2 xl:grid-cols-3">{purchasedProducts.map(entry => renderProductCard(entry, true))}</div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-8 text-center text-sm text-white/55 backdrop-blur-xl">No purchased products found.</div>
              )}
            </div>

            <div className="border-t border-purple-100/15 pt-4 sm:rounded-2xl sm:border sm:border-purple-200/20 sm:bg-purple-500/[0.07] sm:p-5 sm:pt-5 sm:shadow-xl sm:shadow-purple-950/20 sm:backdrop-blur-2xl sm:ring-1 sm:ring-white/10">
              <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-purple-200">Division 2</p>
                  <h2 className="text-2xl font-black">Not Purchased</h2>
                </div>
                <p className="text-sm font-bold text-white/55">{notPurchasedProducts.length} products</p>
              </div>
              {notPurchasedProducts.length > 0 ? (
                <div className="divide-y divide-purple-100/15 sm:grid sm:gap-5 sm:divide-y-0 sm:grid-cols-2 xl:grid-cols-3">{notPurchasedProducts.map(entry => renderProductCard(entry, false))}</div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-8 text-center text-sm text-white/55 backdrop-blur-xl">All products are purchased.</div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default MyProductsPage;
