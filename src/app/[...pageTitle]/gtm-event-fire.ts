'use client';

import { createElement, Suspense, useEffect, useMemo, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

interface DynamicPageGtmEventFireProps {
  pageName: string;
  pageRoute: string;
  pageId?: string;
}

const firedEventKeys = new Set<string>();

const GtmEventFireInner = ({ pageName, pageRoute, pageId }: DynamicPageGtmEventFireProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasFired = useRef(false);
  const query = searchParams.toString();
  const eventKey = useMemo(() => `dynamic-page:${pageId || pageRoute || pathname}:${query}`, [pageId, pageRoute, pathname, query]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GTM_ID || hasFired.current || firedEventKeys.has(eventKey)) return;

    hasFired.current = true;
    firedEventKeys.add(eventKey);

    sendGTMEvent({
      event: 'page_view',
      page_id: pageId,
      page_name: pageName,
      page_route: pageRoute,
      page_path: pathname,
      page_query: query,
      page_location: window.location.href,
      page_title: document.title || pageName,
    });
  }, [eventKey, pageId, pageName, pageRoute, pathname, query]);

  return null;
};

const GtmEventFire = (props: DynamicPageGtmEventFireProps) => createElement(Suspense, { fallback: null }, createElement(GtmEventFireInner, props));

export default GtmEventFire;
