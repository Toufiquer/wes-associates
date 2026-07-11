'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

const GtmRouteChangeInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSkippedInitialPageView = useRef(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GTM_ID) return;

    if (!hasSkippedInitialPageView.current) {
      hasSkippedInitialPageView.current = true;
      return;
    }

    const query = searchParams.toString();

    sendGTMEvent({
      event: 'page_view',
      page_path: pathname,
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
