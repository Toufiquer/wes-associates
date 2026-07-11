'use client';

import { createElement, Suspense, useEffect, useMemo, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

import { AssetCartItem, parseAssetPrice } from '@/lib/asset-cart';
import { META_PIXEL_CURRENCY } from '@/lib/facebook-pixel';

interface CartGtmEventFireProps {
  items: AssetCartItem[];
  value: number;
  isReady: boolean;
}

const firedEventKeys = new Set<string>();

const getCartSignature = (items: AssetCartItem[]) =>
  items
    .map(item => `${item.cartId}:${item.productId}:${item.title}:${item.quantity}:${parseAssetPrice(item.price)}`)
    .sort()
    .join('|');

export const mapCartItemsToGtmItems = (items: AssetCartItem[]) =>
  items.map(item => ({
    item_id: String(item.productId),
    item_name: item.title,
    item_category: item.assetName,
    price: parseAssetPrice(item.price),
    quantity: Number(item.quantity) || 1,
  }));

const GtmEventFireInner = ({ items, value, isReady }: CartGtmEventFireProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasFired = useRef(false);
  const query = searchParams.toString();
  const cartSignature = useMemo(() => getCartSignature(items), [items]);
  const eventKey = useMemo(() => `cart:${pathname}?${query}:${cartSignature}`, [cartSignature, pathname, query]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GTM_ID || !isReady || hasFired.current || firedEventKeys.has(eventKey)) return;

    hasFired.current = true;
    firedEventKeys.add(eventKey);

    sendGTMEvent({
      event: 'view_cart',
      currency: META_PIXEL_CURRENCY,
      value,
      items: mapCartItemsToGtmItems(items),
    });
  }, [eventKey, isReady, items, value]);

  return null;
};

const GtmEventFire = (props: CartGtmEventFireProps) => createElement(Suspense, { fallback: null }, createElement(GtmEventFireInner, props));

export default GtmEventFire;
