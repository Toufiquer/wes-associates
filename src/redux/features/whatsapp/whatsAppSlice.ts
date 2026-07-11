/*
|-----------------------------------------
| setting up WhatsAppSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type WhatsAppButtonSize = 'sm' | 'md' | 'lg';
export type WhatsAppButtonPosition = 'bottom-right' | 'bottom-left';
export type WhatsAppFontFamily = 'font-sans' | 'font-serif' | 'font-mono';

export interface WhatsAppSettings {
  _id?: string;
  whatsAppButtonIsPublished: boolean;
  whatsAppButtonShowOnDesktop: boolean;
  whatsAppButtonShowOnMobile: boolean;
  whatsAppButtonNumber: string;
  whatsAppButtonMessage: string;
  whatsAppButtonLabel: string;
  whatsAppButtonBackgroundColor: string;
  whatsAppButtonTextColor: string;
  whatsAppButtonFontFamily: WhatsAppFontFamily;
  whatsAppButtonSize: WhatsAppButtonSize;
  whatsAppButtonPosition: WhatsAppButtonPosition;
  whatsAppButtonDisabledUrls: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface WhatsAppSettingsUpdateResponse {
  success: boolean;
  data: WhatsAppSettings;
}

export const whatsAppApi = createApi({
  reducerPath: 'whatsAppApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/whatsapp' }),
  tagTypes: ['WhatsAppSettings'],
  endpoints: builder => ({
    getWhatsAppSettings: builder.query<WhatsAppSettings, void>({
      query: () => '',
      providesTags: [{ type: 'WhatsAppSettings', id: 'CURRENT' }],
    }),
    updateWhatsAppSettings: builder.mutation<WhatsAppSettingsUpdateResponse, Partial<WhatsAppSettings>>({
      query: body => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'WhatsAppSettings', id: 'CURRENT' }],
    }),
  }),
});

export const { useGetWhatsAppSettingsQuery, useUpdateWhatsAppSettingsMutation } = whatsAppApi;
