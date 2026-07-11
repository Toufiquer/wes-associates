'use client';

import { createElement, Suspense, useEffect, useMemo, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

import { Page101GtmEventData } from './data';

const firedEventKeys = new Set<string>();

const getNumericPrice = (value?: number) => {
  const price = Number(value || 0);
  return Number.isFinite(price) ? price : 0;
};

const GtmEventFireInner = ({ sectionData, product, isReady }: Page101GtmEventData) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasFired = useRef(false);
  const query = searchParams.toString();

  const eventKey = useMemo(() => {
    const productKey = product?._id || product?.title || '';
    return productKey ? `page-101:${pathname}?${query}:${productKey}` : '';
  }, [pathname, product?._id, product?.title, query]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GTM_ID || !isReady || !product || !eventKey) return;
    if (hasFired.current || firedEventKeys.has(eventKey)) return;

    const discountPrice = getNumericPrice(product.discount_price);
    const realPrice = getNumericPrice(product.real_price);
    const value = discountPrice || realPrice;

    hasFired.current = true;
    firedEventKeys.add(eventKey);

    sendGTMEvent({
      event: 'view_item',
      page_uid: sectionData.pageUid,
      page_name: sectionData.pageName,
      page_path: pathname,
      page_query: query,
      page_location: window.location.href,
      page_title: document.title,
      item_id: product._id || product.title,
      item_name: product.title,
      item_status: product.status,
      item_price: value,
      item_regular_price: realPrice,
      item_discount_price: discountPrice,
      currency: 'BDT',
      value,
      image_url: sectionData.imageUrl,
      live_demo_url: sectionData.liveDemoUrl,
      video_url: sectionData.videoUrl,
      items: [
        {
          item_id: product._id || product.title,
          item_name: product.title,
          price: value,
          currency: 'BDT',
          quantity: 1,
        },
      ],
    });
  }, [eventKey, isReady, pathname, product, query, sectionData.imageUrl, sectionData.liveDemoUrl, sectionData.pageName, sectionData.pageUid, sectionData.videoUrl]);

  return null;
};

const GtmEventFire = (props: Page101GtmEventData) => createElement(Suspense, { fallback: null }, createElement(GtmEventFireInner, props));

export default GtmEventFire;
