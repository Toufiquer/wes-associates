/*
|-----------------------------------------
| setting up TopBannerSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, July, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export type TopBannerPosition = 'fixed' | 'sticky' | 'scroll';
export type TopBannerActionId = 'call' | 'email' | 'location' | 'messenger' | 'whatsapp';

export interface TopBannerActionLink {
  id: TopBannerActionId;
  label: string;
  isPublished: boolean;
  fontColor: string;
  size: number;
  padding: number;
  url: string;
  openInNewTab: boolean;
}

export interface TopBannerConfig {
  topBannerIsPublished: boolean;
  topBannerPosition: TopBannerPosition;
  topBannerBackgroundColor: string;
  topBannerTextColor: string;
  topBannerDisabledUrls: string[];
  topBannerActionLinks: TopBannerActionLink[];
}

interface UpdateTopBannerResponse {
  success: boolean;
  data: TopBannerConfig;
}

export const topBannerApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTopBanner: builder.query<TopBannerConfig, void>({
      query: () => '/api/top-banner',
      providesTags: [{ type: 'tagTypeTopBanner', id: 'CURRENT' }],
    }),
    updateTopBanner: builder.mutation<UpdateTopBannerResponse, TopBannerConfig>({
      query: body => ({
        url: '/api/top-banner',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'tagTypeTopBanner', id: 'CURRENT' }],
    }),
  }),
});

export const { useGetTopBannerQuery, useUpdateTopBannerMutation } = topBannerApi;
