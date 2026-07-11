/*
|-----------------------------------------
| setting up BrandSettingsSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type BrandFontSize = 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
export type BrandFontFamily = 'font-sans' | 'font-serif' | 'font-mono';
export type NavigationPosition = 'fixed' | 'sticky' | 'scroll';
export type MenuButtonMode = 'auth' | 'contact' | 'account';
export type MenuButtonRadius = 'none' | 'sm' | 'xl' | 'full';
export type MenuButtonPadding = 'none' | 'sm' | 'xl' | '2xl';
export type MobileMenuVariant = '4-icon' | '5-icon';
export type MobileMenuViewStyle = 'grid' | 'flex';
export type MobileMenuGridLayout = '2x2' | '2x3' | '3x2' | '3x3';

export interface MobileMenuItem {
  id: number;
  logo?: string;
  name: string;
  path: string;
}

export interface BrandSettings {
  _id?: string;
  brandName: string;
  logoUrl: string | null;
  logoIsPublished: boolean;
  textColor: string;
  fontSize: BrandFontSize;
  fontFamily: BrandFontFamily;
  menuTextColor: string;
  menuFontSize: BrandFontSize;
  menuFontFamily: BrandFontFamily;
  menuBackgroundColor: string;
  backgroundTransparent: number;
  menuSticky: boolean;
  menuPosition: NavigationPosition;
  menuButtonMode: MenuButtonMode;
  menuButtonContactText: string;
  menuButtonContactLink: string;
  menuButtonBackgroundColor: string;
  menuButtonTextColor: string;
  menuButtonPaddingY: MenuButtonPadding;
  menuButtonPaddingX: MenuButtonPadding;
  menuButtonRadius: MenuButtonRadius;
  menuButtonBackgroundTransparent: boolean;
  topBannerIsPublished: boolean;
  topBannerPosition: NavigationPosition;
  topBannerMessage: string;
  topBannerHighlightText: string;
  topBannerCountdownEndAt: string | null;
  topBannerButtonText: string;
  topBannerButtonUrl: string;
  topBannerBackgroundColor: string;
  topBannerTextColor: string;
  topBannerHighlightColor: string;
  topBannerButtonBackgroundColor: string;
  topBannerButtonTextColor: string;
  topBannerDisabledUrls: string[];
  cartIconIsPublished: boolean;
  cartIconBorderIsVisible: boolean;
  cartIconPath: string;
  cartIconBackgroundTransparent: boolean;
  cartIconBackgroundColor: string;
  cartIconTextColor: string;
  searchIconIsPublished: boolean;
  searchIconBorderIsVisible: boolean;
  searchIconPlaceholder: string;
  searchIconBackgroundTransparent: boolean;
  searchIconBackgroundColor: string;
  searchIconTextColor: string;
  searchPanelBackgroundColor: string;
  searchPanelTextColor: string;
  mobileMenuIsPublished: boolean;
  mobileMenuVariant: MobileMenuVariant;
  mobileMenuViewStyle: MobileMenuViewStyle;
  mobileMenuGridLayout: MobileMenuGridLayout;
  mobileMainMenuItems: MobileMenuItem[];
  mobileMenuItems: MobileMenuItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface BrandSettingsUpdateResponse {
  success: boolean;
  data: BrandSettings;
}

export const brandSettingsApi = createApi({
  reducerPath: 'brandSettingsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/menu/primary-menu' }),
  tagTypes: ['BrandSettings'],
  endpoints: builder => ({
    getBrandSettings: builder.query<BrandSettings, void>({
      query: () => '',
      providesTags: [{ type: 'BrandSettings', id: 'CURRENT' }],
    }),
    updateBrandSettings: builder.mutation<BrandSettingsUpdateResponse, Partial<BrandSettings>>({
      query: body => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'BrandSettings', id: 'CURRENT' }],
    }),
  }),
});

export const { useGetBrandSettingsQuery, useUpdateBrandSettingsMutation } = brandSettingsApi;
