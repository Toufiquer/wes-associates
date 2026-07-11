/*
|-----------------------------------------
| setting up Mobile Dashboard Footer Menu Controller for the App
|-----------------------------------------
*/

import MobileDashboardFooterMenuSettings, { IMobileDashboardFooterMenuSettings } from './model';

export const DEFAULT_MOBILE_DASHBOARD_FOOTER_MENU = {
  dashboardFooterMenuItems: [
    { id: 1, logo: 'Home', name: 'Home', path: '/dashboard', action: 'link' },
    { id: 2, logo: 'Package', name: 'Products', path: '/dashboard/assets/products', action: 'link' },
    { id: 3, logo: 'ShoppingCart', name: 'Orders', path: '/dashboard/assets/orders', action: 'link' },
    { id: 4, logo: 'Settings', name: 'Menu', path: '', action: 'menu' },
  ],
};

const mobileDashboardFooterMenuFields = ['dashboardFooterMenuItems'] as const;

export const getMobileDashboardFooterMenu = async () => {
  const settings = await MobileDashboardFooterMenuSettings.findOne().lean();
  return settings ? { ...DEFAULT_MOBILE_DASHBOARD_FOOTER_MENU, ...settings } : DEFAULT_MOBILE_DASHBOARD_FOOTER_MENU;
};

export const updateMobileDashboardFooterMenu = (data: Partial<IMobileDashboardFooterMenuSettings>) => {
  const cleanData = Object.fromEntries(mobileDashboardFooterMenuFields.map(field => [field, data[field]]).filter(([, value]) => value !== undefined));
  return MobileDashboardFooterMenuSettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true, runValidators: true });
};
