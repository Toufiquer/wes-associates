/*
|-----------------------------------------
| setting up Primary Menu Controller for the App
|-----------------------------------------
*/

import { revalidateTag, unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

import connectToDB from '@/app/api/utils/mongoose';

import { DEFAULT_CART_LINK } from '../cart-link/controller';
import { DEFAULT_TOP_BANNER } from '../../top-banner/controller';
import { DEFAULT_MOBILE_MAIN_MENU } from '../mobile-main-menu/controller';
import { DEFAULT_MOBILE_BOTTOM_MENU } from '../../footer-settings/mobile-bottom-menu/v1/controller';
import { DEFAULT_SEARCH_MENU_BUTTON } from '../search-menu-button/controller';
import Menu, { BrandSettings, IPrimaryMenuSettings } from './model';

const DEFAULT_SETTINGS = {
  brandName: 'App Generator',
  logoUrl: '/logo.png',
  logoIsPublished: true,
  logoDesktopOffsetX: 0,
  logoDesktopOffsetY: 0,
  logoMobileOffsetX: 0,
  logoMobileOffsetY: 0,
  textColor: '#38bdf8',
  fontSize: 'text-2xl',
  fontFamily: 'font-sans',
  menuTextColor: '#94a3b8',
  menuFontSize: 'text-lg',
  menuFontFamily: 'font-sans',
  desktopMenuFontSize: 'text-base',
  desktopMenuFontFamily: 'font-noto-sans',
  menuBackgroundColor: '#0f172a',
  backgroundTransparent: 100,
  menuSticky: true,
  menuPosition: 'fixed',
  menuButtonMode: 'auth',
  menuButtonIconName: '',
  menuButtonContactText: 'Contact Me',
  menuButtonContactLink: '/contact',
  menuButtonBackgroundColor: '#ffffff',
  menuButtonTextColor: '#0f172a',
  menuButtonPaddingY: 'xl',
  menuButtonPaddingX: '2xl',
  menuButtonRadius: 'full',
  menuButtonBackgroundTransparent: false,
  ...DEFAULT_TOP_BANNER,
  ...DEFAULT_CART_LINK,
  ...DEFAULT_SEARCH_MENU_BUTTON,
  ...DEFAULT_MOBILE_MAIN_MENU,
  ...DEFAULT_MOBILE_BOTTOM_MENU,
};

const primaryMenuFields = [
  'brandName',
  'logoUrl',
  'logoIsPublished',
  'logoDesktopOffsetX',
  'logoDesktopOffsetY',
  'logoMobileOffsetX',
  'logoMobileOffsetY',
  'textColor',
  'fontSize',
  'fontFamily',
  'menuTextColor',
  'menuFontSize',
  'menuFontFamily',
  'desktopMenuFontSize',
  'desktopMenuFontFamily',
  'menuBackgroundColor',
  'backgroundTransparent',
  'menuSticky',
  'menuPosition',
  'menuButtonMode',
  'menuButtonIconName',
  'menuButtonContactText',
  'menuButtonContactLink',
  'menuButtonBackgroundColor',
  'menuButtonTextColor',
  'menuButtonPaddingY',
  'menuButtonPaddingX',
  'menuButtonRadius',
  'menuButtonBackgroundTransparent',
] as const;

const formatResponse = (data: unknown, message: string, status: number = 200) => {
  return NextResponse.json({ data, message, status }, { status });
};

export const getMenuData = unstable_cache(
  async (type: string = 'main-menu') => {
    await connectToDB();
    const menu = await Menu.findOne({ type }).lean();
    return menu ? JSON.parse(JSON.stringify(menu)) : null;
  },
  ['menu-data'],
  { tags: ['menu'] },
);

export async function getMenu(type: string = 'main-menu') {
  try {
    const menu = await getMenuData(type);
    if (!menu) return formatResponse({ items: [] }, 'Menu not found', 404);
    return formatResponse(menu, 'Menu fetched successfully');
  } catch (error: unknown) {
    console.error('Error fetching menu:', error);
    return formatResponse(null, error instanceof Error ? error.message : 'Internal Server Error', 500);
  }
}

export async function updateMenu(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();
    const { type = 'main-menu', items } = body;
    if (!items || !Array.isArray(items)) return formatResponse(null, 'Invalid items format', 400);

    const updatedMenu = await Menu.findOneAndUpdate({ type }, { items }, { new: true, upsert: true });
    revalidateTag('menu');
    return formatResponse(updatedMenu, 'Menu updated successfully');
  } catch (error: unknown) {
    console.error('Error updating menu:', error);
    return formatResponse(null, error instanceof Error ? error.message : 'Internal Server Error', 500);
  }
}

export const getPrimaryMenu = async () => {
  const settings = await BrandSettings.findOne().lean();
  return settings ? { ...DEFAULT_SETTINGS, ...settings } : DEFAULT_SETTINGS;
};

export const updatePrimaryMenu = async (data: Partial<IPrimaryMenuSettings>) => {
  const cleanData = Object.fromEntries(primaryMenuFields.map(field => [field, data[field]]).filter(([, value]) => value !== undefined));
  return BrandSettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true, runValidators: true });
};
