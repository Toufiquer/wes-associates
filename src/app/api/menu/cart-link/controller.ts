/*
|-----------------------------------------
| setting up Cart Link Controller for the App
|-----------------------------------------
*/

import CartLinkSettings, { ICartLinkSettings } from './model';

export const DEFAULT_CART_LINK = {
  cartIconIsPublished: true,
  cartIconBorderIsVisible: true,
  cartIconPath: '/cart',
  cartIconBackgroundTransparent: false,
  cartIconBackgroundColor: '#ffffff',
  cartIconTextColor: '#0f172a',
};

const cartLinkFields = [
  'cartIconIsPublished',
  'cartIconBorderIsVisible',
  'cartIconPath',
  'cartIconBackgroundTransparent',
  'cartIconBackgroundColor',
  'cartIconTextColor',
] as const;

export const getCartLink = async () => {
  const settings = await CartLinkSettings.findOne().lean();
  return settings ? { ...DEFAULT_CART_LINK, ...settings } : DEFAULT_CART_LINK;
};

export const updateCartLink = (data: Partial<ICartLinkSettings>) => {
  const cleanData = Object.fromEntries(cartLinkFields.map(field => [field, data[field]]).filter(([, value]) => value !== undefined));
  return CartLinkSettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true, runValidators: true });
};
