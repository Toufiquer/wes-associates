/*
|-----------------------------------------
| setting up TopBannerSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, July, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export type TopBannerPosition = 'fixed' | 'sticky' | 'scroll';

export interface TopBannerSocialLink {
  id: string;
  label: string;
  iconUrl: string;
  url: string;
  isPublished: boolean;
}

export interface TopBannerConfig {
  topBannerIsPublished: boolean;
  topBannerPosition: TopBannerPosition;
  topBannerBackgroundColor: string;
  topBannerTextColor: string;
  topBannerDisabledUrls: string[];
  contactEmail: string;
  contactPhone: string;
  contactHours: string;
  topBannerSocialLinks: TopBannerSocialLink[];
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
