'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { trackMetaEvent } from '@/lib/facebook-pixel';

const FacebookPixelPageViewInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSkippedInitialPageView = useRef(false);

  useEffect(() => {
    if (!hasSkippedInitialPageView.current) {
      hasSkippedInitialPageView.current = true;
      return;
    }

    trackMetaEvent('PageView');
  }, [pathname, searchParams]);

  return null;
};

const FacebookPixelPageView = () => (
  <Suspense fallback={null}>
    <FacebookPixelPageViewInner />
  </Suspense>
);

export default FacebookPixelPageView;
