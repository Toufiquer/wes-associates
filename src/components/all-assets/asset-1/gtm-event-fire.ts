'use client';

import { sendGTMEvent } from '@next/third-parties/google';

import { parseAssetPrice } from '@/lib/asset-cart';
import { META_PIXEL_CURRENCY } from '@/lib/facebook-pixel';

import { IAssetData, TemplateItem } from './data';

const firedEventKeys = new Set<string>();

const getProductId = (item: TemplateItem) => String(item.sourceProductId || item.productUID || item.id);

export const fireAsset1AddToCartGtmEvent = (item: TemplateItem, settings: IAssetData) => {
  if (!process.env.NEXT_PUBLIC_GTM_ID) return;

  const productId = getProductId(item);
  const eventKey = `${settings.assetUid}:${productId}`;
  if (firedEventKeys.has(eventKey)) return;

  const value = parseAssetPrice(item.price);
  firedEventKeys.add(eventKey);

  sendGTMEvent({
    event: 'add_to_cart',
    currency: META_PIXEL_CURRENCY,
    value,
    items: [
      {
        item_id: productId,
        item_name: item.title,
        item_category: settings.assetName,
        price: value,
        quantity: 1,
      },
    ],
  });
};
