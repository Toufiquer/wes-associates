import { META_PIXEL_CURRENCY, trackMetaEvent } from './facebook-pixel';

export interface AssetCartItem {
  cartId: string;
  productId: string | number;
  assetUid: string;
  assetName: string;
  title: string;
  price: string;
  image?: string;
  icon?: string;
  downloadUrl?: string;
  downloadName?: string;
  quantity: number;
}

export const ASSET_CART_STORAGE_KEY = 'webapp_asset_cart';
export const ASSET_CART_UPDATED_EVENT = 'asset-cart-updated';

export const parseAssetPrice = (price: string) => {
  const value = Number(price.replace(/[^\d.]/g, ''));
  return Number.isFinite(value) ? value : 0;
};

const readCartFromStorage = (): AssetCartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const rawCart = window.localStorage.getItem(ASSET_CART_STORAGE_KEY);
    if (!rawCart) return [];
    const parsed = JSON.parse(rawCart);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getAssetCart = () => readCartFromStorage();

export const saveAssetCart = (items: AssetCartItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ASSET_CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(ASSET_CART_UPDATED_EVENT, { detail: items }));
};

export const addAssetToCart = (item: Omit<AssetCartItem, 'cartId' | 'quantity'>) => {
  const cart = readCartFromStorage();
  const cartId = `${item.assetUid}-${item.productId}`;
  const existingItem = cart.find(cartItem => cartItem.cartId === cartId);
  const itemValue = parseAssetPrice(item.price);

  trackMetaEvent('AddToCart', {
    value: itemValue,
    currency: META_PIXEL_CURRENCY,
    content_ids: [String(item.productId)],
    content_name: item.title,
    content_type: 'product',
  });

  if (existingItem) {
    const nextCart = cart.map(cartItem => (cartItem.cartId === cartId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
    saveAssetCart(nextCart);
    return nextCart;
  }

  const nextCart = [...cart, { ...item, cartId, quantity: 1 }];
  saveAssetCart(nextCart);
  return nextCart;
};
