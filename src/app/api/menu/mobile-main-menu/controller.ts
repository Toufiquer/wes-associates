/*
|-----------------------------------------
| setting up Mobile Main Menu Controller for the App
|-----------------------------------------
*/

import { IMobileMainMenuSettings } from './model';
import { findMobileMainMenuSettings, updateMobileMainMenuSettings } from './service';

export const DEFAULT_MOBILE_MAIN_MENU = {
  mobileMenuIsPublished: true,
  mobileMenuViewStyle: 'grid',
  mobileMenuGridLayout: '2x2',
  mobileMainMenuItems: [
    { id: 1, logo: 'Home', name: 'Home', path: '/' },
    { id: 2, logo: 'LayoutGrid', name: 'Categories', path: '/categories' },
    { id: 3, logo: 'FolderKanban', name: 'Assets', path: '/dashboard/assets/products' },
    { id: 4, logo: 'ShoppingCart', name: 'Cart', path: '/cart' },
  ],
};

const mobileMainMenuFields = ['mobileMenuIsPublished', 'mobileMenuViewStyle', 'mobileMenuGridLayout', 'mobileMainMenuItems'] as const;

export const getMobileMainMenu = async () => {
  const settings = await findMobileMainMenuSettings();
  return settings ? { ...DEFAULT_MOBILE_MAIN_MENU, ...settings } : DEFAULT_MOBILE_MAIN_MENU;
};

export const updateMobileMainMenu = (data: Partial<IMobileMainMenuSettings>) => {
  const cleanData = Object.fromEntries(mobileMainMenuFields.map(field => [field, data[field]]).filter(([, value]) => value !== undefined));
  return updateMobileMainMenuSettings(cleanData);
};
