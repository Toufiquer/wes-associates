'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type GtmPageViewEvent = {
  event: 'page_view';
  page_path: string;
  page_query: string;
  page_location: string;
  page_title: string;
};

type WindowWithDataLayer = Window & {
  dataLayer?: GtmPageViewEvent[];
};

const GtmRouteChangeInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GTM_ID) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (lastTrackedUrl.current === pagePath) return;

    lastTrackedUrl.current = pagePath;

    const gtmWindow = window as WindowWithDataLayer;
    gtmWindow.dataLayer = gtmWindow.dataLayer || [];

    gtmWindow.dataLayer.push({
      event: 'page_view',
      page_path: pagePath,
      page_query: query,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
};

const GtmRouteChange = () => (
  <Suspense fallback={null}>
    <GtmRouteChangeInner />
  </Suspense>
);

export default GtmRouteChange;
