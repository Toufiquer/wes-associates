'use client';

import { Check, Download, ExternalLink, Play, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';
import { useEffect, useMemo, useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaPinterestP, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { toast } from 'react-toastify';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RichTextPreview } from '@/components/dashboard-ui/RichTextEditorField';
import { addAssetToCart } from '@/lib/asset-cart';
import { useGetProductByIdQuery, useGetProductsQuery } from '@/redux/features/products/productsSlice';

import { defaultDataPage101, ISection101Data, Page101ProductItem, ProductShowcaseTimer, Section101Props } from './data';
import GtmEventFire from './gtm-event-fire';

const tickTimer = (timer: ProductShowcaseTimer): ProductShowcaseTimer => {
  let { days = 0, hours, minutes, seconds } = timer;

  if (seconds > 0) {
    seconds -= 1;
  } else {
    seconds = 59;
    if (minutes > 0) {
      minutes -= 1;
    } else {
      minutes = 59;
      if (hours > 0) {
        hours -= 1;
      } else if (days > 0) {
        days -= 1;
        hours = 23;
      }
    }
  }

  return days > 0 ? { days, hours, minutes, seconds } : { hours, minutes, seconds };
};

const parseSectionData = (data?: Section101Props['data']): Partial<ISection101Data> => {
  if (!data) return {};
  if (typeof data !== 'string') return data;

  try {
    return JSON.parse(data) as Partial<ISection101Data>;
  } catch {
    return {};
  }
};

const formatPrice = (price?: number) => {
  const numericPrice = Number(price || 0);
  return numericPrice > 0 ? `${numericPrice.toLocaleString('en-US')}৳` : '';
};

const getProductNumericPrice = (product?: Page101ProductItem) => {
  const discountPrice = Number(product?.discount_price || 0);
  const realPrice = Number(product?.real_price || 0);
  const value = discountPrice || realPrice;

  return Number.isFinite(value) ? value : 0;
};

const normalizeTitleValue = (value?: string | null) => {
  if (!value) return '';

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const titleToSearchQuery = (value?: string | null) => normalizeTitleValue(value).replace(/\+/g, ' ').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

const titleToMatchKey = (value?: string | null) => titleToSearchQuery(value).toLowerCase();

const getProductTimer = (offerEnds?: string, fallback?: ProductShowcaseTimer): ProductShowcaseTimer => {
  if (!offerEnds) return fallback || defaultDataPage101.timer;

  const offerEndDate = new Date(offerEnds);
  if (Number.isNaN(offerEndDate.getTime())) return fallback || defaultDataPage101.timer;

  const remainingSeconds = Math.max(0, Math.floor((offerEndDate.getTime() - Date.now()) / 1000));
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return days > 0 ? { days, hours, minutes, seconds } : { hours, minutes, seconds };
};

const getVideoEmbedUrl = (url?: string) => {
  if (!url) return '';

  try {
    const videoUrl = new URL(url);
    if (videoUrl.hostname.includes('youtu.be')) {
      const videoId = videoUrl.pathname.replace('/', '');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (videoUrl.hostname.includes('youtube.com')) {
      const videoId = videoUrl.searchParams.get('v') || videoUrl.pathname.split('/').filter(Boolean).pop();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
  } catch {
    return url;
  }

  return url;
};

const mapProductToSectionData = (product: Page101ProductItem | undefined, fallback: ISection101Data): ISection101Data => {
  if (!product) return fallback;

  const primaryImage = product.primary_images?.url || product.product_images?.find(item => item?.url)?.url || fallback.imageUrl;
  const primaryImageAlt = product.primary_images?.name || product.title || fallback.imageAlt;
  const discountPrice = Number(product.discount_price || 0);
  const realPrice = Number(product.real_price || 0);
  const price = formatPrice(discountPrice || realPrice) || fallback.price;
  const priceLabel = discountPrice > 0 && realPrice > discountPrice ? `Regular ${formatPrice(realPrice)}` : fallback.priceLabel;

  return {
    ...fallback,
    imageUrl: primaryImage,
    imageAlt: primaryImageAlt,
    categoryTitle: fallback.categoryTitle,
    priceLabel,
    price,
    productTitle: product.title || fallback.productTitle,
    features: product.features?.filter(Boolean).length ? product.features.filter(Boolean) : fallback.features,
    productDescriptions: product.description || fallback.productDescriptions,
    timer: getProductTimer(product.offerEnds, fallback.timer),
    shareButtonsVisible: product.shareButtonsVisible !== false,
    liveDemoUrl: product.liveUrl || fallback.liveDemoUrl,
    videoUrl: product.VideoUrl || fallback.videoUrl,
  };
};

const QueryPage101 = ({ data }: Section101Props) => {
  const router = useRouter();
  const [templateId, setTemplateId] = useState('');
  const [templateTitle, setTemplateTitle] = useState('');
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const sectionData = useMemo(() => ({ ...defaultDataPage101, ...parseSectionData(data) }), [data]);
  const productSearchQuery = useMemo(() => titleToSearchQuery(templateTitle), [templateTitle]);
  const productTitleKey = useMemo(() => titleToMatchKey(templateTitle), [templateTitle]);
  const {
    data: productResponse,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductByIdQuery(templateId, { skip: !isLocationReady || !templateId }) as {
    data?: { data?: Page101ProductItem };
    isLoading?: boolean;
    isError?: boolean;
  };
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductsQuery(
    { page: 1, limit: sectionData.productLookupLimit || defaultDataPage101.productLookupLimit, q: productSearchQuery, status: 'active' },
    { skip: !isLocationReady || Boolean(templateId) || !productSearchQuery },
  ) as {
    data?: { data?: { products?: Page101ProductItem[] } };
    isLoading?: boolean;
    isError?: boolean;
  };
  const matchedProduct = useMemo(() => {
    const products = productsResponse?.data?.products || [];
    if (!productTitleKey) return products[0];

    return products.find(product => titleToMatchKey(product.title) === productTitleKey) || products[0];
  }, [productTitleKey, productsResponse?.data?.products]);
  const fetchedProduct = productResponse?.data || matchedProduct;
  const settings: ISection101Data = useMemo(() => mapProductToSectionData(fetchedProduct, sectionData), [fetchedProduct, sectionData]);
  const [timeLeft, setTimeLeft] = useState<ProductShowcaseTimer>(settings.timer);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const timerEntries = useMemo(() => Object.entries(timeLeft).filter(([, value]) => typeof value === 'number'), [timeLeft]);
  const hasDays = typeof timeLeft.days === 'number' && timeLeft.days > 0;
  const isLoading = isProductLoading || isProductsLoading;
  const isError = isProductError || isProductsError;
  const isProductResolving = !isLocationReady || isLoading;
  const videoEmbedUrl = useMemo(() => getVideoEmbedUrl(settings.videoUrl), [settings.videoUrl]);
  const shareLinks = useMemo(() => {
    const url = shareUrl || '#';
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(settings.productTitle);
    const encodedImage = encodeURIComponent(settings.imageUrl);

    return [
      {
        label: 'Facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        icon: FaFacebookF,
        className: 'border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white',
      },
      {
        label: 'LinkedIn',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        icon: FaLinkedinIn,
        className: 'border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white',
      },
      {
        label: 'Pinterest',
        href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
        icon: FaPinterestP,
        className: 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
      },
      {
        label: 'WhatsApp',
        href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        icon: FaWhatsapp,
        className: 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
      },
      {
        label: 'Email',
        href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A${encodedUrl}`,
        icon: MdEmail,
        className: 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
      },
    ];
  }, [settings.imageUrl, settings.productTitle, shareUrl]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTemplateId(params.get('id') || '');
    setTemplateTitle(params.get('title') || '');
    setShareUrl(window.location.href);
    setIsLocationReady(true);
  }, []);

  useEffect(() => {
    setTimeLeft(settings.timer);
  }, [settings.timer]);

  useEffect(() => {
    setIsImageLoading(Boolean(settings.imageUrl));
  }, [settings.imageUrl]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(prev => tickTimer(prev));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const renderProductDescription = (className = '') =>
    settings.productDescriptions.trim() ? (
      <Accordion
        type="single"
        collapsible
        defaultValue="product-description"
        className={`rounded-xl  border border-gray-100 bg-white p-4 shadow-xl px-4 ${className}`}
      >
        <AccordionItem value="product-description" className="border-none">
          <AccordionTrigger className="py-4 text-2xl font-bold text-gray-800 hover:no-underline">Product Description</AccordionTrigger>
          <AccordionContent className="pb-4 text-gray-600">
            <hr className="text-slate-300/50" />
            <RichTextPreview
              value={settings.productDescriptions}
              className="bg-transparent text-gray-600 [&_a]:text-blue-600 [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_h4]:text-gray-900 [&_h5]:text-gray-900 [&_h6]:text-gray-900"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ) : null;

  const renderVideo = () =>
    videoEmbedUrl ? (
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
          <Play className="h-5 w-5 text-blue-600" />
          Tutorial
        </div>
        <div className="aspect-video overflow-hidden rounded-xl bg-slate-950">
          <iframe
            src={videoEmbedUrl}
            title={`${settings.productTitle} tutorial`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    ) : null;

  const handleBuyNow = () => {
    if (isProductResolving) {
      toast.info('Product is still loading.');
      return;
    }

    const productId = fetchedProduct?._id || settings.productTitle;

    if (process.env.NEXT_PUBLIC_GTM_ID && fetchedProduct) {
      const value = getProductNumericPrice(fetchedProduct);

      sendGTMEvent({
        event: 'add_to_cart',
        currency: 'BDT',
        value,
        items: [
          {
            item_id: productId,
            item_name: fetchedProduct.title || settings.productTitle,
            price: value,
            quantity: 1,
          },
        ],
      });
    }

    addAssetToCart({
      productId,
      assetUid: settings.pageUid,
      assetName: settings.pageName,
      title: settings.productTitle,
      price: settings.price,
      image: settings.imageUrl,
      downloadUrl: fetchedProduct?.uploadProduct?.url,
      downloadName: fetchedProduct?.uploadProduct?.name || settings.productTitle,
    });

    router.push('/cart');
  };

  return (
    <div className="w-full bg-white pb-20">
      <GtmEventFire sectionData={settings} product={fetchedProduct} isReady={!isProductResolving} />
      <div className="mx-auto max-w-7xl md:space-y-8 md:py-8 -mb-8 md:mb-0 md:pb-20">
        <div className="grid items-stretch gap-8 md:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            {(isLoading || isError) && (
              <div className={`m-4 rounded-lg px-4 py-3 text-sm font-semibold ${isError ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                {isError ? 'Product data could not be loaded. Showing saved page content.' : 'Loading product data...'}
              </div>
            )}
            <div className="relative flex min-h-64 flex-1 items-center justify-center overflow-hidden md:min-h-[500px] p-4 rounded-sm">
              {(isProductResolving || isImageLoading) && (
                <div className="absolute inset-0 z-10 flex min-h-64 items-center justify-center bg-gray-100 text-sm font-semibold text-gray-500">
                  Loading image...
                </div>
              )}
              {!isProductResolving && settings.imageUrl && (
                <Image
                  src={settings.imageUrl}
                  alt={settings.imageAlt}
                  width={1200}
                  height={800}
                  className={`w-full rounded-sm h-auto max-h-[700px] ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                  unoptimized
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-4 bg-white px-5 pb-5">
              <a
                href={settings.videoUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-12 items-center justify-center rounded-full border border-blue-600 px-6 text-sm font-black uppercase tracking-wide text-blue-600 transition-colors hover:bg-blue-600 hover:text-white sm:min-w-36 ${
                  settings.videoUrl ? '' : 'pointer-events-none opacity-50'
                }`}
              >
                {settings.tutorialButtonText}
              </a>
              <a
                href={settings.liveDemoUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-blue-600 px-6 text-sm font-black uppercase tracking-wide text-blue-600 transition-colors hover:bg-blue-600 hover:text-white sm:min-w-36 ${
                  settings.liveDemoUrl && settings.liveDemoUrl !== '#' ? '' : 'pointer-events-none opacity-50'
                }`}
              >
                LIVE DEMO <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="h-full space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-start gap-4">
              <h3 className="text-2xl text-gray-600">Price</h3>
              <p className="text-4xl font-bold text-blue-600"> {settings.price}</p>
            </div>

            <h2 className="border-t pt-4 text-xl font-bold text-gray-800">{settings.productTitle}</h2>

            <ul className="space-y-3">
              {settings.features.map((feature, index) => (
                <li key={`${feature}-${index}`} className="flex items-center gap-3 text-gray-600">
                  <Check className="h-5 w-5 text-blue-500" /> {feature}
                </li>
              ))}
            </ul>
            <p className="text-xl font-bold -mb-1 pb-3 text-blue-600/80">Special Offer Ends</p>
            <div className={`grid gap-2 ${hasDays ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {timerEntries.map(([key, value]) => (
                <div key={key} className="rounded-lg bg-blue-600 p-2 text-center text-white">
                  <div className="text-2xl font-bold">{String(value).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase">{key}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isProductResolving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <ShoppingCart size={20} /> {settings.buyButtonText}
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-colors hover:bg-blue-700">
                <Download size={20} /> {settings.membershipButtonText}
              </button>
            </div>

            {settings.shareButtonsVisible && (
              <div className="flex flex-wrap items-center justify-start gap-2 border-t pt-4">
                <span className="mr-1 text-xl font-semibold text-gray-900">শেয়ার করুন</span>
                {shareLinks.map(item => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-sm border-2 bg-white transition-colors ${item.className}`}
                      aria-label={`Share on ${item.label}`}
                      title={`Share on ${item.label}`}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {renderProductDescription()}
        {renderVideo()}
      </div>
    </div>
  );
};

export default QueryPage101;
