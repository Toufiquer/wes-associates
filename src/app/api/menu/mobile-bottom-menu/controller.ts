/*
|-----------------------------------------
| setting up Mobile Bottom Menu Controller for the App
|-----------------------------------------
*/

import MobileBottomMenuSettings, { IMobileBottomMenuSettings } from './model';

export const DEFAULT_MOBILE_BOTTOM_MENU = {
  mobileMenuVariant: '4-icon',
  mobileMenuItems: [
    { id: 1, logo: 'Home', name: 'Home', path: '/' },
    { id: 2, logo: 'FolderKanban', name: 'Assets', path: '/dashboard/assets/products' },
    { id: 3, logo: 'ShoppingCart', name: 'Cart', path: '/cart' },
    { id: 4, logo: 'LogIn', name: 'Login', path: '/login' },
  ],
};

const mobileBottomMenuFields = ['mobileMenuVariant', 'mobileMenuItems'] as const;

export const getMobileBottomMenu = async () => {
  const settings = await MobileBottomMenuSettings.findOne().lean();
  return settings ? { ...DEFAULT_MOBILE_BOTTOM_MENU, ...settings } : DEFAULT_MOBILE_BOTTOM_MENU;
};

export const updateMobileBottomMenu = (data: Partial<IMobileBottomMenuSettings>) => {
  const cleanData = Object.fromEntries(mobileBottomMenuFields.map(field => [field, data[field]]).filter(([, value]) => value !== undefined));
  return MobileBottomMenuSettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true, runValidators: true });
};
