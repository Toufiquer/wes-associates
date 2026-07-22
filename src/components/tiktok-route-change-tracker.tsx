'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const TikTokRouteChangeTrackerInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    // The TikTokPixel bootstrap script tracks the initial PageView.
    if (lastTrackedUrl.current === null) {
      lastTrackedUrl.current = pagePath;
      return;
    }

    if (lastTrackedUrl.current === pagePath || typeof window.ttq?.page !== 'function') return;

    lastTrackedUrl.current = pagePath;
    window.ttq.page();
  }, [pathname, searchParams]);

  return null;
};

const TikTokRouteChangeTracker = () => (
  <Suspense fallback={null}>
    <TikTokRouteChangeTrackerInner />
  </Suspense>
);

export default TikTokRouteChangeTracker;
